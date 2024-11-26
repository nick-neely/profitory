import { TableBody } from "@/components/ui/table";
import { Product } from "@/hooks/useProducts";
import { ColumnConfig, RowActions } from "@/types/product-table";
import { ProductCardView } from "./ProductCardView";
import { ProductRow } from "./ProductRow";

interface ProductTableBodyProps {
  paginatedProducts: Product[];
  columnConfig: ColumnConfig;
  actions: RowActions;
  isMobile: boolean;
}

export function ProductTableBody({
  paginatedProducts,
  columnConfig,
  actions,
  isMobile,
}: ProductTableBodyProps) {
  if (isMobile) {
    return (
      <ProductCardView
        products={paginatedProducts}
        columnConfig={columnConfig}
        actions={actions}
      />
    );
  }

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
