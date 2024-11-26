
import { Product, ProductInput } from "@/hooks/useProducts";

export interface RowActions {
  onEditProduct: (id: string, product: ProductInput) => void;
  onRemoveProduct: (id: string) => void;
  onRowClick: (product: Product) => void;
}

export interface ColumnConfig {
  pinnedColumns: {
    left: (keyof Product)[];
    right: (keyof Product)[];
  };
  visibleColumns: (keyof Product)[];
  sortedColumns: (keyof Product)[];
}