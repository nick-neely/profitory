import { Product } from "@/hooks/useProducts";
import { formatCurrency } from "@/lib/utils";
import { ColumnConfig, RowActions } from "@/types/product-table";
import { Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { EditProductFormModal } from "./EditProductFormModal";
import { Button } from "./ui/button";
import { Card } from "./ui/card";

interface ProductCardViewProps {
  products: Product[];
  columnConfig: ColumnConfig;
  actions: RowActions;
}

export function ProductCardView({
  products,
  columnConfig,
  actions,
}: ProductCardViewProps) {
  const formatValue = (
    column: keyof Product,
    value: Product[keyof Product]
  ) => {
    if (column === "price" || column === "cost" || column === "profit") {
      return formatCurrency(Number(value));
    }
    return value;
  };

  const handleDelete = (productId: string, productName: string) => {
    actions.onRemoveProduct(productId);
    toast.success("Product deleted", {
      description: `${productName} has been removed`,
    });
  };

  return (
    <div className="space-y-4">
      {products.map((product) => (
        <Card key={product.id} className="p-4">
          <div className="space-y-2">
            {columnConfig.sortedColumns.map((column) => (
              <div
                key={column}
                className="flex justify-between items-center py-2 border-b last:border-0"
              >
                <span className="font-medium capitalize text-muted-foreground">
                  {column}
                </span>
                <span>{formatValue(column, product[column])}</span>
              </div>
            ))}
            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => actions.onRowClick(product)}
              >
                View
              </Button>
              <EditProductFormModal
                product={product}
                onEditProduct={actions.onEditProduct}
                trigger={
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => actions.onEditProduct(product.id, product)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                }
              />

              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDelete(product.id, product.name)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
