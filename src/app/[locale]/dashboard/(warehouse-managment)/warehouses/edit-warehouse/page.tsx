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
import { WarehouseForm } from "@/components/warehouses/warehouse-form";
import { BuildingIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useWarehousesStore } from "@/stores/warehouses.store";
import { Skeleton } from "@/components/shadcn-ui/skeleton";
import { WarehouseType } from "@/types/warehouses.type";
import { useAuth } from "@/contexts/AuthContext";
import { useManagementStore } from "@/stores/management.store";
import { useToast } from "@/hooks/use-toast";

// Form schema
const formSchema = z.object({
  name: z.string().min(2),
});

export default function EditWarehousePage() {
  const warehouseId = useSearchParams().get("id");
  const { session } = useAuth();
  const organizationId = useManagementStore(
    (state) => state.managedOrganization?.id
  );
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [warehouse, setWarehouse] = useState<WarehouseType | null>(null);
  const router = useRouter();
  const t = useTranslations("Warehouses");
  const { updateWarehouse, findById, isLoading } = useWarehousesStore();

  const fetchWarehouseById = async () => {
    if (!warehouseId || !session?.accessToken || !organizationId) return;
    try {
      const response = await findById({
        id: warehouseId,
        accessToken: session?.accessToken,
        organizationId: organizationId,
      });
      if (response.error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: response.error,
        });
      }
      setWarehouse(response.data);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch warehouse",
      });
    }
  };

  // Fetch the warehouse when component mounts
  useEffect(() => {
    fetchWarehouseById();
  }, [warehouseId, session?.accessToken, organizationId]);

  // Form submission handler
  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    if (!warehouse || !session?.accessToken || !organizationId) return;

    try {
      setIsSubmitting(true);

      const response = await updateWarehouse({
        id: warehouse.id,
        name: data.name,
        accessToken: session?.accessToken,
        organizationId: organizationId,
      });

      if (response.error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: response.error,
        });
      }

      toast({
        variant: "default",
        title: "Success",
        description: "Warehouse updated successfully",
      });

      // Navigate back to warehouses list
      router.push("/dashboard/warehouses");
    } catch (error) {
      console.error("Failed to update warehouse:", error);
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

  if (!warehouse) {
    return (
      <div className="container mx-auto py-4">
        <div className="flex items-center justify-center h-40">
          <p className="text-muted-foreground">{t("warehouseNotFound")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-4">
      <Card className="border-border">
        <CardHeader className="bg-muted/30 border-b border-border">
          <div className="flex items-center gap-2 border-l-4 border-blue-500 pl-2">
            <BuildingIcon className="h-5 w-5 text-blue-500" />
            <CardTitle className="text-xl font-semibold leading-none tracking-tight">
              {t("editWarehouse.title")}
            </CardTitle>
          </div>
          <CardDescription>{t("editWarehouse.description")}</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <WarehouseForm
            initialData={warehouse}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
        </CardContent>
      </Card>
    </div>
  );
}
