import { Product } from "@/types/products.type";

/**
 * Exports a list of products to a CSV file.
 * @param products - Array of Product objects to export.
 * @param t - Translation function for column headers.
 */
export const exportProductsToCSV = async (
  products: Product[],
  t: any
): Promise<void> => {
  // Define column headers for CSV
  const headers = [
    t("columns.name"),
    t("columns.sku"),
    t("columns.barcode"),
    t("columns.category"),
    t("columns.warehouse"),
    t("columns.quantity"),
    t("columns.purchasePrice"),
    t("columns.salePrice"),
    t("columns.description"),
    t("columns.tax"),
  ];

  // Format data for CSV
  const data = products.map((product) => [
    product.name,
    product.sku,
    product.barcode,
    product.category,
    product.warehouses.map((warehouse) => warehouse.name).join(", "),
    product.warehouses.reduce((sum, warehouse) => sum + warehouse.quantity, 0),
    product.purchasePrice,
    product.salePrice,
    product.description,
    product.tax,
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
  link.setAttribute("download", "products.csv");
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}; 