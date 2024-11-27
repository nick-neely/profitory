import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { PRODUCT_CONDITIONS } from "@/constants";
import { Product, ProductInput } from "@/hooks/useProducts";
import { useState } from "react";
import { toast } from "sonner";

interface EditProductFormModalProps {
  product: Product;
  onEditProduct: (id: string, product: ProductInput) => void;
  trigger?: React.ReactNode;
}

export function EditProductFormModal({
  product,
  onEditProduct,
  trigger,
}: EditProductFormModalProps) {
  const [editedProduct, setEditedProduct] =
    useState<Omit<Product, "id">>(product);
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      onEditProduct(product.id, editedProduct);
      toast.success("Product updated successfully");
      setIsOpen(false);
    } catch (err: unknown) {
      const error = err as Error;
      toast.error(`Failed to update product: ${error.message}`);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || <Button variant="outline">Edit</Button>}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] p-6">
        <DialogHeader className="space-y-2">
          <DialogTitle className="text-2xl">Edit Product</DialogTitle>
          <DialogDescription className="text-base">
            Make changes to your product here. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
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
                onValueChange={(value) =>
                  setEditedProduct({ ...editedProduct, condition: value })
                }
                defaultValue={editedProduct.condition}
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
                setEditedProduct({ ...editedProduct, category: e.target.value })
              }
              required
              className="h-12 md:h-10 text-base w-full active:scale-[0.98] transition-transform"
            />
          </div>
          <Button
            type="submit"
            className="w-full h-12 md:h-10 text-base active:scale-[0.98] transition-transform"
          >
            Save Changes
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
