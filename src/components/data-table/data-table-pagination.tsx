"use client"
import { Table } from "@tanstack/react-table"
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react"

import { Button } from "@/components/shadcn-ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/shadcn-ui/select"
import { cn } from "@/lib/utils"

interface DataTablePaginationProps<TData> {
  table: Table<TData>
  translations?: {
    rowsSelected?: string;
    rowsPerPage?: string;
    page?: string;
    of?: string;
    firstPage?: string;
    previousPage?: string;
    nextPage?: string;
    lastPage?: string;
  }
}

export function DataTablePagination<TData>({
  table,
  translations = {
    rowsSelected: "of row(s) selected.",
    rowsPerPage: "Rows per page",
    page: "Page",
    of: "of",
    firstPage: "Go to first page",
    previousPage: "Go to previous page",
    nextPage: "Go to next page",
    lastPage: "Go to last page"
  }
}: DataTablePaginationProps<TData>) {
  return (
    <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3 px-2 py-4">
      <div className="flex items-center space-x-6 lg:space-x-8">
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium text-muted-foreground whitespace-nowrap">
            {translations.rowsPerPage}
          </p>
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => {
              table.setPageSize(Number(value))
            }}
          >
            <SelectTrigger className="h-8 w-[70px] border-border">
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side="top" className="min-w-0">
              {[10, 20, 50, 100].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-1 text-sm">
          <div className="flex w-[100px] items-center justify-center text-sm font-medium">
            <span className="text-muted-foreground">{translations.page}</span>
            <span className="mx-1.5 font-semibold">{table.getState().pagination.pageIndex + 1}</span>
            <span className="text-muted-foreground">{translations.of} {table.getPageCount()}</span>
          </div>
        </div>
      </div>
      
      <div className="flex justify-between sm:justify-end w-full">
        <div className="flex-1 text-sm text-muted-foreground sm:hidden">
          {table.getFilteredSelectedRowModel().rows.length} {translations.rowsSelected && translations.rowsSelected}
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            className={cn(
              "hidden h-8 w-8 p-0 lg:flex border-border",
              !table.getCanPreviousPage() && "opacity-50"
            )}
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">{translations.firstPage}</span>
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className={cn(
              "h-8 w-8 p-0 border-border",
              !table.getCanPreviousPage() && "opacity-50"
            )}
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">{translations.previousPage}</span>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className={cn(
              "h-8 w-8 p-0 border-border",
              !table.getCanNextPage() && "opacity-50"
            )}
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">{translations.nextPage}</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className={cn(
              "hidden h-8 w-8 p-0 lg:flex border-border",
              !table.getCanNextPage() && "opacity-50"
            )}
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">{translations.lastPage}</span>
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="hidden sm:flex flex-1 text-sm text-muted-foreground">
        {table.getFilteredSelectedRowModel().rows.length} {translations.rowsSelected && translations.rowsSelected}
      </div>
    </div>
  )
} 