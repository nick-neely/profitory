
import { TableBody } from "@/components/ui/table";
import { ProductRow } from "./ProductRow";
import { Product } from "@/hooks/useProducts";
import { ColumnConfig, RowActions } from "@/types/product-table";

interface ProductTableBodyProps {
  paginatedProducts: Product[];
  columnConfig: ColumnConfig & {
    getPinnedPosition: (column: keyof Product) => "left" | "right" | null;
    getCumulativePinnedWidth: (column: keyof Product, position: "left" | "right") => number;
  };
  actions: RowActions;
}

export function ProductTableBody({
  paginatedProducts,
  columnConfig,
  actions,
}: ProductTableBodyProps) {
  return (
    <TableBody>
      {paginatedProducts.map((product) => (
        <ProductRow
          key={product.id}
          product={product}
          columnConfig={columnConfig}
          actions={actions}
        />
      ))}
    </TableBody>
  );
}