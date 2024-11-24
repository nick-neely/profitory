"use client";

import { Charts } from "@/components/Charts";
import { ProductForm } from "@/components/ProductForm";
import { ProductTable } from "@/components/ProductTable";
import { Statistics } from "@/components/Statistics";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useProducts } from "@/hooks/useProducts";
import { Separator } from "@/components/ui/separator";

export default function Home() {
  const {
    products,
    addProduct,
    removeProduct,
    editProduct,
    removeAllProducts,
  } = useProducts();

  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="space-y-4">
        <h2 className="text-lg font-medium">Add New Product</h2>
        <Separator />
        <ProductForm onAddProduct={addProduct} />
      </div>
      
      <div className="space-y-4">
        <h2 className="text-lg font-medium">Inventory</h2>
        <Separator />
        <Tabs defaultValue="table" className="max-w-[1200px] mx-auto">
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
