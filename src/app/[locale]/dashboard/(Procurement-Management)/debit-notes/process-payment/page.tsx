"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/shadcn-ui/card";
import {
  CreditCard,
  ArrowLeft,
  FileText,
  Check,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/shadcn-ui/button";
import { Separator } from "@/components/shadcn-ui/separator";
import { formatDate, formatCurrency } from "@/lib/utils";
import { usePurchasesStore } from "@/stores/purchases.store";
import { Badge } from "@/components/shadcn-ui/badge";
import { PurchaseInvoice } from "@/components/purchases/purchase-invoice";
import Link from "next/link";
import { PurchaseType } from "@/types/purchases.type";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const ProcessPaymentPage = () => {
  const t = useTranslations("Purchases");
  const router = useRouter();
  const purchaseId = useSearchParams().get("id") as string;

  const { fetchPurchaseById, proccessPaymentById, isLoading } =
    usePurchasesStore();
  const [purchase, setPurchase] = useState<PurchaseType | null>(null);
  const [isPaymentComplete, setIsPaymentComplete] = useState(false);
  const { session } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const fetchPurchaseAsync = async () => {
      if (!purchaseId || !session?.accessToken) return;

      const fetchedPurchase = await fetchPurchaseById({
        accessToken: session.accessToken,
        id: purchaseId,
      });

      if (fetchedPurchase.data) {
        setPurchase(fetchedPurchase.data);
      } else {
        toast({
          title: "Debit Note not found",
          description: "The requested Debit Note could not be found.",
          variant: "destructive",
        });
        router.push("/dashboard/debit-notes");
      }
    };

    fetchPurchaseAsync();

    // Check if already paid
    if (purchase?.status === "PAID") {
      setIsPaymentComplete(true);
    }
  }, [purchaseId, session?.accessToken]);

  const handleProcessPayment = async () => {
    if (!purchaseId || !session?.accessToken) return;

    const response = await proccessPaymentById({
      accessToken: session.accessToken,
      id: purchaseId,
    });

    if (response.error) {
      toast({
        title: "Payment failed",
        description: "The payment could not be processed.",
        variant: "destructive",
      });
      return;
    }

    setIsPaymentComplete(true);

    toast({
      title: "Payment processed",
      description: "The payment has been processed successfully.",
      variant: "default",
    });
    router.push("/dashboard/debit-notes");

  };

  if (!purchase) {
    return <Loader2 className="mx-auto animate-spin">Loading...</Loader2>;
  }

  return (
    <div className="container mx-auto pb-10">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" className="h-8 w-8" asChild>
            <Link href={`/dashboard/debit-notes`}>
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">{t("back")}</span>
            </Link>
          </Button>
          <div className="flex items-center gap-2 border-l-4 border-purple-500 pl-2">
            <CreditCard className="h-5 w-5 text-purple-500" />
            <h1 className="text-xl font-semibold leading-none tracking-tight">
              {t("processPayment.title")}
            </h1>
          </div>
        </div>

        <div className="flex gap-2">
          {/* <Button 
            variant="outline" 
            size="sm"
            className="flex items-center gap-1"
            onClick={() => window.print()}
          >
            <Printer className="h-4 w-4" />
            {t("processPayment.print")}
          </Button> */}

          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
            onClick={() => {
              // Generate PDF of current purchase
              import("@/lib/export/purchases/invoice").then((module) => {
                module.exportPurchaseInvoiceToPDF(purchase, t);
              });
            }}
          >
            <FileText className="h-4 w-4" />
            {t("processPayment.exportPDF")}
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-7">
        {/* Invoice Preview */}
        <div className="md:col-span-5">
          <PurchaseInvoice purchase={purchase} />
        </div>

        {/* Payment Processing Panel */}
        <div className="md:col-span-2">
          <Card className="sticky top-6">
            <CardHeader className="bg-muted/30 py-4 border-b border-border">
              <CardTitle className="text-lg font-medium">
                {t("processPayment.paymentDetails")}
              </CardTitle>
              <CardDescription>
                {t("processPayment.completePayment")}
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-6 space-y-4">
              {/* Purchase Summary */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    {t("processPayment.subtotal")}
                  </span>
                  <span>{formatCurrency(purchase.subTotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    {t("processPayment.salesTax")}
                  </span>
                  <span>{formatCurrency(purchase.salesTaxes)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    {t("processPayment.discount")}
                  </span>
                  <span>-{formatCurrency(purchase.discount)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-medium">
                  <span>{t("processPayment.totalDue")}</span>
                  <span>{formatCurrency(purchase.grandTotal)}</span>
                </div>
              </div>

              <div className="pt-2">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-muted-foreground">
                    {t("processPayment.status")}
                  </span>
                  <Badge
                    variant="outline"
                    className={`${
                      purchase.status === "PAID"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    } capitalize`}
                  >
                    {purchase.status === "PAID"
                      ? t("processPayment.paid")
                      : purchase.status}
                  </Badge>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-muted-foreground">
                    {t("processPayment.dueDate")}
                  </span>
                  <span className="text-sm">
                    {formatDate(purchase.expectedShipmentDate)}
                  </span>
                </div>
              </div>

              {/* Payment Button */}
              <div className="pt-4">
                {isPaymentComplete ? (
                  <Button
                    className="w-full bg-green-600 hover:bg-green-700 text-white flex items-center justify-center gap-2"
                    disabled
                  >
                    <Check className="h-4 w-4" />
                    {t("processPayment.paymentComplete")}
                  </Button>
                ) : (
                  <Button
                    className="w-full"
                    onClick={handleProcessPayment}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <span className="loading loading-spinner loading-xs mr-2"></span>
                        {t("processPayment.processing")}
                      </>
                    ) : (
                      t("processPayment.confirmPayment")
                    )}
                  </Button>
                )}
              </div>

              <div className="pt-2">
                <Button variant="outline" className="w-full" asChild>
                  <Link href={`/dashboard/purchases`}>
                    {t("processPayment.returnToList")}
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProcessPaymentPage;
