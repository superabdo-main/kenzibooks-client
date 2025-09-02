"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { FixedAssetForm } from "@/features/accounting/components/fixed-assets/fixed-asset-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/shadcn-ui/card";
import { Button } from "@/components/shadcn-ui/button";
import { ChevronLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useFixedAssetsStore } from "@/stores/fixed-assets.store";
import { useAuth } from "@/contexts/AuthContext";
import { useManagementStore } from "@/stores/management.store";
import { FixedAssetFormValues } from "@/lib/schemas/fixed-asset-schema";

export default function NewFixedAssetPage() {
  const router = useRouter();
  const t = useTranslations("fixedAssets");
  const { toast } = useToast();
  const { session } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const organizationId = useManagementStore((state) => state.managedOrganization?.id);
  const { createAsset } = useFixedAssetsStore();

  const handleSubmit = async (data: FixedAssetFormValues) => {
    if (!session?.accessToken || !organizationId) {
      toast({
        title: t("error.createError"),
        description: "Authentication or organization data missing",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await createAsset({
        assetName: data.assetName,
        description: data.description,
        purchaseDate: data.purchaseDate,
        purchaseCost: parseFloat(data.purchaseCost),
        assetCategory: data.assetCategory,
        depreciationMethod: data.depreciationMethod,
        usefulLife: parseInt(data.usefulLife),
        salvageValue: parseFloat(data.salvageValue || "0"),
        currentValue: data.currentValue ? parseFloat(data.currentValue) : undefined,
        location: data.location,
        status: data.status,
        notes: data.notes,
        accessToken: session.accessToken,
        organizationId,
      });

      if (response.isOk) {
        toast({
          title: t("success.created"),
          description: t("success.created"),
        });
        router.push("/dashboard/fixed-assets");
      } else {
        throw new Error(response.error || "Failed to create fixed asset");
      }
    } catch (error) {
      console.error("Error creating fixed asset:", error);
      toast({
        variant: "destructive",
        title: t("error.createError"),
        description: error instanceof Error ? error.message : t("error.createError"),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ChevronLeft className="h-5 w-5" />
          <span className="sr-only">Back</span>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t("addAsset")}</h1>
          <p className="text-muted-foreground">
            {t("description")}
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("form.generalDetails")}</CardTitle>
        </CardHeader>
        <CardContent>
          <FixedAssetForm 
            onSubmit={handleSubmit} 
            isSubmitting={isSubmitting}
            initialData={{
              status: "active"
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
