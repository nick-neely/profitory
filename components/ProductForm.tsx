import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PRODUCT_CONDITIONS } from "@/constants";
import { Product } from "@/hooks/useProducts";
import { productSchema, type ProductFormValues } from "@/lib/schemas/product";
import { zodResolver } from "@hookform/resolvers/zod";
import { Upload } from "lucide-react";
import Papa from "papaparse";
import { useForm } from "react-hook-form";
import { Label } from "./ui/label";

interface ProductFormProps {
  onAddProduct: (product: Omit<Product, "id"> | Omit<Product, "id">[]) => void;
}

export function ProductForm({ onAddProduct }: ProductFormProps) {
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      brand: "",
      name: "",
      price: 0,
      quantity: 1,
      condition: "New",
      category: "",
    },
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
              price: parseFloat(row.Price.replace(/[$,]/g, "")) || 0,
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

  const onSubmit = (data: ProductFormValues) => {
    onAddProduct(data);
    form.reset();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="brand"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Brand</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Item Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Selling Price</FormLabel>
                <FormControl>
                  <Input type="number" min="0" step="0.01" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="quantity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Quantity</FormLabel>
                <FormControl>
                  <Input type="number" min="1" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="condition"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Condition</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {PRODUCT_CONDITIONS.map((condition) => (
                      <SelectItem key={condition} value={condition}>
                        {condition}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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
    </Form>
  );
}
