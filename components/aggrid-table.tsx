import { AgGridReact } from "ag-grid-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
// import "ag-grid-community/styles/ag-grid.css";
// import "ag-grid-community/styles/ag-theme-alpine.css";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import { Button } from "@/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/ui/select";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

// Register all Community features
ModuleRegistry.registerModules([AllCommunityModule]);

type ColumnMap<T extends Record<string, unknown>> = Record<string, keyof T>;

type PaginationConfig = {
  rowsPerPageOptions?: number[];
  initialRowsPerPage?: number;
  initialPage?: number;
  onRowsPerPageChange?: (value: number) => void;
  onPageChange?: (page: number) => void;
};

type AgGridTableProps<T extends Record<string, unknown>> = {
  rows?: T[];
  columnMap?: ColumnMap<T>;
  height?: number | string;
  className?: string;
  pagination?: boolean | PaginationConfig;
  emptyMessage?: string;
};

const defaultColDef = {
  sortable: true,
  filter: true,
  resizable: true,
  minWidth: 120,
};

const AgGridTable = <T extends Record<string, unknown>>({
  rows = [],
  columnMap = {} as ColumnMap<T>,
  height = "auto",
  className,
  pagination,
  emptyMessage = "No data available in table",
}: AgGridTableProps<T>) => {
  const gridRef = useRef<AgGridReact | null>(null);
  const paginationConfig =
    typeof pagination === "object" ? pagination : undefined;
  const paginationEnabled = Boolean(pagination);
  const cols = useMemo(
    () => Object.keys(columnMap).map((key) => ({ field: key })),
    [columnMap],
  );

  const containerStyle = useMemo(() => ({ height, width: "100%" }), [height]);

  const themeClassName = className
    ? `ag-theme-quartz ag-grid-table ${className}`
    : "ag-theme-quartz ag-grid-table";

  const rowsPerPageOptions =
    paginationConfig?.rowsPerPageOptions ?? [10, 25, 50];
  const [rowsPerPage, setRowsPerPage] = useState(
    paginationConfig?.initialRowsPerPage ?? rowsPerPageOptions[0],
  );
  const [currentPage, setCurrentPage] = useState(
    paginationConfig?.initialPage ?? 1,
  );

  const totalRows = rows.length;
  const totalPages = Math.max(1, Math.ceil(totalRows / rowsPerPage));
  const safePage = paginationEnabled
    ? Math.min(Math.max(1, currentPage), totalPages)
    : 1;
  const startIndex = totalRows === 0 ? 0 : (safePage - 1) * rowsPerPage + 1;
  const endIndex =
    totalRows === 0 ? 0 : Math.min(safePage * rowsPerPage, totalRows);
  const pageNumbers = Array.from(
    { length: totalPages },
    (_, index) => index + 1,
  );

  useEffect(() => {
    if (!paginationEnabled) {
      return;
    }
    setCurrentPage(1);
  }, [rowsPerPage, totalRows, paginationEnabled]);

  useEffect(() => {
    if (!paginationEnabled) {
      return;
    }
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages, paginationEnabled]);

  const pagedRows = useMemo(() => {
    if (!paginationEnabled) {
      return rows;
    }
    const start = (safePage - 1) * rowsPerPage;
    return rows.slice(start, start + rowsPerPage);
  }, [paginationEnabled, rows, rowsPerPage, safePage]);

  const res = useMemo(
    () =>
      pagedRows.map((item) =>
        Object.entries(columnMap).reduce<Record<string, unknown>>(
          (acc, [columnKey, fieldKey]) => ({
            ...acc,
            [columnKey]: item[fieldKey],
          }),
          {},
        ),
      ),
    [pagedRows, columnMap],
  );
  const autoSizeColumns = useCallback(() => {
    const api = gridRef.current?.api;
    if (!api) {
      return;
    }
    const allColumns = api.getColumns() ?? [];
    if (allColumns.length === 0) {
      return;
    }
    api.autoSizeColumns(
      allColumns.map((column) => column.getColId()),
      true,
    );
  }, []);

  return (
    <div className="space-y-6">
      <div className="overflow-hidden rounded-lg border">
        <div className={themeClassName} style={containerStyle}>
          {res.length > 0 ? (
            <AgGridReact
              ref={gridRef}
              rowData={res}
              columnDefs={cols}
              defaultColDef={defaultColDef}
              animateRows
              domLayout="autoHeight"
              rowHeight={52}
              suppressMovableColumns
              theme="legacy"
              onGridReady={autoSizeColumns}
              onFirstDataRendered={autoSizeColumns}
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
              {emptyMessage}
            </div>
          )}
        </div>
      </div>

      {paginationEnabled ? (
        <div className="flex flex-col gap-4 text-sm md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
            <div className="flex items-center gap-2">
              <span>Rows per page</span>
              <Select
                value={String(rowsPerPage)}
                onValueChange={(value) => {
                  const nextValue = Number(value);
                  setRowsPerPage(nextValue);
                  paginationConfig?.onRowsPerPageChange?.(nextValue);
                }}
              >
                <SelectTrigger id="rows-per-page" className="h-9 w-20">
                  <SelectValue placeholder="10" />
                </SelectTrigger>
                <SelectContent>
                  {rowsPerPageOptions.map((value) => (
                    <SelectItem key={value} value={String(value)}>
                      {value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <span>
              {totalRows === 0
                ? "Showing 0-0 of 0"
                : `Showing ${startIndex}-${endIndex} of ${totalRows}`}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              disabled={safePage === 1}
              onClick={() => {
                setCurrentPage(1);
                paginationConfig?.onPageChange?.(1);
              }}
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              disabled={safePage === 1}
              onClick={() => {
                const nextPage = Math.max(1, safePage - 1);
                setCurrentPage(nextPage);
                paginationConfig?.onPageChange?.(nextPage);
              }}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            {pageNumbers.map((pageNumber) => (
              <Button
                key={pageNumber}
                size="icon"
                variant={pageNumber === safePage ? "default" : "outline"}
                onClick={() => {
                  setCurrentPage(pageNumber);
                  paginationConfig?.onPageChange?.(pageNumber);
                }}
              >
                {pageNumber}
              </Button>
            ))}
            <Button
              variant="outline"
              size="icon"
              disabled={safePage === totalPages}
              onClick={() => {
                const nextPage = Math.min(totalPages, safePage + 1);
                setCurrentPage(nextPage);
                paginationConfig?.onPageChange?.(nextPage);
              }}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              disabled={safePage === totalPages}
              onClick={() => {
                setCurrentPage(totalPages);
                paginationConfig?.onPageChange?.(totalPages);
              }}
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default AgGridTable;
