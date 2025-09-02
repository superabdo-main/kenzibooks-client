import { Product } from "@/types/products.type";

/**
 * Exports a list of products to an Excel file using xlsx library.
 * @param products - Array of Product objects to export.
 * @param t - Translation function for column headers.
 */
export const exportProductsToExcel = async (
  products: Product[],
  t: any
): Promise<void> => {
  // Dynamically import xlsx to ensure it's only loaded when needed
  const XLSX = await import("xlsx");
  
  // Define column headers for Excel
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

  // Format data for Excel
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

  // Create worksheet
  const ws = XLSX.utils.aoa_to_sheet([headers, ...data]);
  
  // Create workbook
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Products");
  
  // Generate Excel file and trigger download
  XLSX.writeFile(wb, "products.xlsx");
}; 