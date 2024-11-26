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
}

export function ProductTableHeader({
  sortedColumns,
  renderColumnHeader,
  showFilterInputs,
  columns,
  renderFilterInput,
  pinnedColumns,
  stickyHeader,
}: ProductTableHeaderProps) {
  return (
    <TableHeader
      className={cn(
        stickyHeader && "sticky top-0 z-10 bg-background",
        "[&_tr]:bg-background",
        stickyHeader &&
          "[&_tr:first-child]:border-b-2 [&_tr:first-child]:border-border"
      )}
    >
      <TableRow>
        {sortedColumns.map((column) => (
          <TableHead
            key={column}
            style={{
              width: `var(--column-width-${column})`,
              position: "relative",
            }}
            className={cn(
              "transition-none",
              pinnedColumns.left.includes(column) &&
                "sticky left-0 bg-background",
              pinnedColumns.right.includes(column) &&
                "sticky right-0 bg-background"
            )}
          >
            {renderColumnHeader(column)}
          </TableHead>
        ))}
        <TableHead className="sticky right-0 bg-background">Action</TableHead>
      </TableRow>
      {showFilterInputs && (
        <TableRow>
          {columns.map((column) => (
            <TableHead key={`filter-${column}`}>
              <div data-filter={column}>{renderFilterInput(column)}</div>
            </TableHead>
          ))}
          <TableHead />
        </TableRow>
      )}
    </TableHeader>
  );
}
