"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { z } from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/shadcn-ui/card";
import { CategoryForm } from "@/components/categories/category-form";
import { FolderIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { Skeleton } from "@/components/shadcn-ui/skeleton";
import { useAuth } from "@/contexts/AuthContext";
import { useManagementStore } from "@/stores/management.store";
import { Category } from "@/types/category";
import { useCategoriesStore } from "@/stores/categories.store";
import { useToast } from "@/hooks/use-toast";

// Form schema
const formSchema = z.object({
  name: z.string().min(2),
});

export default function EditCategoryPage() {
  const { session } = useAuth();
  const organizationId = useManagementStore(
    (state) => state.managedOrganization?.id
  );
  const categoryId = useSearchParams().get("id");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [category, setCategory] = useState<Category | null>(null);
  const router = useRouter();
  const t = useTranslations("Categories");
  const { findById, isLoading, error, updateCategory } = useCategoriesStore();
  const { toast } = useToast();

  // Fetch the category when component mounts

  const fetchCategory = async () => {
    if (!categoryId || !session?.accessToken || !organizationId) return;

    const foundCategory = await findById({
      id: categoryId,
      accessToken: session?.accessToken,
      organizationId: organizationId,
    });

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error,
      });
      return;
    }

    if (foundCategory.data) {
      setCategory(foundCategory.data);
    }
  };

  useEffect(() => {
    fetchCategory();
  }, [categoryId, session?.accessToken, organizationId]);

  // Form submission handler
  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    if (!category || !session?.accessToken || !organizationId) return;

    try {
      setIsSubmitting(true);
      const updatedCategory = await updateCategory({
        id: categoryId!,
        name: data.name,
        accessToken: session?.accessToken,
        organizationId: organizationId,
      });

      if (updatedCategory.error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: updatedCategory.error,
        });
        return;
      }

      toast({
        variant: "default",
        title: "Success",
        description: "Category updated successfully",
      });

      // Navigate back to categories list
      router.push("/dashboard/categories");
    } catch (error) {
      console.error("Failed to update category:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-4">
        <div className="mb-6">
          <Skeleton className="h-8 w-80" />
        </div>
        <Card className="border-border">
          <CardHeader className="bg-muted/30 border-b border-border">
            <div className="flex items-center gap-2">
              <Skeleton className="h-6 w-6" />
              <Skeleton className="h-6 w-48" />
            </div>
            <Skeleton className="h-4 w-64 mt-2" />
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-4 w-full" />
            <div className="flex justify-end">
              <Skeleton className="h-10 w-32" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="container mx-auto py-4">
        <div className="flex items-center justify-center h-40">
          <p className="text-muted-foreground">{t("categoryNotFound")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-4">
      <Card className="border-border">
        <CardHeader className="bg-muted/30 border-b border-border">
          <div className="flex items-center gap-2 border-l-4 border-blue-500 pl-2">
            <FolderIcon className="h-5 w-5 text-blue-500" />
            <CardTitle className="text-xl font-semibold leading-none tracking-tight">
              {t("editCategory.title")}
            </CardTitle>
          </div>
          <CardDescription>{t("editCategory.description")}</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <CategoryForm
            initialData={category}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
        </CardContent>
      </Card>
    </div>
  );
}
