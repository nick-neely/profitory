import { Product } from "@/hooks/useProducts";

export interface RowActions {
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
  onView: (product: Product) => void;
}

export interface ColumnConfig {
  pinnedColumns: {
    left: (keyof Product)[];
    right: (keyof Product)[];
  };
  visibleColumns: (keyof Product)[];
  sortedColumns: (keyof Product)[];
}
