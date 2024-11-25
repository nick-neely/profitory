import { Dropzone } from "@/components/Dropzone";
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
import { Loader2, Upload } from "lucide-react";
import Papa from "papaparse";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Label } from "./ui/label";

const VALID_HEADERS = [
  "Brand",
  "Name",
  "Price",
  "Quantity",
  "Condition",
  "Category",
] as const;

interface CSVRow {
  Brand: string;
  Name: string;
  Price: string;
  Quantity: string;
  Condition: string;
  Category: string;
}

interface ProductFormProps {
  onAddProduct: (product: Omit<Product, "id"> | Omit<Product, "id">[]) => void;
}

export function ProductForm({ onAddProduct }: ProductFormProps) {
  const [isImporting, setIsImporting] = useState(false);
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

  const validateHeaders = (headers: string[]): string[] | null => {
    const normalizedHeaders = headers.map(
      (header) => header.replace(/['"]/g, "").trim() // Remove quotes and trim whitespace
    );

    const missingHeaders = VALID_HEADERS.filter(
      (validHeader) =>
        !normalizedHeaders.some(
          (header) => header.toLowerCase() === validHeader.toLowerCase()
        )
    );

    return missingHeaders.length ? missingHeaders : null;
  };

  const handleFileUpload = async (files: File[]) => {
    const file = files[0];
    if (!file) return;

    setIsImporting(true);

    try {
      const reader = new FileReader();

      reader.onload = () => {
        Papa.parse<CSVRow>(reader.result?.toString() || "", {
          header: true,
          skipEmptyLines: true,
          beforeFirstChunk: (chunk) => {
            const firstLine = chunk.split("\n")[0];
            const normalizedHeaders = firstLine
              .split(",")
              .map((header) => header.replace(/['"]/g, "").trim());
            return [
              normalizedHeaders.join(","),
              ...chunk.split("\n").slice(1),
            ].join("\n");
          },
          complete: (results: Papa.ParseResult<CSVRow>) => {
            try {
              const missingHeaders = validateHeaders(results.meta.fields || []);
              if (missingHeaders) {
                throw new Error(
                  `Missing required columns: ${missingHeaders.join(", ")}`
                );
              }

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
              toast.success("CSV Import Successful", {
                description: `Added ${products.length} products to inventory`,
              });
            } catch (error) {
              toast.error("Failed to import CSV", {
                description:
                  error instanceof Error
                    ? error.message
                    : "Unknown error occurred",
              });
            } finally {
              setIsImporting(false);
            }
          },
          error: (error: Error) => {
            toast.error("Failed to parse CSV", {
              description: error.message,
            });
            setIsImporting(false);
          },
        });
      };

      reader.readAsText(file);
    } catch (error) {
      setIsImporting(false);
      toast.error("Failed to read file", {
        description:
          error instanceof Error ? error.message : "Unknown error occurred",
      });
    }
  };

  const onSubmit = (data: ProductFormValues) => {
    try {
      onAddProduct(data);
      toast.success("Product added successfully", {
        description: `Added ${data.name} to inventory`,
      });
      form.reset();
    } catch (error) {
      toast.error("Failed to add product", {
        description:
          error instanceof Error ? error.message : "Unknown error occurred",
      });
    }
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
          <Dropzone
            onDrop={handleFileUpload}
            accept={{ "text/csv": [".csv"] }}
            disabled={isImporting}
            buttonText="Import CSV"
            buttonVariant="outline"
            buttonContent={
              isImporting ? (
                <div className="flex items-center">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  <span>Importing...</span>
                </div>
              ) : undefined
            }
          />
        </div>
      </form>
    </Form>
  );
}
