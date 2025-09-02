import { WarehouseType } from "@/types/warehouses.type";

/**
 * Exports a list of warehouses to a PDF file using jsPDF and jsPDF-AutoTable.
 * @param warehouses - Array of Warehouses objects to export.
 * @param t - Translation function for column headers.
 */
export const exportWarehousesToExcel = async (
  warehouses: WarehouseType[],
  t: any
): Promise<void> => {
  // Dynamically import xlsx to ensure it's only loaded when needed
  const XLSX = await import("xlsx");
  
  // Define column headers for Excel
  const headers = [
    t("columns.id"),
    t("columns.name"),
    t("columns.numberOfProducts"),
  ];

  // Format data for Excel
  const data = warehouses.map((warehouse) => [
    warehouse.id,
    warehouse.name,
    warehouse.numberOfProducts
  ]);

  // Create worksheet
  const ws = XLSX.utils.aoa_to_sheet([headers, ...data]);
  
  // Create workbook
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "warehouses");
  
  // Generate Excel file and trigger download
  XLSX.writeFile(wb, "warehouses.xlsx");
}; 