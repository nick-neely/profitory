import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PRODUCT_CONDITIONS, type ProductCondition } from "@/constants";
import { Product, ProductInput } from "@/hooks/useProducts";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface EditProductFormModalProps {
  product: Product | null;
  onEditProduct: (id: string, product: ProductInput) => void;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditProductFormModal({
  product,
  onEditProduct,
  isOpen,
  onOpenChange,
}: EditProductFormModalProps) {
  const initialProduct = product || {
    brand: "",
    name: "",
    price: 0,
    quantity: 0,
    condition: PRODUCT_CONDITIONS[0],
    category: "",
    cost: 0,
    profit: 0,
  };

  const [editedProduct, setEditedProduct] =
    useState<Omit<Product, "id">>(initialProduct);

  // Reset form when product changes
  useEffect(() => {
    if (product) {
      setEditedProduct(product);
    }
  }, [product]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;

    try {
      onEditProduct(product.id, editedProduct);
      toast.success("Product updated successfully");
      onOpenChange(false);
    } catch (err: unknown) {
      const error = err as Error;
      toast.error(`Failed to update product: ${error.message}`);
    }
  };

  if (!product) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] p-0 h-[95vh] flex flex-col">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="text-2xl">Edit Product</DialogTitle>
          <DialogDescription className="text-base">
            Make changes to your product here. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col flex-1 overflow-hidden"
        >
          <div className="flex-1 overflow-y-auto p-6 pt-4 space-y-6">
            <div>
              <Label htmlFor="edit-brand" className="text-base">
                Brand
              </Label>
              <Input
                id="edit-brand"
                value={editedProduct.brand}
                onChange={(e) =>
                  setEditedProduct({ ...editedProduct, brand: e.target.value })
                }
                required
                className="h-12 md:h-10 text-base w-full active:scale-[0.98] transition-transform"
              />
            </div>
            <div>
              <Label htmlFor="edit-name" className="text-base">
                Item Name
              </Label>
              <Input
                id="edit-name"
                value={editedProduct.name}
                onChange={(e) =>
                  setEditedProduct({ ...editedProduct, name: e.target.value })
                }
                required
                className="h-12 md:h-10 text-base w-full active:scale-[0.98] transition-transform"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-4">
              <div>
                <Label htmlFor="edit-cost" className="text-base">
                  Purchase Cost
                </Label>
                <Input
                  id="edit-cost"
                  type="number"
                  value={editedProduct.cost}
                  onChange={(e) =>
                    setEditedProduct({
                      ...editedProduct,
                      cost: parseFloat(e.target.value),
                    })
                  }
                  required
                  min="0"
                  step="0.01"
                  className="h-12 md:h-10 text-base w-full active:scale-[0.98] transition-transform"
                />
              </div>
              <div>
                <Label htmlFor="edit-price" className="text-base">
                  Selling Price
                </Label>
                <Input
                  id="edit-price"
                  type="number"
                  value={editedProduct.price}
                  onChange={(e) =>
                    setEditedProduct({
                      ...editedProduct,
                      price: parseFloat(e.target.value),
                    })
                  }
                  required
                  min="0"
                  step="0.01"
                  className="h-12 md:h-10 text-base w-full active:scale-[0.98] transition-transform"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-4">
              <div>
                <Label htmlFor="edit-quantity" className="text-base">
                  Quantity
                </Label>
                <Input
                  id="edit-quantity"
                  type="number"
                  value={editedProduct.quantity}
                  onChange={(e) =>
                    setEditedProduct({
                      ...editedProduct,
                      quantity: parseInt(e.target.value),
                    })
                  }
                  required
                  min="1"
                  className="h-12 md:h-10 text-base w-full active:scale-[0.98] transition-transform"
                />
              </div>
              <div>
                <Label htmlFor="edit-condition" className="text-base">
                  Condition
                </Label>
                <Select
                  value={editedProduct.condition}
                  onValueChange={(value: ProductCondition) =>
                    setEditedProduct({ ...editedProduct, condition: value })
                  }
                >
                  <SelectTrigger className="h-12 md:h-10 text-base w-full active:scale-[0.98] transition-transform">
                    <SelectValue placeholder="Select condition" />
                  </SelectTrigger>
                  <SelectContent>
                    {PRODUCT_CONDITIONS.map((condition) => (
                      <SelectItem
                        key={condition}
                        value={condition}
                        className="text-base"
                      >
                        {condition}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="edit-category" className="text-base">
                Category
              </Label>
              <Input
                id="edit-category"
                value={editedProduct.category}
                onChange={(e) =>
                  setEditedProduct({
                    ...editedProduct,
                    category: e.target.value,
                  })
                }
                required
                className="h-12 md:h-10 text-base w-full active:scale-[0.98] transition-transform"
              />
            </div>
          </div>
          <div className="p-6 pt-2">
            <Button
              type="submit"
              className="w-full h-12 md:h-10 text-base active:scale-[0.98] transition-transform"
            >
              Save Changes
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
