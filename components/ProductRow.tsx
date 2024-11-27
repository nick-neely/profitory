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
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { DeleteConfirmationModal } from "./DeleteConfirmationModal";
import { EditProductFormModal } from "./EditProductFormModal";

interface ProductRowProps {
  product: Product;
  columnConfig: ColumnConfig & {
    getPinnedPosition: (column: keyof Product) => "left" | "right" | null;
    getCumulativePinnedWidth: (column: keyof Product, position: "left" | "right") => number;
  };
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
                "transition-colors",
                columnConfig.pinnedColumns.left.includes(column) &&
                  "sticky left-0 bg-background border-r",
                columnConfig.pinnedColumns.right.includes(column) &&
                  "sticky right-0 bg-background border-l"
              )}
              style={{
                [columnConfig.pinnedColumns.left.includes(column) ? "left" : "right"]:
                  columnConfig.getPinnedPosition(column) !== null
                    ? `${columnConfig.getCumulativePinnedWidth(
                        column,
                        columnConfig.getPinnedPosition(column)!
                      )}px`
                    : undefined,
              }}
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
                trigger={
                  <Button variant="outline" size="icon" className="md:hidden">
                    <Pencil className="h-4 w-4" />
                  </Button>
                }
              />
              <EditProductFormModal
                product={product}
                onEditProduct={actions.onEditProduct}
                trigger={
                  <Button variant="outline" className="hidden md:inline-flex">
                    Edit
                  </Button>
                }
              />
              <DeleteConfirmationModal
                productName={product.name}
                onConfirm={() => actions.onRemoveProduct(product.id)}
                trigger={
                  <Button
                    variant="outline"
                    size="icon"
                    className="md:hidden text-red-600 hover:bg-red-100 hover:text-red-700 dark:hover:bg-red-900/30"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                }
              />
              <DeleteConfirmationModal
                productName={product.name}
                onConfirm={() => actions.onRemoveProduct(product.id)}
                trigger={
                  <Button
                    variant="outline"
                    className="hidden md:inline-flex text-red-600 hover:bg-red-100 hover:text-red-700 dark:hover:bg-red-900/30"
                  >
                    Remove
                  </Button>
                }
              />
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
