import { PurchaseType } from "@/types/purchases.type";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { formatDate, formatCurrency } from "@/lib/utils";
import "./Cairo-Regular-normal";

/**
 * Export an individual purchase invoice to PDF
 */
export const exportPurchaseInvoiceToPDF = (purchase: PurchaseType, t: any) => {
  // Create a new PDF document
  const doc = new jsPDF();

  // Set document metadata
  doc.setProperties({
    title: `Invoice-${purchase.uuid.slice(4, 10).toUpperCase()}`,
    subject: "Purchase Invoice",
    author: "Kinzi Dashboard",
    creator: "Kinzi Dashboard",
  });

  // Invoice number
  const invoiceNumber = `INV-${purchase.uuid.slice(4, 10).toUpperCase()}`;

  // Add title
  doc.setFontSize(20);
  doc.setFont("Cairo-Regular", "normal");
  doc.text("INVOICE", 14, 22);

  // Add invoice number and dates
  doc.setFontSize(10);
  doc.setFont("Cairo-Regular", "normal");
  doc.text(`Invoice Number: ${invoiceNumber}`, 14, 30);
  doc.text(`Purchase Date: ${formatDate(purchase.purchaseDate)}`, 14, 35);
  doc.text(
    `Expected Shipment Date: ${formatDate(purchase.expectedShipmentDate)}`,
    14,
    40
  );

  // Add status
  doc.setFontSize(12);
  doc.setFont("Cairo-Regular", "bold");
  const status =
    purchase.status === "PAID" ? "PAID" : purchase.status.toUpperCase();
  const statusWidth =
    (doc.getStringUnitWidth(status) * 12) / doc.internal.scaleFactor;
  doc.text(status, 195 - statusWidth, 22);

  // Add company info (from)
  doc.setFontSize(11);
  doc.setFont("Cairo-Regular", "bold");
  doc.text("To:", 14, 55);
  doc.setFont("Cairo-Regular", "normal");
  doc.setFontSize(10);
  doc.text("Supplier", 120, 60);
  doc.text("(704-012-457) رقم التسجيل الضريبي", 120, 65);
  doc.text(purchase.supplier.name, 120, 70);
  doc.text(purchase.supplier.email, 120, 75);
  doc.text(purchase.supplier.address, 120, 80);

  // Add supplier info (to)
  doc.setFontSize(11);
  doc.setFont("Cairo-Regular", "normal");
  doc.text("From:", 120, 55);
  doc.setFont("Cairo-Regular", "normal");
  doc.setFontSize(10);
  doc.text("Shipping Address", 14, 60);
  doc.text(purchase.address.shippingStreet, 14, 65);
  doc.text(
    `${purchase.address.shippingCity}, ${purchase.address.shippingState} ${purchase.address.shippingZipPostalCode}`,
    14,
    70
  );
  doc.text(purchase.address.shippingCountry, 14, 75);

  // Set up the items table
  autoTable(doc, {
    startY: 95,
    head: [["Item", "Quantity", "Unit Price", "Amount"]],
    body: purchase.items?.map((item) => [
      item.product.name,
      item.quantity.toString(),
      formatCurrency(item.unitPrice, "EGP"),
      formatCurrency(item.total, "EGP"),
    ]),
    headStyles: {
      fillColor: [75, 85, 99],
      textColor: [255, 255, 255],
      fontStyle: "bold",
      lineWidth: 0.1,
      halign: "left",
    },
    columnStyles: {
      0: { cellWidth: "auto" },
      1: { cellWidth: 30, halign: "right" },
      2: { cellWidth: 40, halign: "right" },
      3: { cellWidth: 40, halign: "right" },
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245],
    },
    margin: { left: 14, right: 14 },
  });

  // Calculate the Y position after the table
  const finalY = (doc as any).lastAutoTable.finalY + 10;

  // Add totals
  const totalsX = 140;
  doc.setFontSize(10);

  doc.text("Subtotal:", totalsX, finalY);
  doc.text(formatCurrency(purchase.subTotal, "EGP"), 195, finalY, {
    align: "right",
  });

  doc.text("Sales Tax:", totalsX, finalY + 6);
  doc.text(formatCurrency(purchase.salesTaxes, "EGP"), 195, finalY + 6, {
    align: "right",
  });

  doc.text("Discount:", totalsX, finalY + 12);
  doc.text(`-${formatCurrency(purchase.discount, "EGP")}`, 195, finalY + 12, {
    align: "right",
  });

  // Add line
  doc.setLineWidth(0.5);
  doc.line(totalsX, finalY + 16, 195, finalY + 16);

  // Add grand total
  doc.setFontSize(11);
  doc.setFont("Cairo-Regular", "bold");
  doc.text("Total:", totalsX, finalY + 22);
  doc.text(formatCurrency(purchase.grandTotal, "EGP"), 195, finalY + 22, {
    align: "right",
  });

  // Add notes if present
  if (purchase.notes) {
    const notesY = finalY + 35;
    doc.setFontSize(11);
    doc.setFont("Cairo-Regular", "bold");
    doc.text("Notes:", 14, notesY);
    doc.setFont("Cairo-Regular", "normal");
    doc.setFontSize(10);

    const splitNotes = doc.splitTextToSize(purchase.notes, 180);
    doc.text(splitNotes, 14, notesY + 6);
  }

  // Add terms and footer
  const termsY = finalY + (purchase.notes ? 55 : 35);
  doc.setFontSize(11);
  doc.setFont("Cairo-Regular", "bold");
  doc.text("Terms & Conditions:", 14, termsY);
  doc.setFont("Cairo-Regular", "normal");
  doc.setFontSize(9);
  doc.text(
    "Payment is due within the terms specified. Please make payment via bank transfer to the account details provided separately.",
    14,
    termsY + 6
  );

  // Add footer
  doc.setFontSize(9);
  doc.setTextColor(100, 100, 100);
  doc.text(
    "Thank you for your business",
    doc.internal.pageSize.width / 2,
    280,
    { align: "center" }
  );

  // Save the PDF file
  doc.save(`Invoice-${purchase.id.slice(0, 8).toUpperCase()}.pdf`);
};
