import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Product } from "@/hooks/useProducts";
import { Upload } from "lucide-react";
import Papa from "papaparse";
import { useState } from "react";

interface ProductFormProps {
  onAddProduct: (product: Omit<Product, "id"> | Omit<Product, "id">[]) => void;
}

export function ProductForm({ onAddProduct }: ProductFormProps) {
  const [product, setProduct] = useState<Omit<Product, "id">>({
    brand: "",
    name: "",
    price: 0,
    quantity: 1,
    condition: "New",
    category: "",
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      interface CSVRow {
        Brand: string;
        Name: string;
        Price: string;
        Quantity: string;
        Condition: string;
        Category: string;
      }

      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results: Papa.ParseResult<CSVRow>) => {
          const products: Omit<Product, "id">[] = results.data.map(
            (row: CSVRow) => ({
              brand: row.Brand || "",
              name: row.Name || "",
              price: parseFloat(row.Price.replace(/[$,]/g, '')) || 0,
              quantity: parseInt(row.Quantity) || 1,
              condition: row.Condition || "New",
              category: row.Category || "",
            })
          );
          onAddProduct(products);
        },
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddProduct(product);
    setProduct({
      brand: "",
      name: "",
      price: 0,
      quantity: 1,
      condition: "New",
      category: "",
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 py-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="brand">Brand</Label>
          <Input
            id="brand"
            value={product.brand}
            onChange={(e) => setProduct({ ...product, brand: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="name">Item Name</Label>
          <Input
            id="name"
            value={product.name}
            onChange={(e) => setProduct({ ...product, name: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="price">Selling Price</Label>
          <Input
            id="price"
            type="number"
            value={product.price}
            onChange={(e) =>
              setProduct({ ...product, price: parseFloat(e.target.value) })
            }
            required
            min="0"
            step="0.01"
          />
        </div>
        <div>
          <Label htmlFor="quantity">Quantity</Label>
          <Input
            id="quantity"
            type="number"
            value={product.quantity}
            onChange={(e) =>
              setProduct({ ...product, quantity: parseInt(e.target.value) })
            }
            required
            min="1"
          />
        </div>
        <div>
          <Label htmlFor="condition">Condition</Label>
          <Select
            onValueChange={(value) =>
              setProduct({ ...product, condition: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select condition" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="New">New</SelectItem>
              <SelectItem value="Used - Like New">Used - Like New</SelectItem>
              <SelectItem value="Used - Good">Used - Good</SelectItem>
              <SelectItem value="Used - Acceptable">
                Used - Acceptable
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="category">Category</Label>
          <Input
            id="category"
            value={product.category}
            onChange={(e) =>
              setProduct({ ...product, category: e.target.value })
            }
            required
          />
        </div>
      </div>
      <div className="flex space-x-2">
        <Button type="submit">Add Product</Button>
        <Label htmlFor="csvFile" className="flex items-center cursor-pointer">
          <Upload className="mr-2 h-4 w-4" />
          Import CSV
        </Label>
        <Input
          id="csvFile"
          type="file"
          accept=".csv"
          onChange={handleFileUpload}
          className="hidden"
        />
      </div>
    </form>
  );
}
