"use client";

import React from "react";
import { PurchaseType } from "@/types/purchases.type";
import { formatDate, formatCurrency } from "@/lib/utils";
import { Card, CardContent } from "@/components/shadcn-ui/card";
import { Separator } from "@/components/shadcn-ui/separator";
import { useTranslations } from "next-intl";
import { Badge } from "@/components/shadcn-ui/badge";

interface PurchaseInvoiceProps {
  purchase: PurchaseType;
}

export const PurchaseInvoice: React.FC<PurchaseInvoiceProps> = ({
  purchase,
}) => {
  const t = useTranslations("Purchases");

  // Generate an invoice number based on purchase ID
  const invoiceNumber = `INV-${purchase.uuid.slice(4, 10).toUpperCase()}`;

  return (
    <Card className="overflow-hidden print:shadow-none" id="invoice-content">
      <CardContent className="p-8 print:p-6">
        {/* Invoice Header */}
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              {t("invoice.title")}
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              {t("invoice.number")}: {invoiceNumber}
            </p>
          </div>
          <div className="text-right">
            <Badge
              variant="outline"
              className={`${
                purchase.status === "PAID"
                  ? "bg-green-100 text-green-800"
                  : purchase.status === "UNPAID"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-blue-100 text-blue-800"
              } capitalize px-3 py-1 text-sm`}
            >
              {purchase.status === "PAID"
                ? t("processPayment.paid")
                : purchase.status}
            </Badge>
            <p className="text-sm text-muted-foreground mt-2">
              {t("invoice.date")}: {formatDate(purchase.purchaseDate)}
            </p>
            <p className="text-sm text-muted-foreground">
              {t("invoice.due")}: {formatDate(purchase.expectedShipmentDate)}
            </p>
          </div>
        </div>

        <Separator className="my-8" />

        {/* Addresses */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* From (Company) */}
          <div>
            <h3 className="font-medium text-gray-600 mb-2">
              {t("invoice.from")}
            </h3>
            <div className="text-sm space-y-1">
              <p className="font-medium">Supplier</p>
              <p>{purchase.supplier.email}</p>
              <p>{purchase.address.billingStreet}</p>
              <p>
                {purchase.address.billingCity}, {purchase.address.billingState}{" "}
                {purchase.address.billingZipPostalCode}
              </p>
              <p>{purchase.address.billingCountry}</p>
            </div>
          </div>

          {/* To (Supplier) */}
          <div>
            <h3 className="font-medium text-gray-600 mb-2">
              {t("invoice.to")}
            </h3>
            <div className="text-sm space-y-1">
              <p className="font-medium">Shipping Address</p>
              <p>{purchase.address.shippingStreet}</p>
              <p>
                {purchase.address.shippingCity},{" "}
                {purchase.address.shippingState}{" "}
                {purchase.address.shippingZipPostalCode}
              </p>
              <p>{purchase.address.shippingCountry}</p>
            </div>
          </div>
        </div>

        <div className="mt-10">
          <h3 className="font-medium text-gray-600 mb-3">
            {t("invoice.items")}
          </h3>

          {/* Items Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t("invoice.item")}
                  </th>
                  <th className="py-3 px-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t("invoice.quantity")}
                  </th>
                  <th className="py-3 px-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t("invoice.unitPrice")}
                  </th>
                  <th className="py-3 px-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t("invoice.amount")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {purchase?.items?.map((item, index) => (
                  <tr key={index} className="border-b border-gray-100">
                    <td className="py-4 px-4">
                      <div>
                        <p className="font-medium text-gray-800">
                          {item.product.name}
                        </p>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-right">{item.quantity}</td>
                    <td className="py-4 px-4 text-right">
                      {formatCurrency(item.unitPrice)}
                    </td>
                    <td className="py-4 px-4 text-right font-medium">
                      {formatCurrency(item.total)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="mt-6 flex justify-end">
            <div className="w-full max-w-xs">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">{t("invoice.subtotal")}</span>
                  <span>{formatCurrency(purchase.subTotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{t("invoice.salesTax")}</span>
                  <span>{formatCurrency(purchase.salesTaxes)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{t("invoice.discount")}</span>
                  <span>-{formatCurrency(purchase.discount)}</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between font-medium text-base">
                  <span>{t("invoice.total")}</span>
                  <span>{formatCurrency(purchase.grandTotal)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Notes */}
        {purchase.notes && (
          <div className="mt-12">
            <h3 className="font-medium text-gray-600 mb-2">
              {t("invoice.notes")}
            </h3>
            <p className="text-sm text-gray-600">{purchase.notes}</p>
          </div>
        )}

        {/* Terms */}
        <div className="mt-12 border-t border-gray-100 pt-6">
          <h3 className="font-medium text-gray-600 mb-2">
            {t("invoice.terms")}
          </h3>
          <p className="text-sm text-gray-600">{t("invoice.termsText")}</p>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-xs text-gray-500">
          <p>{t("invoice.footer")}</p>
        </div>
      </CardContent>
    </Card>
  );
};
