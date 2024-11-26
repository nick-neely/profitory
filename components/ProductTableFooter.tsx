
import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { TableCell, TableFooter, TableRow } from "@/components/ui/table";
import { Product } from "@/hooks/useProducts";
import { cn, formatCurrency } from "@/lib/utils";
import { useMemo } from "react";

interface ProductTableFooterProps {
  paginatedProducts: Product[];
  sortedColumns: (keyof Product)[];
  visibleTotals: (keyof Product)[];
  setVisibleTotals: (visibleTotals: (keyof Product)[]) => void;
  stickyFooter: boolean;
  setStickyFooter: (sticky: boolean) => void;
}

export function ProductTableFooter({
  paginatedProducts,
  sortedColumns,
  visibleTotals,
  setVisibleTotals,
  stickyFooter,
  setStickyFooter,
}: ProductTableFooterProps) {
  const totals = useMemo(() => {
    const totalValues: Partial<Record<keyof Product, number>> = {};
    visibleTotals.forEach((column) => {
      if (column === "quantity") {
        totalValues[column] = paginatedProducts.reduce(
          (total, product) => total + product.quantity,
          0
        );
      } else if (["price", "cost", "profit"].includes(column)) {
        totalValues[column] = paginatedProducts.reduce(
          (total, product) =>
            total + (product[column] as number) * product.quantity,
          0
        );
      }
    });
    return totalValues;
  }, [paginatedProducts, visibleTotals]);

  return (
    <TableFooter
      className={cn(
        stickyFooter && "sticky bottom-0 bg-background border-t-2"
      )}
    >
      <ContextMenu>
        <ContextMenuTrigger asChild>
          <TableRow>
            <TableCell colSpan={5} className="font-medium">
              Totals
            </TableCell>
            {sortedColumns.map((column) =>
              visibleTotals.includes(column) ? (
                <TableCell key={column} className="font-medium">
                  <div className="flex flex-col items-center">
                    <span className="text-xs text-muted-foreground">
                      {column.charAt(0).toUpperCase() + column.slice(1)}
                    </span>
                    <span>
                      {column === "quantity"
                        ? `${totals[column]} items`
                        : totals[column] !== undefined
                        ? formatCurrency(totals[column]!)
                        : null}
                    </span>
                  </div>
                </TableCell>
              ) : null
            )}
            <TableCell />
          </TableRow>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuCheckboxItem
            checked={stickyFooter}
            onCheckedChange={setStickyFooter}
          >
            Sticky Totals Row
          </ContextMenuCheckboxItem>
          <ContextMenuSeparator />
          <ContextMenuSub>
            <ContextMenuSubTrigger>
              Visible Totals
            </ContextMenuSubTrigger>
            <ContextMenuSubContent>
              {["quantity", "price", "cost", "profit"].map((column) => (
                <ContextMenuCheckboxItem
                  key={column}
                  checked={visibleTotals.includes(column as keyof Product)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setVisibleTotals([...visibleTotals, column as keyof Product]);
                    } else {
                      setVisibleTotals(visibleTotals.filter((col) => col !== column));
                    }
                  }}
                >
                  {column.charAt(0).toUpperCase() + column.slice(1)}
                </ContextMenuCheckboxItem>
              ))}
              <ContextMenuSeparator />
              <ContextMenuItem
                onClick={() =>
                  setVisibleTotals(["quantity", "price", "cost", "profit"])
                }
              >
                Reset Totals
              </ContextMenuItem>
            </ContextMenuSubContent>
          </ContextMenuSub>
        </ContextMenuContent>
      </ContextMenu>
    </TableFooter>
  );
}