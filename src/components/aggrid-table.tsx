import { AgGridReact } from "ag-grid-react";
import { useEffect, useMemo, useRef, useState } from "react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import { Button } from "@/ui/button";
import { Skeleton } from "@/ui/skeleton";
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
  manual?: boolean;
  totalRows?: number;
  currentPage?: number;
  rowsPerPage?: number;
};

type AgGridTableProps<T extends Record<string, unknown>> = {
  rows?: T[];
  columnMap?: ColumnMap<T>;
  height?: number | string;
  className?: string;
  pagination?: boolean | PaginationConfig;
  emptyMessage?: string;
  loading?: boolean;
  actionColumn?: string;
  onActionClick?: (row: T) => void;
};

const defaultColDef = {
  sortable: true,
  filter: true,
  resizable: true,
  minWidth: 120,
  flex: 1,
};

const AgGridTable = <T extends Record<string, unknown>>({
  rows = [],
  columnMap = {} as ColumnMap<T>,
  height = "auto",
  className,
  pagination,
  emptyMessage = "No data available in table",
  loading = false,
  actionColumn,
  onActionClick,
}: AgGridTableProps<T>) => {
  const gridRef = useRef<AgGridReact | null>(null);
  const paginationConfig =
    typeof pagination === "object" ? pagination : undefined;
  const paginationEnabled = Boolean(pagination);
  const cols = useMemo(
    () =>
      Object.keys(columnMap).map((key) => ({
        field: key,
        cellStyle:
          actionColumn && key === actionColumn
            ? { cursor: "pointer" }
            : undefined,
      })),
    [columnMap, actionColumn],
  );

  const containerStyle = useMemo(() => ({ height, width: "100%" }), [height]);

  const themeClassName = className
    ? `ag-theme-quartz ag-grid-table ${className}`
    : "ag-theme-quartz ag-grid-table";

  const rowsPerPageOptions = paginationConfig?.rowsPerPageOptions ?? [10, 25, 50];
  const manualPagination = Boolean(paginationConfig?.manual);
  const [rowsPerPage, setRowsPerPage] = useState(
    paginationConfig?.initialRowsPerPage ?? rowsPerPageOptions[0],
  );
  const [currentPage, setCurrentPage] = useState(
    paginationConfig?.initialPage ?? 1,
  );

  const effectiveRowsPerPage = manualPagination
    ? paginationConfig?.rowsPerPage ?? rowsPerPageOptions[0]
    : rowsPerPage;
  const effectiveCurrentPage = manualPagination
    ? paginationConfig?.currentPage ?? 1
    : currentPage;
  const totalRows = manualPagination
    ? paginationConfig?.totalRows ?? rows.length
    : rows.length;
  const totalPages = Math.max(
    1,
    Math.ceil(totalRows / Math.max(1, effectiveRowsPerPage)),
  );
  const safePage = paginationEnabled
    ? Math.min(Math.max(1, effectiveCurrentPage), totalPages)
    : 1;
  const startIndex =
    totalRows === 0 ? 0 : (safePage - 1) * effectiveRowsPerPage + 1;
  const endIndex =
    totalRows === 0
      ? 0
      : Math.min(safePage * effectiveRowsPerPage, totalRows);
  const pageNumbers = Array.from(
    { length: totalPages },
    (_, index) => index + 1,
  );
  const maxPageButtons = 7;
  const visiblePages = useMemo(() => {
    if (!paginationEnabled) {
      return [];
    }
    if (totalPages <= maxPageButtons) {
      return pageNumbers;
    }

    const firstPage = 1;
    const lastPage = totalPages;
    const siblingCount = 1;
    const current = safePage;
    const leftBoundary = Math.max(current - siblingCount, 2);
    const rightBoundary = Math.min(current + siblingCount, totalPages - 1);
    const showLeftEllipsis = leftBoundary > 2;
    const showRightEllipsis = rightBoundary < totalPages - 1;

    const pages: (number | "ellipsis")[] = [firstPage];

    if (showLeftEllipsis) {
      pages.push("ellipsis");
    }

    for (let page = leftBoundary; page <= rightBoundary; page += 1) {
      pages.push(page);
    }

    if (showRightEllipsis) {
      pages.push("ellipsis");
    }

    pages.push(lastPage);

    return pages;
  }, [paginationEnabled, totalPages, pageNumbers, safePage]);

  useEffect(() => {
    if (!paginationEnabled || manualPagination) {
      return;
    }
    setCurrentPage(1);
  }, [rowsPerPage, totalRows, paginationEnabled, manualPagination]);

  useEffect(() => {
    if (!paginationEnabled || manualPagination) {
      return;
    }
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages, paginationEnabled, manualPagination]);

  const pagedRows = useMemo(() => {
    if (!paginationEnabled || manualPagination) {
      return rows;
    }
    const start = (safePage - 1) * rowsPerPage;
    return rows.slice(start, start + rowsPerPage);
  }, [paginationEnabled, manualPagination, rows, rowsPerPage, safePage]);

  const res = useMemo(
    () =>
      pagedRows.map((item) => ({
        ...Object.entries(columnMap).reduce<Record<string, unknown>>(
          (acc, [columnKey, fieldKey]) => ({
            ...acc,
            [columnKey]: item[fieldKey],
          }),
          {},
        ),
        __raw: item,
      })),
    [pagedRows, columnMap],
  );
  return (
    <div className="space-y-6">
      <div className="overflow-hidden rounded-lg border">
        <div className={themeClassName} style={containerStyle}>
          {loading ? (
            <div className="space-y-3 p-4">
              {Array.from({ length: 8 }).map((_, index) => (
                <Skeleton key={index} className="h-10 w-full" />
              ))}
            </div>
          ) : res.length > 0 ? (
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
              onCellClicked={(event) => {
                if (!actionColumn || !onActionClick) {
                  return;
                }
                if (event.colDef.field !== actionColumn) {
                  return;
                }
                const row =
                  (event.data as Record<string, unknown>)?.__raw ?? event.data;
                onActionClick(row as T);
              }}
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
                  value={String(effectiveRowsPerPage)}
                  onValueChange={(value) => {
                    const nextValue = Number(value);
                    if (!manualPagination) {
                      setRowsPerPage(nextValue);
                    }
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
                if (!manualPagination) {
                  setCurrentPage(1);
                }
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
                if (!manualPagination) {
                  setCurrentPage(nextPage);
                }
                paginationConfig?.onPageChange?.(nextPage);
              }}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            {visiblePages.map((pageNumber, index) =>
              pageNumber === "ellipsis" ? (
                <span
                  key={`ellipsis-${index}`}
                  className="px-2 text-muted-foreground"
                >
                  ...
                </span>
              ) : (
                <Button
                  key={pageNumber}
                  size="icon"
                variant={pageNumber === safePage ? "default" : "outline"}
                onClick={() => {
                  if (!manualPagination) {
                    setCurrentPage(pageNumber);
                  }
                  paginationConfig?.onPageChange?.(pageNumber);
                }}
              >
                  {pageNumber}
                </Button>
              ),
            )}
            <Button
              variant="outline"
              size="icon"
              disabled={safePage === totalPages}
              onClick={() => {
                const nextPage = Math.min(totalPages, safePage + 1);
                if (!manualPagination) {
                  setCurrentPage(nextPage);
                }
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
                if (!manualPagination) {
                  setCurrentPage(totalPages);
                }
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
