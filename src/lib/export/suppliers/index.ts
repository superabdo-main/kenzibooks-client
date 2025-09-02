import { SupplierType } from "@/types/suppliers.type";
import { utils, writeFile } from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { formatCurrency } from "@/lib/utils";

// Helper to prepare the data for export with correct formatting
const prepareExportData = (suppliers: SupplierType[], t: any) => {
  return suppliers.map((supplier) => ({
    [t("export.name")]: supplier.name,
    [t("export.contact")]: supplier.contact,
    [t("export.email")]: supplier.email,
    [t("export.gstNumber")]: supplier.gstNumber,
    [t("export.taxNumber")]: supplier.taxNumber,
    [t("export.openingBalance")]: formatCurrency(supplier.openingBalance),
    [t("export.address")]: supplier.address,
    [t("export.postCode")]: supplier.postCode,
    [t("export.country")]: supplier.country,
    [t("export.state")]: supplier.state,
    [t("export.city")]: supplier.city,
  }));
};

/**
 * Export suppliers to Excel
 */
export const exportSuppliersToExcel = (suppliers: SupplierType[], t: any) => {
  // Prepare the data
  const data = prepareExportData(suppliers, t);

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
 * Export suppliers to CSV
 */
export const exportSuppliersToCSV = (suppliers: SupplierType[], t: any) => {
  // Prepare the data
  const data = prepareExportData(suppliers, t);

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
 * Export suppliers to PDF
 */
export const exportSuppliersToPDF = (suppliers: SupplierType[], t: any) => {
  // Create a new PDF document
  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(18);
  doc.text(t("export.title"), 14, 22);
  
  // Set up the table
  const tableColumn = [
    t("export.name"),
    t("export.email"),
    t("export.contact"),
    t("export.openingBalance"),
  ];
  
  // Extract data from suppliers
  const tableRows = suppliers.map((supplier) => [
    supplier.name,
    supplier.email,
    supplier.contact,
    formatCurrency(supplier.openingBalance),
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