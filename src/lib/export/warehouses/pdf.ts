import { WarehouseType } from "@/types/warehouses.type";

/**
 * Exports a list of warehouses to a PDF file using jsPDF and jsPDF-AutoTable.
 * @param warehouses - Array of Warehouses objects to export.
 * @param t - Translation function for column headers.
 */
export const exportWarehousesToPDF = async (
  warehouses: WarehouseType[],
  t: any
): Promise<void> => {
  const [{ default: jsPDF }, autoTable] = await Promise.all([
    import("jspdf"),
    import("jspdf-autotable").then((mod) => mod.default || mod),
    import("@/fonts/Amiri-Regular-normal"),
  ]);

  const doc = new jsPDF();

  doc.setFont("Amiri-Regular");

  // Define columns and rows for PDF
  const columns = [
    t("columns.id"),
    t("columns.name"),
    t("columns.numberOfProducts"),
  ];

  const rows = warehouses.map((warehouse) => [
    warehouse.id,
    warehouse.name,
    warehouse.numberOfProducts,
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

  doc.save("warehouses.pdf");
};
