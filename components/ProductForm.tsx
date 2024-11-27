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
import { ProductInput } from "@/hooks/useProducts";
import { productSchema, type ProductFormValues } from "@/lib/schemas/product";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { debounce } from "lodash";
import { Loader2 } from "lucide-react";
import Papa from "papaparse";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const VALID_HEADERS = [
  "Brand",
  "Name",
  "Price",
  "Quantity",
  "Condition",
  "Category",
  "Cost",
] as const;

interface CSVRow {
  Brand: string;
  Name: string;
  Price: string;
  Quantity: string;
  Condition: string;
  Category: string;
  Cost: string;
}

interface ProductFormProps {
  onAddProduct: (product: ProductInput | ProductInput[]) => void;
}

export function ProductForm({ onAddProduct }: ProductFormProps) {
  const [isImporting, setIsImporting] = useState(false);
  const [shouldFloat, setShouldFloat] = useState(true);
  const formRef = useRef<HTMLFormElement>(null);
  const lastScrollY = useRef(0);

  useEffect(() => {
    // Debounced setter to avoid rapid state changes
    const debouncedSetFloat = debounce((isIntersecting: boolean) => {
      // Only update if we've scrolled more than 30px since last change
      const currentScrollY = window.scrollY;
      if (Math.abs(currentScrollY - lastScrollY.current) > 30) {
        setShouldFloat(!isIntersecting);
        lastScrollY.current = currentScrollY;
      }
    }, 150); // 150ms debounce

    const observer = new IntersectionObserver(
      ([entry]) => {
        debouncedSetFloat(entry.isIntersecting);
      },
      {
        threshold: [0, 0.1, 0.2], // Multiple thresholds for smoother transition
        rootMargin: "150px 0px 0px 0px", // Larger top margin to trigger earlier
      }
    );

    const inventorySection = document.querySelector("[data-inventory-section]");
    if (inventorySection) {
      observer.observe(inventorySection);
    }

    return () => {
      observer.disconnect();
      debouncedSetFloat.cancel();
    };
  }, []);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      brand: "",
      name: "",
      price: 0,
      quantity: 1,
      condition: "New",
      category: "",
      cost: 0,
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

              const products: ProductInput[] = results.data.map(
                (row: CSVRow) => ({
                  brand: row.Brand || "",
                  name: row.Name || "",
                  price: parseFloat(row.Price.replace(/[$,]/g, "")) || 0,
                  quantity: parseInt(row.Quantity) || 1,
                  condition: row.Condition || "New",
                  category: row.Category || "",
                  cost: parseFloat(row.Cost?.replace(/[$,]/g, "") || "0") || 0, // Add cost with fallback
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
      <form
        ref={formRef}
        onSubmit={form.handleSubmit(onSubmit)}
        className="relative space-y-8 py-4"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-4">
          <FormField
            control={form.control}
            name="brand"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base">Brand</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    className="h-12 md:h-10 text-base active:scale-[0.98] transition-transform"
                  />
                </FormControl>
                <FormMessage className="text-base" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base">Item Name</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    className="h-12 md:h-10 text-base active:scale-[0.98] transition-transform"
                  />
                </FormControl>
                <FormMessage className="text-base" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="cost"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base">Purchase Cost</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    {...field}
                    className="h-12 md:h-10 text-base active:scale-[0.98] transition-transform"
                  />
                </FormControl>
                <FormMessage className="text-base" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base">Selling Price</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    {...field}
                    className="h-12 md:h-10 text-base active:scale-[0.98] transition-transform"
                  />
                </FormControl>
                <FormMessage className="text-base" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="quantity"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base">Quantity</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="1"
                    {...field}
                    className="h-12 md:h-10 text-base active:scale-[0.98] transition-transform"
                  />
                </FormControl>
                <FormMessage className="text-base" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="condition"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base">Condition</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="h-12 md:h-10 text-base active:scale-[0.98] transition-transform">
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
                <FormMessage className="text-base" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base">Category</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    className="h-12 md:h-10 text-base active:scale-[0.98] transition-transform"
                  />
                </FormControl>
                <FormMessage className="text-base" />
              </FormItem>
            )}
          />
        </div>

        <div
          className={cn(
            "p-4 bg-background md:p-0 transition-all duration-300 ease-in-out",
            shouldFloat
              ? "fixed bottom-0 left-0 right-0 border-t border-border shadow-lg md:relative md:border-0 md:shadow-none translate-y-0"
              : "relative translate-y-4"
          )}
        >
          <div className="flex flex-col space-y-3 md:flex-row md:space-y-0 md:space-x-2 max-w-screen-xl mx-auto">
            <Button
              type="submit"
              className="h-12 md:h-10 text-base active:scale-[0.98] transition-transform"
            >
              Add Product
            </Button>
            <Dropzone
              onDrop={handleFileUpload}
              accept={{ "text/csv": [".csv"] }}
              disabled={isImporting}
              buttonText="Import CSV"
              buttonVariant="outline"
              className="h-12 md:h-10 text-base active:scale-[0.98] transition-transform w-full md:w-auto"
              buttonClassName="w-full md:w-auto"
              dropzoneClassName="w-full md:w-64"
              buttonContent={
                isImporting ? (
                  <div className="flex items-center justify-center">
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    <span>Importing...</span>
                  </div>
                ) : undefined
              }
            />
          </div>
        </div>
      </form>
    </Form>
  );
}
