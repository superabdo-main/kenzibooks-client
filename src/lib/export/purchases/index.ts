import { PurchaseType } from "@/types/purchases.type";
import { utils, writeFile } from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { formatDate, formatCurrency } from "@/lib/utils";

// Helper to prepare the data for export with correct formatting
const prepareExportData = (purchases: PurchaseType[], t: any) => {
  return purchases.map((purchase) => ({
    [t("export.supplier")]: purchase.supplierEmail,
    [t("export.purchaseDate")]: formatDate(purchase.purchaseDate),
    [t("export.expectedShipmentDate")]: formatDate(purchase.expectedShipmentDate),
    [t("export.terms")]: purchase.terms,
    [t("export.subtotal")]: formatCurrency(purchase.subtotal),
    [t("export.salesTax")]: formatCurrency(purchase.salesTax),
    [t("export.discount")]: formatCurrency(purchase.discount),
    [t("export.grandTotal")]: formatCurrency(purchase.grandTotal),
    [t("export.status")]: purchase.status,
  }));
};

/**
 * Export purchases to Excel
 */
export const exportPurchasesToExcel = (purchases: PurchaseType[], t: any) => {
  // Prepare the data
  const data = prepareExportData(purchases, t);

  // Create a new workbook
  const workbook = utils.book_new();
  
  // Convert data to worksheet
  const worksheet = utils.json_to_sheet(data);
  
  // Add the worksheet to the workbook
  utils.book_append_sheet(workbook, worksheet, t("export.sheetName"));
  
  // Generate Excel file
  writeFile(workbook, `${t("export.fileName")}.xlsx`);
};

/**
 * Export purchases to CSV
 */
export const exportPurchasesToCSV = (purchases: PurchaseType[], t: any) => {
  // Prepare the data
  const data = prepareExportData(purchases, t);

  // Create a new workbook
  const workbook = utils.book_new();
  
  // Convert data to worksheet
  const worksheet = utils.json_to_sheet(data);
  
  // Add the worksheet to the workbook
  utils.book_append_sheet(workbook, worksheet, t("export.sheetName"));
  
  // Generate CSV file
  writeFile(workbook, `${t("export.fileName")}.csv`);
};

/**
 * Export purchases to PDF
 */
export const exportPurchasesToPDF = (purchases: PurchaseType[], t: any) => {
  // Create a new PDF document
  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(18);
  doc.text(t("export.title"), 14, 22);
  
  // Set up the table
  const tableColumn = [
    t("export.supplier"),
    t("export.purchaseDate"),
    t("export.grandTotal"),
    t("export.status"),
  ];
  
  // Extract data from purchases
  const tableRows = purchases.map((purchase) => [
    purchase.supplierEmail,
    formatDate(purchase.purchaseDate),
    formatCurrency(purchase.grandTotal),
    purchase.status,
  ]);
  
  // Generate the table
  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: 30,
    styles: {
      fontSize: 10,
      cellPadding: 2,
      lineColor: [0, 0, 0],
    },
    headStyles: {
      fillColor: [75, 85, 99],
      textColor: [255, 255, 255],
      lineWidth: 0.1,
    },
    alternateRowStyles: {
      fillColor: [240, 240, 240],
    },
  });
  
  // Save the PDF file
  doc.save(`${t("export.fileName")}.pdf`);
}; 