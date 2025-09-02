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
import { WarehouseForm } from "@/components/warehouses/warehouse-form";
import { BuildingIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useWarehousesStore } from "@/stores/warehouses.store";
import { useAuth } from "@/contexts/AuthContext";
import { useManagementStore } from "@/stores/management.store";
import { useToast } from "@/hooks/use-toast";

// Form schema
const formSchema = z.object({
  name: z.string().min(2),
});

export default function NewWarehousePage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const t = useTranslations("Warehouses");
  const { createWarehouse } = useWarehousesStore();
  const { session } = useAuth();
  const organizationId = useManagementStore(
    (state) => state.managedOrganization?.id
  );
  const { toast } = useToast();

  // Form submission handler
  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    if (!session?.accessToken || !organizationId) return;
    try {
      setIsSubmitting(true);
      
      // Update store with the new warehouse
      const response = await createWarehouse({
        name: data.name,
        accessToken: session?.accessToken,
        organizationId: organizationId!,
      });
      
      if (response.error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: response.error,
        });
        return;
      }
      
      toast({
        variant: "default",
        title: "Success",
        description: "Warehouse created successfully",
      });
      
      // Navigate back to warehouses list
      router.push("/dashboard/warehouses");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create warehouse",
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
            <BuildingIcon className="h-5 w-5 text-blue-500" />
            <CardTitle className="text-xl font-semibold leading-none tracking-tight">
              {t("newWarehouse.title")}
            </CardTitle>
          </div>
          <CardDescription>
            {t("newWarehouse.description")}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <WarehouseForm
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
        </CardContent>
      </Card>
    </div>
  );
} 