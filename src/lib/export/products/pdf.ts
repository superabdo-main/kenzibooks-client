import { Product } from "@/types/products.type";

/**
 * Exports a list of products to a PDF file using jsPDF and jsPDF-AutoTable.
 * @param products - Array of Product objects to export.
 * @param t - Translation function for column headers.
 */
export const exportProductsToPDF = async (
  products: Product[],
  t: any
): Promise<void> => {
  const [{ default: jsPDF }, autoTable] = await Promise.all([
    import("jspdf"),
    import("jspdf-autotable").then((mod) => mod.default || mod),
    import("@/fonts/Amiri-Regular-normal"),
  ]);

  const doc = new jsPDF();

  // Define columns and rows for PDF
  const columns = [
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

  const rows = products.map((product) => [
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

  autoTable(doc, {
    head: [columns],
    body: rows,
    styles: { fontSize: 9 },
    headStyles: {
      fillColor: [16, 185, 129],
      font: "Amiri-Regular",
      cellWidth: "auto",
      fontStyle: "normal",
    }, // emerald-500
    bodyStyles: {
      fontStyle: "normal",
      font: "Amiri-Regular",
    },
    margin: { top: 0, bottom: 0, left: 0, right: 0 },
  });

  doc.save("products.pdf");
};