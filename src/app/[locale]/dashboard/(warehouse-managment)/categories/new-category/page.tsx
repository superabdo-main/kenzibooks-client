"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/shadcn-ui/card";
import { CategoryForm } from "@/components/categories/category-form";
import { FolderPlusIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCategoriesStore } from "@/stores/categories.store";
import { useManagementStore } from "@/stores/management.store";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

// Form schema
const formSchema = z.object({
  name: z.string().min(2),
});

export default function NewCategoryPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const t = useTranslations("Categories");
  const { createCategory, isLoading, error } = useCategoriesStore();
  const { session } = useAuth();
  const { managedOrganization } = useManagementStore();
  const { toast } = useToast();
  // const { categories, setCategories } = useCategoriesStore();

  // Form submission handler
  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    if (!session?.accessToken || !managedOrganization?.id) return;
    try {
      setIsSubmitting(true);

      // Simulate API call delay
      // await new Promise(resolve => setTimeout(resolve, 1000));

      // Update store with the new category
      const response = await createCategory({
        name: data.name,
        accessToken: session?.accessToken || "",
        organizationId: managedOrganization?.id || "",
      });

      if (response.error) {
        setIsSubmitting(false);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to create category",
        });
        return;
      }
      toast({
        variant: "default",
        title: "Success",
        description: "Category created successfully",
      });
      // Navigate back to categories list
      router.push("/dashboard/categories");
    } catch (error) {
      console.error("Failed to create category:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create category",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto py-4">
      <Card className="border-border">
        <CardHeader className="bg-muted/30 border-b border-border">
          <div className="flex items-center gap-2 border-l-4 border-blue-500 pl-2">
            <FolderPlusIcon className="h-5 w-5 text-blue-500" />
            <CardTitle className="text-xl font-semibold leading-none tracking-tight">
              {t("newCategory.title")}
            </CardTitle>
          </div>
          <CardDescription>{t("newCategory.description")}</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <CategoryForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
        </CardContent>
      </Card>
    </div>
  );
}
