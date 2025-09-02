"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { PurchaseForm } from "@/components/purchases/purchase-form/purchaseForm";
import { PurchaseType } from "@/types/purchases.type";
import { usePurchasesStore } from "@/stores/purchases.store";
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
import { usePurchaseInitials } from "@/features/purchases/hooks/useInitials";
import { useManagementStore } from "@/stores/management.store";
import { useAuth } from "@/contexts/AuthContext";

export default function NewDebitNotePage() {
  const t = useTranslations("Purchases");
  const tdn = useTranslations("DebitNotes");
  const router = useRouter();
  const { toast } = useToast();
  const { createPurchase, isLoading } = usePurchasesStore();
  const { products, suppliers } = usePurchaseInitials();
  const { session } = useAuth();
  const organizationId = useManagementStore(
    (state) => state.managedOrganization?.id
  );

  const handleSubmit = async (purchase: PurchaseType) => {
    if (!organizationId || !session?.accessToken) {
      return;
    }
    try {
      // Add the purchase to the store
      const response = await createPurchase({
        purchase,
        accessToken: session?.accessToken,
        organizationId: organizationId,
      });
      if (response.error) {
        toast({
          title: t("newPurchase.errorMessage"),
          description: response.error,
          variant: "destructive",
        });
        return;
      }
      // Show success toast
      toast({
        title: t("newPurchase.successMessage"),
        description: `Debit note created successfully`,
        variant: "default",
      });

      // Navigate back to purchases list
      router.push("/dashboard/debit-notes");
    } catch (error) {
      // Show error toast
      toast({
        title: t("newPurchase.errorMessage"),
        description: error instanceof Error ? error.message : String(error),
        variant: "destructive",
      });
    }
  };

  const handleCancel = () => {
    router.push("/dashboard/debit-notes");
  };

  return (
    <div className="container mx-auto space-y-6 pb-8">
      <Card className="border-border bg-card">
        <CardHeader className="bg-muted/30 py-5 border-b border-border">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" className="mr-2" asChild>
              <Link href="/dashboard/debit-notes">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <div>
              <CardTitle className="text-xl font-semibold">
                {tdn("newDebitNote.title")}
              </CardTitle>
              <CardDescription>{tdn("newDebitNote.subtitle")}</CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      <PurchaseForm
        type="DEBIT_NOTE"
        t={t}
        suppliers={suppliers}
        products={products}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    </div>
  );
}
