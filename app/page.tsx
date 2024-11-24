"use client";

import { Charts } from "@/components/Charts";
import { ProductForm } from "@/components/ProductForm";
import { ProductTable } from "@/components/ProductTable";
import { Statistics } from "@/components/Statistics";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useProducts } from "@/hooks/useProducts";

export default function Home() {
  const { products, addProduct, removeProduct, editProduct } = useProducts();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">eBay Inventory Tracker</h1>
      <ProductForm onAddProduct={addProduct} />
      <Tabs defaultValue="table" className="mt-4 max-w-[1200px] mx-auto">
        <TabsList>
          <TabsTrigger value="table">Table</TabsTrigger>
          <TabsTrigger value="stats">Statistics</TabsTrigger>
          <TabsTrigger value="charts">Charts</TabsTrigger>
        </TabsList>
        <TabsContent value="table">
          <div className="p-4 overflow-x-auto">
            <ProductTable
              products={products}
              onRemoveProduct={removeProduct}
              onEditProduct={editProduct}
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
  );
}
