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
    <div className="container mx-auto py-6 space-y-8 px-0">
      <Accordion type="single" collapsible defaultValue="add-product">
        <AccordionItem value="add-product">
          <AccordionTrigger className="text-lg font-medium">
            Add New Product
          </AccordionTrigger>
          <AccordionContent>
            <Separator className="my-4" />
            <ProductForm onAddProduct={addProduct} />
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div className="space-y-4" data-inventory-section>
        <h2 className="text-lg font-medium px-4">Inventory</h2>
        <Separator />
        <Tabs defaultValue="table">
          <TabsList>
            <TabsTrigger value="table">Table</TabsTrigger>
            <TabsTrigger value="stats">Statistics</TabsTrigger>
            <TabsTrigger value="charts">Charts</TabsTrigger>
          </TabsList>
          <TabsContent value="table">
            <div className="p-4 overflow-x-auto">
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
            <div className="p-4">
              <Statistics products={products} />
            </div>
          </TabsContent>
          <TabsContent value="charts">
            <div className="p-4">
              <Charts products={products} />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
