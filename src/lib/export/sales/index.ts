import { SaleType } from "@/types/sales.type";
import { utils, writeFile } from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { formatDate, formatCurrency } from "@/lib/utils";

// Helper to prepare the data for export with correct formatting
const prepareExportData = (sales: SaleType[], t: any) => {
  return sales.map((sale) => ({
    [t("export.customer")]: sale.customerEmail,
    [t("export.saleDate")]: formatDate(sale.saleDate),
    [t("export.expectedDeliveryDate")]: formatDate(sale.expectedDeliveryDate),
    [t("export.terms")]: sale.terms,
    [t("export.subtotal")]: formatCurrency(sale.subtotal),
    [t("export.salesTax")]: formatCurrency(sale.salesTax),
    [t("export.discount")]: formatCurrency(sale.discount),
    [t("export.grandTotal")]: formatCurrency(sale.grandTotal),
    [t("export.status")]: sale.status,
  }));
};

/**
 * Export sales to Excel
 */
export const exportSalesToExcel = (sales: SaleType[], t: any) => {
  // Prepare the data
  const data = prepareExportData(sales, t);

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
 * Export sales to CSV
 */
export const exportSalesToCSV = (sales: SaleType[], t: any) => {
  // Prepare the data
  const data = prepareExportData(sales, t);

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
 * Export sales to PDF
 */
export const exportSalesToPDF = (sales: SaleType[], t: any) => {
  // Create a new PDF document
  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(18);
  doc.text(t("export.title"), 14, 22);
  
  // Set up the table
  const tableColumn = [
    t("export.customer"),
    t("export.saleDate"),
    t("export.grandTotal"),
    t("export.status"),
  ];
  
  // Extract data from sales
  const tableRows = sales.map((sale) => [
    sale.customerEmail,
    formatDate(sale.saleDate),
    formatCurrency(sale.grandTotal),
    sale.status,
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