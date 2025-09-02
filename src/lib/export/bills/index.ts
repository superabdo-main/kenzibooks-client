import { BillType } from "@/types/bills.type";
import { utils, writeFile } from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { formatDate, formatCurrency } from "@/lib/utils";

// Helper to prepare the data for export with correct formatting
const prepareExportData = (bills: BillType[], t: any) => {
  return bills.map((bill) => ({
    [t("export.supplier")]: bill.supplierEmail,
    [t("export.billDate")]: formatDate(bill.billDate),
    [t("export.expectedShipmentDate")]: formatDate(bill.expectedShipmentDate),
    [t("export.terms")]: bill.terms,
    [t("export.subtotal")]: formatCurrency(bill.subtotal),
    [t("export.salesTax")]: formatCurrency(bill.salesTax),
    [t("export.discount")]: formatCurrency(bill.discount),
    [t("export.grandTotal")]: formatCurrency(bill.grandTotal),
    [t("export.status")]: bill.status,  
  }));
};

/**
 * Export bills to Excel
 */
export const exportBillsToExcel = (bills: BillType[], t: any) => {
  // Prepare the data
  const data = prepareExportData(bills, t);

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
 * Export bills to CSV
 */
export const exportBillsToCSV = (bills: BillType[], t: any) => {
  // Prepare the data
  const data = prepareExportData(bills, t);

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
 * Export bills to PDF
 */
export const exportBillsToPDF = (bills: BillType[], t: any) => {
  // Create a new PDF document
  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(18);
  doc.text(t("export.title"), 14, 22);
  
  // Set up the table
  const tableColumn = [
    t("export.supplier"),
    t("export.billDate"),
    t("export.grandTotal"),
    t("export.status"),
  ];
  
  // Extract data from bills
  const tableRows = bills.map((bill) => [
    bill.supplierEmail,
    formatDate(bill.billDate),
    formatCurrency(bill.grandTotal),
    bill.status,
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