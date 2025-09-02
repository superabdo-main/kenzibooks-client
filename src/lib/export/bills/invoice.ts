import { BillType } from "@/types/bills.type";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { formatDate, formatCurrency } from "@/lib/utils";

/**
 * Export an individual bill invoice to PDF
 */
export const exportBillInvoiceToPDF = (bill: BillType, t: any) => {
  // Create a new PDF document
  const doc = new jsPDF();
  
  // Set document metadata
  doc.setProperties({
    title: `Invoice-${bill.id.slice(0, 8).toUpperCase()}`,
    subject: 'Bill Invoice',
    author: 'Kinzi Dashboard',
    creator: 'Kinzi Dashboard'
  });
  
  // Invoice number
  const invoiceNumber = `INV-${bill.id.slice(0, 8).toUpperCase()}`;
  
  // Add title
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text("INVOICE", 14, 22);
  
  // Add invoice number and dates
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`Invoice Number: ${invoiceNumber}`, 14, 30);
  doc.text(`Date: ${formatDate(bill.billDate)}`, 14, 35);
  doc.text(`Due Date: ${formatDate(bill.expectedShipmentDate)}`, 14, 40);
  
  // Add status
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  const status = bill.status === "paid" ? "PAID" : bill.status.toUpperCase();
  const statusWidth = doc.getStringUnitWidth(status) * 12 / doc.internal.scaleFactor;
  doc.text(status, 195 - statusWidth, 22);
  
  // Add company info (from)
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("From:", 14, 55);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text("Kinzi Dashboard, Inc", 14, 60);
  doc.text("123 Business Avenue", 14, 65);
  doc.text("New York, NY 10001", 14, 70);
  doc.text("United States", 14, 75);
  doc.text("accounting@kinzidashboard.com", 14, 80);
  doc.text("+1 (555) 123-4567", 14, 85);
  
  // Add supplier info (to)
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("To:", 120, 55);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text("Supplier", 120, 60);
  doc.text(bill.supplierEmail, 120, 65);
  doc.text(bill.billingAddress.street, 120, 70);
  doc.text(`${bill.billingAddress.city}, ${bill.billingAddress.state} ${bill.billingAddress.zipCode}`, 120, 75);
  doc.text(bill.billingAddress.country, 120, 80);
  
  // Set up the items table
  autoTable(doc, {
    startY: 95,
    head: [["Item", "Quantity", "Unit Price", "Amount"]],
    body: bill.items.map((item) => [
      item.productName,
      item.quantity.toString(),
      formatCurrency(item.unitPrice),
      formatCurrency(item.total),
    ]),
    headStyles: {
      fillColor: [75, 85, 99],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      lineWidth: 0.1,
      halign: 'left',
    },
    columnStyles: {
      0: { cellWidth: 'auto' },
      1: { cellWidth: 30, halign: 'right' },
      2: { cellWidth: 40, halign: 'right' },
      3: { cellWidth: 40, halign: 'right' },
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
  doc.text(formatCurrency(bill.subtotal), 195, finalY, { align: "right" });
  
  doc.text("Sales Tax:", totalsX, finalY + 6);
  doc.text(formatCurrency(bill.salesTax), 195, finalY + 6, { align: "right" });
  
  doc.text("Discount:", totalsX, finalY + 12);
  doc.text(`-${formatCurrency(bill.discount)}`, 195, finalY + 12, { align: "right" });
  
  // Add line
  doc.setLineWidth(0.5);
  doc.line(totalsX, finalY + 16, 195, finalY + 16);
  
  // Add grand total
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("Total:", totalsX, finalY + 22);
  doc.text(formatCurrency(bill.grandTotal), 195, finalY + 22, { align: "right" });
  
  // Add notes if present
  if (bill.notes) {
    const notesY = finalY + 35;
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("Notes:", 14, notesY);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    
    const splitNotes = doc.splitTextToSize(bill.notes, 180);
    doc.text(splitNotes, 14, notesY + 6);
  }
  
  // Add terms and footer
  const termsY = finalY + (bill.notes ? 55 : 35);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("Terms & Conditions:", 14, termsY);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text("Payment is due within the terms specified. Please make payment via bank transfer to the account details provided separately.", 14, termsY + 6);
  
  // Add footer
  doc.setFontSize(9);
  doc.setTextColor(100, 100, 100);
  doc.text("Thank you for your business", doc.internal.pageSize.width / 2, 280, { align: "center" });
  
  // Save the PDF file
  doc.save(`Invoice-${bill.id.slice(0, 8).toUpperCase()}.pdf`);
}; 