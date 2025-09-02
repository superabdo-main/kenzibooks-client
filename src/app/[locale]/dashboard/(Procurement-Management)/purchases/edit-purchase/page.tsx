"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { PurchaseType } from "@/types/purchases.type";
import { usePurchasesStore } from "@/stores/purchases.store";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/shadcn-ui/card";
import { Button } from "@/components/shadcn-ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Skeleton } from "@/components/shadcn-ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import PurchaseForm from "@/components/purchases/purchase-form/purchaseForm";
import { usePurchaseInitials } from "@/features/purchases/hooks/useInitials";

export default function EditPurchasePage() {
  const t = useTranslations("Purchases");
  const router = useRouter();
  const purchaseId = useSearchParams().get('id');
  const { toast } = useToast();
  const { session } = useAuth();
  const { fetchPurchaseById, updatePurchaseById, isLoading } = usePurchasesStore();
  const [purchase, setPurchase] = useState<PurchaseType | null>(null);
  const { suppliers } = usePurchaseInitials();

  const fetchPurchase = async () => {
    if (purchaseId && session?.accessToken) {
      const fetchedPurchase = await fetchPurchaseById({
        accessToken: session?.accessToken as string,
        id: purchaseId,
      });
      
      if (fetchedPurchase.data) {
        setPurchase(fetchedPurchase.data);
      } else {
        // Purchase not found, redirect back to list
        toast({
          title: "Purchase not found",
          description: "The requested purchase could not be found.",
          variant: "destructive",
        });
        router.push("/dashboard/purchases");
      }
    }
  };


  useEffect(() => {
    fetchPurchase();
  }, [purchaseId, fetchPurchaseById]);

  const handleSubmit = async (updatedPurchase: PurchaseType) => {
    try {
      if (!session?.accessToken || !purchaseId) return
        const response = await updatePurchaseById({
          accessToken: session.accessToken,
          id: purchaseId as string,
          updatePurchaseDto: updatedPurchase,
        });
      
      if (response.error) {
        toast({
          title: "Purchase not found",
          description: "The requested purchase could not be found.",
          variant: "destructive",
        });
        router.push("/dashboard/purchases");
      }

      toast({
        title: t("editPurchase.successMessage"),
        description: `Purchase updated successfully`,
        variant: "default",
      });

      // Navigate back to purchases list
      router.push("/dashboard/purchases");
    } catch (error) {
      // Show error toast
      toast({
        title: t("editPurchase.errorMessage"),
        description: error instanceof Error ? error.message : String(error),
        variant: "destructive",
      });
    }
  };

  const handleCancel = () => {
    router.push("/dashboard/purchases");
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
                      <div key={j} className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            <Button
              variant="ghost"
              size="icon"
              className="mr-2"
              asChild
            >
              <Link href="/dashboard/purchases">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <div>
              <CardTitle className="text-xl font-semibold">
                {t("editPurchase.title")}
              </CardTitle>
              <CardDescription>
                {t("editPurchase.subtitle")}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      {purchase && (
        <PurchaseForm
          t={t}
          type="PURCHASE"
          suppliers={suppliers}
          // products={products}
          defaultValues={purchase}
          isEdit={true}
          isSubmitting={isLoading}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
} 