"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/shadcn-ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/shadcn-ui/form";
import { Input } from "@/components/shadcn-ui/input";
import { Separator } from "@/components/shadcn-ui/separator";
import { Checkbox } from "@/components/shadcn-ui/checkbox";
import { useState } from "react";
import { useUsersStore } from "@/stores/users.store";
import { useAuth } from "@/contexts/AuthContext";
import { useManagementStore } from "@/stores/management.store";
import { useToast } from "@/hooks/use-toast";
import { AVAILABLE_FEATURES, UserWithPermissions } from "@/types/user-permission";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

// Form validation schema
const userFormSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address",
  }),
  permissions: z.record(
    z.string(),
    z.object({
      canView: z.boolean().default(false),
      canCreate: z.boolean().default(false),
      canEdit: z.boolean().default(false),
      canDelete: z.boolean().default(false),
    })
  ),
});

// Form types
type UserFormValues = z.infer<typeof userFormSchema>;

// Props interface
interface UserFormProps {
  user?: UserWithPermissions;
  isEdit?: boolean;
}

export function UserForm({ user, isEdit = false }: UserFormProps) {
  const { session } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const t = useTranslations("Users");

  const organizationId = useManagementStore(
    (state) => state.managedOrganization?.id
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userExists, setUserExists] = useState<boolean>(!!user);
  const [foundUser, setFoundUser] = useState<UserWithPermissions | null>(user || null);

  const { findUserByEmail, createUserPermissions, updateUserPermissions } = useUsersStore();

  // Initialize form with default values or existing user data
  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      email: user?.email || "",
      permissions: user
        ? user.permissions.reduce((acc, permission) => {
            acc[permission.feature] = {
              canView: permission.canView,
              canCreate: permission.canCreate,
              canEdit: permission.canEdit,
              canDelete: permission.canDelete,
            };
            return acc;
          }, {} as Record<string, { canView: boolean; canCreate: boolean; canEdit: boolean; canDelete: boolean }>)
        : AVAILABLE_FEATURES.reduce((acc, feature) => {
            acc[feature] = {
              canView: false,
              canCreate: false,
              canEdit: false,
              canDelete: false,
            };
            return acc;
          }, {} as Record<string, { canView: boolean; canCreate: boolean; canEdit: boolean; canDelete: boolean }>),
    },
  });

  // Handler for searching a user by email
  const handleSearchUser = async (email: string) => {
    if (!session?.accessToken || !email) return;
    
    try {
      const response = await findUserByEmail({
        email,
        accessToken: session.accessToken,
      });

      if (response.error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: response.error,
        });
        setUserExists(false);
        setFoundUser(null);
        return;
      }

      if (response.data) {
        setUserExists(response.data.exists);
        setFoundUser(response.data.user);

        if (!response.data.exists) {
          toast({
            variant: "destructive",
            title: "User not found",
            description: "No user with this email address was found in the system.",
          });
        }
      }
    } catch (error) {
      console.error("Error searching user:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to search for user. Please try again.",
      });
    }
  };

  // Submit handler
  const onSubmit = async (values: UserFormValues) => {
    if (!session?.accessToken || !organizationId) return;

    setIsSubmitting(true);

    try {
      // Prepare permissions data
      const permissionsData = Object.entries(values.permissions).map(([feature, perms]) => ({
        feature,
        ...perms,
      }));

      if (isEdit && user) {
        // Update existing user permissions
        const response = await updateUserPermissions({
          data: {
            userId: user.id,
            organizationId,
            permissions: permissionsData,
          },
          accessToken: session.accessToken,
        });

        if (response.error) {
          throw new Error(response.error);
        }

        toast({
          title: "Success",
          description: "User permissions updated successfully",
        });
      } else if (foundUser) {
        // Create permissions for existing user
        const response = await createUserPermissions({
          data: {
            email: values.email,
            organizationId,
            permissions: permissionsData,
          },
          accessToken: session.accessToken,
        });

        if (response.error) {
          throw new Error(response.error);
        }

        toast({
          title: "Success",
          description: "User added to organization with permissions",
        });
      } else {
        throw new Error("User not found");
      }

      // Redirect back to users page
      router.push("/dashboard/users");
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save user permissions",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper for checking email
  const checkEmail = async () => {
    const email = form.getValues("email");
    if (email) {
      await handleSearchUser(email);
    }
  };

  // Helper for setting all permissions for a feature
  const setAllPermissions = (feature: string, value: boolean) => {
    form.setValue(`permissions.${feature}.canView`, value);
    form.setValue(`permissions.${feature}.canCreate`, value);
    form.setValue(`permissions.${feature}.canEdit`, value);
    form.setValue(`permissions.${feature}.canDelete`, value);
  };

  // Helper for setting all permissions of the same type across features
  const setPermissionType = (type: 'canView' | 'canCreate' | 'canEdit' | 'canDelete', value: boolean) => {
    AVAILABLE_FEATURES.forEach(feature => {
      form.setValue(`permissions.${feature}.${type}`, value);
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("form.email")}</FormLabel>
                <div className="flex gap-2">
                  <FormControl>
                    <Input
                      placeholder="email@example.com"
                      {...field}
                      disabled={isEdit || userExists}
                    />
                  </FormControl>
                  {!isEdit && !userExists && (
                    <Button 
                      type="button" 
                      variant="secondary"
                      onClick={checkEmail}
                    >
                      {t("form.searchUser")}
                    </Button>
                  )}
                </div>
                <FormDescription>
                  {isEdit 
                    ? t("form.emailEditDesc") 
                    : t("form.emailDesc")}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {(isEdit || userExists) && (
            <>
              <div className="rounded-md border p-4">
                <h3 className="text-lg font-medium mb-4">{t("form.permissionsTitle")}</h3>
                
                <div className="mb-6">
                  <p className="text-sm text-muted-foreground mb-2">{t("form.quickActions")}</p>
                  <div className="flex flex-wrap gap-2">
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm"
                      onClick={() => AVAILABLE_FEATURES.forEach(feature => setAllPermissions(feature, true))}
                    >
                      {t("form.selectAll")}
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm"
                      onClick={() => AVAILABLE_FEATURES.forEach(feature => setAllPermissions(feature, false))}
                    >
                      {t("form.selectNone")}
                    </Button>
                    <Separator className="my-2 w-full" />
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm"
                      onClick={() => setPermissionType('canView', true)}
                    >
                      {t("form.allView")}
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm"
                      onClick={() => setPermissionType('canCreate', true)}
                    >
                      {t("form.allCreate")}
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm"
                      onClick={() => setPermissionType('canEdit', true)}
                    >
                      {t("form.allEdit")}
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm"
                      onClick={() => setPermissionType('canDelete', true)}
                    >
                      {t("form.allDelete")}
                    </Button>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-5 gap-2 mb-2 border-b pb-1">
                    <div className="font-medium">{t("form.feature")}</div>
                    <div className="font-medium text-center">{t("form.view")}</div>
                    <div className="font-medium text-center">{t("form.create")}</div>
                    <div className="font-medium text-center">{t("form.edit")}</div>
                    <div className="font-medium text-center">{t("form.delete")}</div>
                  </div>

                  {AVAILABLE_FEATURES.map((feature) => (
                    <div key={feature} className="grid grid-cols-5 gap-2 items-center">
                      <div className="capitalize">{feature.replace('-', ' ')}</div>
                      
                      <FormField
                        control={form.control}
                        name={`permissions.${feature}.canView`}
                        render={({ field }) => (
                          <FormItem className="flex justify-center">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name={`permissions.${feature}.canCreate`}
                        render={({ field }) => (
                          <FormItem className="flex justify-center">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name={`permissions.${feature}.canEdit`}
                        render={({ field }) => (
                          <FormItem className="flex justify-center">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name={`permissions.${feature}.canDelete`}
                        render={({ field }) => (
                          <FormItem className="flex justify-center">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting 
                    ? t("form.saving")
                    : isEdit 
                      ? t("form.updatePermissions")
                      : t("form.addUser")
                  }
                </Button>
              </div>
            </>
          )}
        </div>
      </form>
    </Form>
  );
} 