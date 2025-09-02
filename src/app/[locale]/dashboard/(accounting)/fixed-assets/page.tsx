"use client";

import React, { useState } from "react";
import { createColumns } from "./columns";
import { DataTable } from "@/components/data-table/data-table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/shadcn-ui/card";
import { useTranslations } from "next-intl";
import { PlusCircle } from "lucide-react";
import { Skeleton } from "@/components/shadcn-ui/skeleton";
import { Button } from "@/components/shadcn-ui/button";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useFixedAssets } from "@/features/accounting/hooks/useFixedAssets";
import { FixedAsset } from "@/types/fixed-assets.type";
import { FixedAssetDeleteDialog } from "@/features/accounting/components/fixed-assets/fixed-asset-delete-dialog";
import { FixedAssetViewDialog } from "@/features/accounting/components/fixed-assets/fixed-asset-view-dialog";

const FixedAssetsPage = () => {
  const { session } = useAuth();
  const t = useTranslations("fixedAssets");
  const t2 = useTranslations("fixedAssets.table");
  const { toast } = useToast();
  const { assets, isLoading, isError, mutate } = useFixedAssets();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<FixedAsset | null>(null);

  const handleDeleteClick = (asset: FixedAsset) => {
    setSelectedAsset(asset);
    setDeleteDialogOpen(true);
  };

  const handleViewClick = (asset: FixedAsset) => {
    setSelectedAsset(asset);
    setViewDialogOpen(true);
  };

  const handleDeleteSuccess = () => {
    mutate();
  };

  const columns = createColumns(t, handleDeleteClick, handleViewClick);

  if (isError) {
    toast({
      title: t("error.fetchError"),
      description: t("error.fetchError"),
      variant: "destructive",
    });
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t("title")}</h1>
          <p className="text-muted-foreground">
            {t("description")}
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/fixed-assets/new-asset">
            <PlusCircle className="mr-2 h-4 w-4" />
            {t("addAsset")}
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("title")}</CardTitle>
          <CardDescription>{t("description")}</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Skeleton className="h-10 w-[250px]" />
                <Skeleton className="h-10 w-[200px]" />
              </div>
              <div className="space-y-2">
                {Array(5)
                  .fill(0)
                  .map((_, i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                  ))}
              </div>
              <div className="flex justify-between items-center">
                <Skeleton className="h-8 w-40" />
                <Skeleton className="h-8 w-64" />
              </div>
            </div>
          ) : (
            <DataTable
              columns={columns}
              data={assets}
              searchColumn="assetName"
              translations={t2}
            />
          )}
        </CardContent>
      </Card>

      {selectedAsset && (
        <>
          <FixedAssetDeleteDialog
            isOpen={deleteDialogOpen}
            onClose={() => setDeleteDialogOpen(false)}
            assetId={selectedAsset.id}
            assetName={selectedAsset.assetName}
            onSuccess={handleDeleteSuccess}
          />
          <FixedAssetViewDialog
            isOpen={viewDialogOpen}
            onClose={() => setViewDialogOpen(false)}
            asset={selectedAsset}
          />
        </>
      )}
    </div>
  );
};

export default FixedAssetsPage;
