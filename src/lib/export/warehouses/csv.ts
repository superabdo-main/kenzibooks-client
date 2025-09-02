import { WarehouseType } from "@/types/warehouses.type";

/**
 * Exports a list of warehouses to a PDF file using jsPDF and jsPDF-AutoTable.
 * @param warehouses - Array of Warehouses objects to export.
 * @param t - Translation function for column headers.
 */
export const exportWarehousesToCSV = async (
  warehouses: WarehouseType[],
  t: any
): Promise<void> => {
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

  // Combine headers and data
  const csvContent = [
    headers.join(","),
    ...data.map(row => row.map(cell => 
      // Escape quotes and wrap in quotes if content contains commas or quotes
      typeof cell === 'string' && (cell.includes(',') || cell.includes('"')) 
        ? `"${cell.replace(/"/g, '""')}"` 
        : cell
    ).join(","))
  ].join("\n");

  // Create a download link for the CSV
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", "warehouses.csv");
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}; 