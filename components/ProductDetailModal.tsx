import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Product } from "@/hooks/useProducts";
import { formatCurrency } from "@/lib/utils";
import { Badge } from "./ui/badge";

interface ProductDetailProps {
  product: Product | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProductDetailModal({
  product,
  isOpen,
  onOpenChange,
}: ProductDetailProps) {
  if (!product) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Product Details</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">
                Brand
              </h3>
              <p className="text-lg">{product.brand}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">
                Name
              </h3>
              <p className="text-lg">{product.name}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">
                Category
              </h3>
              <p className="text-lg">{product.category}</p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">
                Price
              </h3>
              <p className="text-lg font-medium text-green-600">
                {formatCurrency(product.price)}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">
                Quantity
              </h3>
              <p className="text-lg">{product.quantity} units</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">
                Condition
              </h3>
              <Badge variant="secondary" className="mt-1">
                {product.condition}
              </Badge>
            </div>
          </div>
          <div className="col-span-2">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">
              Total Value
            </h3>
            <p className="text-xl font-bold text-green-600">
              {formatCurrency(product.price * product.quantity)}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
