"use client";

import { Charts } from "@/components/Charts";
import { ProductForm } from "@/components/ProductForm";
import { ProductTable } from "@/components/ProductTable";
import { Statistics } from "@/components/Statistics";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useProducts } from "@/hooks/useProducts";

export default function Home() {
  const {
    products,
    isLoading,
    addProduct,
    removeProduct,
    editProduct,
    removeAllProducts,
  } = useProducts();

  return (
    <div className="container mx-auto py-4 md:py-6 space-y-6 md:space-y-8 px-4 md:px-0">
      <Accordion type="single" collapsible defaultValue="add-product">
        <AccordionItem value="add-product">
          <AccordionTrigger className="text-lg font-medium py-4 md:py-3">
            Add New Product
          </AccordionTrigger>
          <AccordionContent>
            <Separator className="my-2 md:my-4" />
            <div className="py-2 md:py-0">
              <ProductForm onAddProduct={addProduct} />
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div className="space-y-3 md:space-y-4" data-inventory-section>
        <h2 className="text-lg font-medium px-0 md:px-4">Inventory</h2>
        <Separator />
        <Tabs defaultValue="table">
          <TabsList className="md:w-auto w-full">
            <TabsTrigger
              value="table"
              className="md:px-4 md:py-2 flex-1 md:flex-none py-4 text-center"
            >
              Table
            </TabsTrigger>
            <TabsTrigger
              value="stats"
              className="md:px-4 md:py-2 flex-1 md:flex-none py-4 text-center"
            >
              Statistics
            </TabsTrigger>
            <TabsTrigger
              value="charts"
              className="md:px-4 md:py-2 flex-1 md:flex-none py-4 text-center"
            >
              Charts
            </TabsTrigger>
          </TabsList>
          <TabsContent value="table">
            <div className="p-2 md:p-4 overflow-x-auto">
              <ProductTable
                products={products}
                isLoading={isLoading}
                onRemoveProduct={removeProduct}
                onEditProduct={editProduct}
                onRemoveAllProducts={removeAllProducts}
              />
            </div>
          </TabsContent>
          <TabsContent value="stats">
            <div className="p-2 md:p-4">
              <Statistics products={products} />
            </div>
          </TabsContent>
          <TabsContent value="charts">
            <div className="p-2 md:p-4">
              <Charts products={products} />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
