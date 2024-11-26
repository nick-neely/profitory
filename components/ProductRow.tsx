import { Button } from "@/components/ui/button";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { TableCell, TableRow } from "@/components/ui/table";
import { Product } from "@/hooks/useProducts";
import { cn, formatCurrency } from "@/lib/utils";
import { ColumnConfig, RowActions } from "@/types/product-table";
import { copyToClipboard } from "@/utils/copy";
import { exportToCSV } from "@/utils/export";
import { toast } from "sonner";
import { EditProductFormModal } from "./EditProductFormModal";

interface ProductRowProps {
  product: Product;
  columnConfig: ColumnConfig;
  actions: RowActions;
}

export function ProductRow({
  product,
  columnConfig,
  actions,
}: ProductRowProps) {
  const handleExportRow = () => {
    exportToCSV(product, {
      filename: `product-${product.id}.csv`,
      fields: columnConfig.visibleColumns,
    });
  };

  const handleCopyRow = async () => {
    try {
      await copyToClipboard(product, {
        fields: columnConfig.visibleColumns,
      });
    } catch (err) {
      toast.error("Failed to copy row to clipboard", {
        description:
          err instanceof Error ? err.message : "Unknown error occurred",
      });
    }
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <TableRow
          className="cursor-pointer hover:bg-muted/50"
          onClick={() => actions.onRowClick(product)}
        >
          {columnConfig.sortedColumns.map((column) => (
            <TableCell
              key={`${product.id}-${column}`}
              className={cn(
                columnConfig.pinnedColumns.left.includes(column) &&
                  "sticky left-0 bg-background",
                columnConfig.pinnedColumns.right.includes(column) &&
                  "sticky right-0 bg-background"
              )}
            >
              {column === "price" || column === "cost" || column === "profit"
                ? formatCurrency(product[column])
                : product[column]}
            </TableCell>
          ))}
          <TableCell
            className="sticky right-0 bg-background"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex space-x-2">
              <EditProductFormModal
                product={product}
                onEditProduct={actions.onEditProduct}
              />
              <Button
                variant="outline"
                onClick={() => actions.onRemoveProduct(product.id)}
                className="text-red-600 hover:bg-red-100 hover:text-red-700 dark:hover:bg-red-900/30"
              >
                Remove
              </Button>
            </div>
          </TableCell>
        </TableRow>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem onClick={() => actions.onRowClick(product)}>
          View Details
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem onClick={handleExportRow}>
          Export Row to CSV
        </ContextMenuItem>
        <ContextMenuItem onClick={handleCopyRow}>
          Copy Row to Clipboard
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem
          className="text-red-600"
          onClick={() => actions.onRemoveProduct(product.id)}
        >
          Delete Row
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
