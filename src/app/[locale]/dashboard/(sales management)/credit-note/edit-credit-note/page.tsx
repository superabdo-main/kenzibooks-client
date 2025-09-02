"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { SaleType } from "@/types/sales.type";
import { useSalesStore } from "@/stores/sales.store";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/shadcn-ui/card";
import { Button } from "@/components/shadcn-ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Skeleton } from "@/components/shadcn-ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useSaleInitials } from "@/features/sales/hooks/useInitials";
import SaleForm from "@/components/sales/sale-form/saleForm";

export default function EditSalePage() {
  const t = useTranslations("CreditNote");
  const router = useRouter();
  const { toast } = useToast();
  const saleId = useSearchParams().get("id");
  const { session } = useAuth();
  const { fetchSaleById, updateSaleById, isLoading } = useSalesStore();
  const [sale, setSale] = useState<SaleType | null>(null);
  const { customers } = useSaleInitials();

  const fetchPurchase = async () => {
    if (saleId && session?.accessToken) {
      const fetchedSale = await fetchSaleById({
        accessToken: session?.accessToken as string,
        id: saleId,
      });

      if (fetchedSale.data) {
        setSale(fetchedSale.data);
      } else {
        // Purchase not found, redirect back to list
        toast({
          title: "Credit Note not found",
          description: "The requested credit note could not be found.",
          variant: "destructive",
        });
        router.push("/dashboard/credit-note");
      }
    }
  };

  useEffect(() => {
    fetchPurchase();
  }, [saleId, fetchSaleById]);

  const handleSubmit = async (updatedSale: SaleType) => {
    try {
      if (!session?.accessToken || !saleId) return;
      const response = await updateSaleById({
        accessToken: session.accessToken,
        id: saleId as string,
        updateSaleDto: updatedSale,
      });

      if (response.error) {
        toast({
          title: "Credit Note not found",
          description: "The requested credit note could not be found.",
          variant: "destructive",
        });
        router.push("/dashboard/credit-note");
      }

      toast({
        title: t("editSale.successMessage"),
        description: `Credit note updated successfully`,
        variant: "default",
      });

      // Navigate back to purchases list
      router.push("/dashboard/credit-note");
    } catch (error) {
      // Show error toast
      toast({
        title: t("editSale.errorMessage"),
        description: error instanceof Error ? error.message : String(error),
        variant: "destructive",
      });
    }
  };

  const handleCancel = () => {
    router.push("/dashboard/credit-note");
  };

  if (isLoading) {
    return (
      <div className="container mx-auto space-y-6 pb-8">
        <Card className="border-border bg-card">
          <CardHeader className="bg-muted/30 py-5 border-b border-border">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-96 mt-2" />
          </CardHeader>
        </Card>

        <div className="space-y-8">
          {Array(5)
            .fill(0)
            .map((_, i) => (
              <Card key={i} className="border-border bg-card">
                <CardHeader className="bg-muted/30 py-5 border-b border-border">
                  <Skeleton className="h-6 w-48" />
                </CardHeader>
                <div className="p-6 space-y-4">
                  {Array(i + 1)
                    .fill(0)
                    .map((_, j) => (
                      <div
                        key={j}
                        className="grid grid-cols-1 md:grid-cols-2 gap-4"
                      >
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                      </div>
                    ))}
                </div>
              </Card>
            ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto space-y-6 pb-8">
      <Card className="border-border bg-card">
        <CardHeader className="bg-muted/30 py-5 border-b border-border">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" className="mr-2" asChild>
              <Link href="/dashboard/credit-note">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <div>
              <CardTitle className="text-xl font-semibold">
                {t("editSale.title")}
              </CardTitle>
              <CardDescription>{t("editSale.subtitle")}</CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      {sale && (
        <SaleForm
          t={t}
          type="CREDIT_NOTE"
          customers={customers}
          defaultValues={sale}
          isEdit={true}
          isSubmitting={isLoading}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
}
