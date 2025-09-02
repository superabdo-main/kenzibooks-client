"use client";

import { UserForm } from "@/components/user/user-form";
import { Button } from "@/components/shadcn-ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/shadcn-ui/card";
import { ChevronLeft, UserCog } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/shadcn-ui/skeleton";
import { useAuth } from "@/contexts/AuthContext";
import { useManagementStore } from "@/stores/management.store";
import { useUsersStore } from "@/stores/users.store";
import { UserWithPermissions } from "@/types/user-permission";
import { useToast } from "@/hooks/use-toast";

export default function EditUserPage() {
  const t = useTranslations("Users");
  const searchParams = useSearchParams();
  const userId = searchParams?.get("id");
  
  const { session } = useAuth();
  const organizationId = useManagementStore(
    (state) => state.managedOrganization?.id
  );
  const { getUserWithPermissions } = useUsersStore();
  const { toast } = useToast();
  
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<UserWithPermissions | null>(null);

  useEffect(() => {
    async function loadUser() {
      if (!session?.accessToken || !organizationId || !userId) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await getUserWithPermissions({
          userId,
          accessToken: session.accessToken,
          organizationId,
        });

        if (response.error) {
          toast({
            variant: "destructive",
            title: "Error",
            description: response.error,
          });
          setIsLoading(false);
          return;
        }

        if (response.data) {
          setUser(response.data);
        }
      } catch (error) {
        console.error("Failed to load user:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load user details",
        });
      } finally {
        setIsLoading(false);
      }
    }

    loadUser();
  }, [session, organizationId, userId, getUserWithPermissions, toast]);

  return (
    <div className="container mx-auto">
      <div className="mb-4">
        <Button
          variant="ghost"
          size="sm"
          className="gap-1"
          asChild
        >
          <Link href="/dashboard/users">
            <ChevronLeft className="h-4 w-4" />
            {t("backToUsers")}
          </Link>
        </Button>
      </div>

      <Card className="overflow-hidden border-border bg-card">
        <CardHeader className="bg-muted/30 py-5 border-b border-border">
          <div className="flex items-center gap-2 border-l-4 border-blue-500 pl-2">
            <UserCog className="h-5 w-5 text-blue-500" />
            <CardTitle className="text-xl font-semibold leading-none tracking-tight">
              {t("editUser.title")}
            </CardTitle>
          </div>
          <CardDescription className="pt-1.5">
            {t("editUser.subtitle")}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          {isLoading ? (
            <div className="space-y-6">
              <div className="space-y-2">
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-4 w-60" />
              </div>
              
              <div className="space-y-4">
                <Skeleton className="h-8 w-60" />
                <div className="rounded-md border p-4">
                  <Skeleton className="h-6 w-40 mb-4" />
                  <Skeleton className="h-10 w-full" />
                  
                  <div className="grid grid-cols-5 gap-2 mt-6">
                    {Array(5).fill(0).map((_, i) => (
                      <Skeleton key={i} className="h-6" />
                    ))}
                  </div>
                  
                  {Array(6).fill(0).map((_, i) => (
                    <div key={i} className="grid grid-cols-5 gap-2 mt-4">
                      {Array(5).fill(0).map((_, j) => (
                        <Skeleton key={j} className="h-6" />
                      ))}
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-end">
                <Skeleton className="h-10 w-32" />
              </div>
            </div>
          ) : (
            user ? (
              <UserForm user={user} isEdit={true} />
            ) : (
              <div className="text-center py-10">
                <h3 className="text-lg font-medium text-destructive mb-2">
                  {t("editUser.userNotFound")}
                </h3>
                <p className="text-muted-foreground">
                  {t("editUser.userNotFoundDescription")}
                </p>
                <Button 
                  className="mt-4" 
                  asChild
                >
                  <Link href="/dashboard/users">
                    {t("editUser.returnToUsers")}
                  </Link>
                </Button>
              </div>
            )
          )}
        </CardContent>
      </Card>
    </div>
  );
} 