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
import { Product } from "@/hooks/useProducts";
import { useState } from "react";

interface EditProductFormProps {
  product: Product;
  onEditProduct: (id: string, product: Omit<Product, "id">) => void;
}

export function EditProductForm({
  product,
  onEditProduct,
}: EditProductFormProps) {
  const [editedProduct, setEditedProduct] =
    useState<Omit<Product, "id">>(product);
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onEditProduct(product.id, editedProduct);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Edit</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Product</DialogTitle>
          <DialogDescription>
            Make changes to your product here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="edit-brand">Brand</Label>
            <Input
              id="edit-brand"
              value={editedProduct.brand}
              onChange={(e) =>
                setEditedProduct({ ...editedProduct, brand: e.target.value })
              }
              required
            />
          </div>
          <div>
            <Label htmlFor="edit-name">Item Name</Label>
            <Input
              id="edit-name"
              value={editedProduct.name}
              onChange={(e) =>
                setEditedProduct({ ...editedProduct, name: e.target.value })
              }
              required
            />
          </div>
          <div>
            <Label htmlFor="edit-price">Selling Price</Label>
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
            />
          </div>
          <div>
            <Label htmlFor="edit-quantity">Quantity</Label>
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
            />
          </div>
          <div>
            <Label htmlFor="edit-condition">Condition</Label>
            <Select
              onValueChange={(value) =>
                setEditedProduct({ ...editedProduct, condition: value })
              }
              defaultValue={editedProduct.condition}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select condition" />
              </SelectTrigger>
              <SelectContent>
                {PRODUCT_CONDITIONS.map((condition) => (
                  <SelectItem key={condition} value={condition}>
                    {condition}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="edit-category">Category</Label>
            <Input
              id="edit-category"
              value={editedProduct.category}
              onChange={(e) =>
                setEditedProduct({ ...editedProduct, category: e.target.value })
              }
              required
            />
          </div>
          <Button type="submit">Save Changes</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
