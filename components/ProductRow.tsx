import { formatCurrency } from "@/lib/utils";
import { Product } from "@/hooks/useProducts";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { EditProductForm } from "./EditProductForm";
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
} from "@/components/ui/context-menu";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { ColumnConfig, RowActions } from "@/types/product-table";

interface ProductRowProps {
  product: Product;
  columnConfig: ColumnConfig;
  actions: RowActions;
}

export function ProductRow({ product, columnConfig, actions }: ProductRowProps) {
  const exportRowToCSV = async (product: Product) => {
    const headers = columnConfig.visibleColumns;
    const row = columnConfig.visibleColumns.map((column) => {
      const value = product[column];
      return column === "price" || column === "cost" || column === "profit"
        ? formatCurrency(value as number)
        : String(value);
    });

    const csvContent = [headers, row]
      .map((row) => row.map((item) => `"${item}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `product-${product.id}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const copyRowToClipboard = async (product: Product) => {
    const rowData = columnConfig.visibleColumns
      .map((column) => {
        const value = product[column];
        return column === "price" || column === "cost" || column === "profit"
          ? formatCurrency(value as number)
          : String(value);
      })
      .join(", ");

    try {
      await navigator.clipboard.writeText(rowData);
    } catch (err) {
      console.error("Failed to copy to clipboard:", err);
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
              {column === "price" ||
              column === "cost" ||
              column === "profit"
                ? formatCurrency(product[column])
                : product[column]}
            </TableCell>
          ))}
          <TableCell
            className="sticky right-0 bg-background"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex space-x-2">
              <EditProductForm
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
        <ContextMenuItem onClick={() => exportRowToCSV(product)}>
          Export Row to CSV
        </ContextMenuItem>
        <ContextMenuItem onClick={() => copyRowToClipboard(product)}>
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