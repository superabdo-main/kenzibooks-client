"use client";

import React, { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/shadcn-ui/card";
import { Building2 } from "lucide-react";
import SupplierForm from "@/components/suppliers/supplier-form";
import { usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useSuppliersStore } from "@/stores/suppliers.store";
import { SupplierFormValues } from "@/app/[locale]/dashboard/(vendors)/suppliers/supplier-schema";
import { Skeleton } from "@/components/shadcn-ui/skeleton";
import { useAuth } from "@/contexts/AuthContext";
import { useManagementStore } from "@/stores/management.store";
import { useToast } from "@/hooks/use-toast";

const EditSupplierPage = () => {
  const t = useTranslations("Suppliers");
  const supplierId = useSearchParams().get("id");
  const { session } = useAuth();
  const organizationId = useManagementStore(
    (state) => state.managedOrganization?.id
  );
  const { getSupplierById, isLoading } = useSuppliersStore();
  const [supplierData, setSupplierData] = useState<SupplierFormValues | null>(
    null
  );
  const { toast } = useToast();


  const fetchSupplier = async () => {
    if (!supplierId || !organizationId || !session?.accessToken) return;
    const supplier = await getSupplierById({
      id: supplierId,
      organizationId: organizationId,
      accessToken: session?.accessToken,
    });
    if (supplier.error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: supplier.error,
      });
    } else {
      setSupplierData(supplier.data);
    }
  };

  useEffect(() => {
    // Get the supplier by ID
    fetchSupplier();
  }, [supplierId, organizationId, session?.accessToken]);

  return (
    <div className="container mx-auto">
      <Card className="overflow-hidden border-border bg-card">
        <CardHeader className="bg-muted/30 py-5 border-b border-border">
          <div className="flex items-center gap-2 border-l-4 border-blue-500 pl-2">
            <Building2 className="h-5 w-5 text-blue-500" />
            <CardTitle className="text-xl font-semibold leading-none tracking-tight">
              {t("editSupplier.title")}
            </CardTitle>
          </div>
          <CardDescription className="pt-1.5">
            {t("editSupplier.subtitle")}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          {isLoading ? (
            <div className="space-y-4">
              <div className="flex justify-between">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-8 w-32" />
              </div>
              <Skeleton className="h-12 w-full" />
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
              </div>
              <div className="flex justify-end gap-2">
                <Skeleton className="h-10 w-24" />
                <Skeleton className="h-10 w-24" />
              </div>
            </div>
          ) : supplierData ? (
            <SupplierForm
              defaultValues={supplierData}
              supplierId={supplierId || ""}
              isEditing={true}
            />
          ) : (
            <div className="py-8 text-center">
              <p className="text-lg text-red-500">
                {t("editSupplier.notFound")}
              </p>
              <Link
                href={`/dashboard/suppliers`}
                className="mt-4 inline-block text-blue-500 hover:underline"
              >
                {t("editSupplier.backToList")}
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EditSupplierPage;
