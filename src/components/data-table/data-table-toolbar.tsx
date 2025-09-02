"use client";
import { Cross2Icon, FileTextIcon } from "@radix-ui/react-icons";
import { Table } from "@tanstack/react-table";
import { FileDown, PlusIcon, Search, SlidersHorizontal } from "lucide-react";

import { Button } from "@/components/shadcn-ui/button";
import { Input } from "@/components/shadcn-ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/shadcn-ui/popover";
import { Separator } from "@/components/shadcn-ui/separator";
import { Badge } from "@/components/shadcn-ui/badge";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../shadcn-ui/dropdown-menu";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  searchColumn?: string;
  translations?: {
    new?: string;
    search?: string;
    filters?: string;
    filterColumns?: string;
    reset?: string;
    print?: string;
    export?: string;
    excel?: string;
    csv?: string;
    pdf?: string;
  };
  onExportPDF?: () => void;
  onExportExcel?: () => void;
  onExportCSV?: () => void;
}

export function DataTableToolbar<TData>({
  table,
  searchColumn = "name",
  translations = {
    new: "New Product",
    search: "Search products...",
    filters: "Filters",
    filterColumns: "Filter Columns",
    reset: "Reset",
    print: "Print",
    export: "Export",
    excel: "Excel",
    csv: "CSV",
    pdf: "PDF",
  },
  onExportPDF,
  onExportExcel,
  onExportCSV,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 py-4">
      <div className="flex flex-1 items-start  lg:flex-row flex-col gap-2">
        <div className="relative w-64 md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={translations.search}
            value={
              (table.getColumn(searchColumn)?.getFilterValue() as string) ?? ""
            }
            onChange={(event) =>
              table.getColumn(searchColumn)?.setFilterValue(event.target.value)
            }
            className="pl-9 h-10 bg-background border-border"
          />
        </div>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className={cn(
                "h-10 border-border bg-background hover:bg-muted/50",
                isFiltered && "bg-muted/50 font-medium text-accent-foreground"
              )}
            >
              <SlidersHorizontal className="mr-2 h-4 w-4" />
              {translations.filters}
              {isFiltered && (
                <Badge
                  variant="secondary"
                  className="ml-2 rounded-full px-1.5 py-0.5 font-normal"
                >
                  {table.getState().columnFilters.length}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[240px] p-0" align="start">
            <div className="p-3 text-sm font-medium border-b">
              {translations.filterColumns}
            </div>
            <div className="p-3 grid gap-3">
              {table
                .getAllColumns()
                .filter(
                  (column) =>
                    column.getCanFilter() &&
                    column.id !== searchColumn &&
                    column.id !== "select" &&
                    column.id !== "actions"
                )
                .map((column) => {
                  return (
                    <div key={column.id} className="grid gap-1.5">
                      <label className="text-sm font-medium text-muted-foreground">
                        {column.id.charAt(0).toUpperCase() + column.id.slice(1)}
                      </label>
                      <Input
                        placeholder={`Filter ${column.id}...`}
                        value={(column.getFilterValue() as string) ?? ""}
                        onChange={(event) =>
                          column.setFilterValue(event.target.value)
                        }
                        className="h-8 text-sm"
                      />
                    </div>
                  );
                })}
            </div>
            {isFiltered && (
              <>
                <Separator />
                <div className="p-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => table.resetColumnFilters()}
                    className="w-full justify-center text-xs"
                  >
                    <Cross2Icon className="mr-2 h-3.5 w-3.5" />
                    {translations.reset}
                  </Button>
                </div>
              </>
            )}
          </PopoverContent>
        </Popover>
        {isFiltered && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => table.resetColumnFilters()}
            className="h-10 px-3 lg:px-4"
          >
            <Cross2Icon className="mr-2 h-4 w-4" />
            {translations.reset}
          </Button>
        )}
      </div>
      <div className="flex items-center space-x-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="h-10 bg-background border-border hover:bg-muted/50"
            >
              <FileDown className="mr-2 h-4 w-4" />
              {translations.export}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onExportExcel}>
              <FileTextIcon className="mr-2 h-4 w-4 text-muted-foreground" />
              {translations.excel}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onExportCSV}>
              <FileTextIcon className="mr-2 h-4 w-4 text-muted-foreground" />
              {translations.csv}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onExportPDF}>
              <FileTextIcon className="mr-2 h-4 w-4 text-muted-foreground" />
              {translations.pdf}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
      </div>
    </div>
  );
}
