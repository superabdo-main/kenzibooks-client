"use client";

import React from "react";
import { createColumns } from "@/app/[locale]/dashboard/(accounting)/revenue/columns";
import { DataTable } from "@/components/data-table/data-table";
import { Revenue } from "@/stores/revenue.store";

interface RevenueTableProps {
  revenues: Revenue[];
  onDelete: (id: string) => Promise<void>;
  translations: any;
  onExportPDF?: () => void;
  onExportExcel?: () => void;
  onExportCSV?: () => void;
}

export const RevenueTable: React.FC<RevenueTableProps> = ({
  revenues,
  onDelete,
  translations,
  onExportPDF,
  onExportExcel,
  onExportCSV,
}) => {
  // Create columns with translations and delete handler
  const columns = createColumns(translations, onDelete);

  return (
    <DataTable
      columns={columns}
      data={revenues}
      searchColumn="description"
      translations={{
        noResults: translations.noResults,
        toolbar: translations.toolbar,
        pagination: translations.pagination,
      }}
      onExportPDF={onExportPDF}
      onExportExcel={onExportExcel}
      onExportCSV={onExportCSV}
    />
  );
};