"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { SaleType } from "@/types/sales.type";
import { useSalesStore } from "@/stores/sales.store";
import { ToastAction } from "@/components/shadcn-ui/toast";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/shadcn-ui/card";
import { Button } from "@/components/shadcn-ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import SaleForm from "@/components/sales/sale-form/saleForm";
import { useSaleInitials } from "@/features/sales/hooks/useInitials";
import { useAuth } from "@/contexts/AuthContext";
import { useManagementStore } from "@/stores/management.store";

export default function NewInvoicePage() {
  const t = useTranslations("Invoices");
  const router = useRouter();
  const { toast } = useToast();
  const { createSale } = useSalesStore();
  const { customers, products } = useSaleInitials();
  const { session } = useAuth();
  const organizationId = useManagementStore(
    (state) => state.managedOrganization?.id
  );

  const handleSubmit = async (sale: SaleType) => {
    try {
      if (!organizationId || !session?.accessToken) {
        return;
      }
      // Add the sale to the store
      const response = await createSale({
        sale: sale,
        accessToken: session?.accessToken,
        organizationId: organizationId,
      });
      if (response.error) {
        toast({
          title: t("newSale.errorMessage"),
          description: response.error,
          variant: "destructive",
        });
        return;
      }
      // Navigate back to sales list
      router.push(`/dashboard/invoices`);
    } catch (error) {
      // Show error toast
      toast({
        title: t("newSale.errorMessage"),
        description: error instanceof Error ? error.message : String(error),
        variant: "destructive",
      });
    }
  };

  const handleCancel = () => {
    router.push(`/dashboard/invoices`);
  };

  return (
    <div className="container mx-auto space-y-6 pb-8">
      <Card className="border-border bg-card">
        <CardHeader className="bg-muted/30 py-5 border-b border-border">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" className="mr-2" asChild>
              <Link href={`/dashboard/invoices`}>
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <div>
              <CardTitle className="text-xl font-semibold">
                {t("newSale.title")}
              </CardTitle>
              <CardDescription>{t("newSale.subtitle")}</CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      <SaleForm
        type="INVOICE"
        t={t}
        customers={customers}
        products={products}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    </div>
  );
}
