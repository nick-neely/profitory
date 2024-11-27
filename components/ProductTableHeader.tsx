import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Product } from "@/hooks/useProducts";
import { FilterValue } from "@/hooks/useProductTable";
import { cn } from "@/lib/utils";
import { Dispatch, SetStateAction } from "react";

interface ProductTableHeaderProps {
  sortedColumns: (keyof Product)[];
  renderColumnHeader: (column: keyof Product) => JSX.Element;
  showFilterInputs: boolean;
  columns: (keyof Product)[];
  renderFilterInput: (column: keyof Product) => JSX.Element;
  pinnedColumns: {
    left: (keyof Product)[];
    right: (keyof Product)[];
  };
  stickyHeader: boolean;
  handleMouseDown: (
    column: keyof Product,
    initialWidth: number,
    event: React.MouseEvent
  ) => void;
  widths: Record<string, number>;
  filters: Record<string, FilterValue>;
  handleSort: (column: keyof Product) => void;
  setFilters: Dispatch<SetStateAction<Record<string, FilterValue>>>;
  resetColumnWidths: () => void;
  resetColumns: () => void;
  toggleColumn: (column: keyof Product) => void;
  hiddenColumnsCount: number;
  defaultColumns: (keyof Product)[];
  stickyFooter: boolean;
  setStickyFooter: (value: boolean) => void;
  setShowFilterInputs: (value: boolean) => void;
  getPinnedPosition?: (column: keyof Product) => "left" | "right" | null;
  getCumulativePinnedWidth?: (
    column: keyof Product,
    position: "left" | "right"
  ) => number;
}

export function ProductTableHeader({
  sortedColumns,
  renderColumnHeader,
  showFilterInputs,
  columns,
  renderFilterInput,
  pinnedColumns,
  stickyHeader,
  getPinnedPosition,
  getCumulativePinnedWidth,
}: ProductTableHeaderProps) {
  return (
    <TableHeader
      className={cn(
        "relative",
        stickyHeader && "sticky top-0 z-20 bg-background",
        "[&_tr]:bg-background",
        stickyHeader &&
          "[&_tr:first-child]:border-b-2 [&_tr:first-child]:border-border"
      )}
    >
      <TableRow>
        {sortedColumns.map((column) => {
          const pinnedPosition = getPinnedPosition?.(column);
          const isPinned = pinnedPosition !== null;
          const offset = isPinned
            ? getCumulativePinnedWidth?.(column, pinnedPosition!) ?? 0
            : 0;

          return (
            <TableHead
              key={column}
              style={{
                width: `var(--column-width-${column})`,
                position: "relative",
                ...(isPinned && {
                  position: "sticky",
                  [pinnedPosition === "left" ? "left" : "right"]: `${offset}px`,
                  zIndex: 30, // Higher z-index for pinned headers
                }),
              }}
              className={cn(
                "transition-none",
                pinnedColumns.left.includes(column) &&
                  "sticky left-0 bg-background border-r",
                pinnedColumns.right.includes(column) &&
                  "sticky right-0 bg-background border-l",
                isPinned && "shadow-sm" // Optional: add subtle shadow to pinned columns
              )}
            >
              {renderColumnHeader(column)}
            </TableHead>
          );
        })}
        <TableHead
          className="sticky right-0 bg-background"
          style={{
            position: "sticky",
            right: 0,
            zIndex: 30, // Match the z-index of other pinned headers
          }}
        >
          Action
        </TableHead>
      </TableRow>
      {showFilterInputs && (
        <TableRow>
          {columns.map((column) => {
            const pinnedPosition = getPinnedPosition?.(column);
            const isPinned = pinnedPosition !== null;
            const offset = isPinned
              ? getCumulativePinnedWidth?.(column, pinnedPosition!) ?? 0
              : 0;

            return (
              <TableHead
                key={`filter-${column}`}
                style={{
                  ...(isPinned && {
                    position: "sticky",
                    [pinnedPosition === "left"
                      ? "left"
                      : "right"]: `${offset}px`,
                    zIndex: 30,
                  }),
                }}
                className={cn(
                  pinnedColumns.left.includes(column) &&
                    "sticky left-0 bg-background border-r",
                  pinnedColumns.right.includes(column) &&
                    "sticky right-0 bg-background border-l"
                )}
              >
                <div data-filter={column}>{renderFilterInput(column)}</div>
              </TableHead>
            );
          })}
          <TableHead
            className="sticky right-0 bg-background"
            style={{
              position: "sticky",
              right: 0,
              zIndex: 30,
            }}
          />
        </TableRow>
      )}
    </TableHeader>
  );
}
