import { useEffect, useState } from "react";
import { ProductCondition } from "@/constants";

export interface Product {
  id: string;
  brand: string;
  name: string;
  price: number;
  quantity: number;
  condition: ProductCondition;
  category: string;
  cost: number;
  readonly profit: number;
}

// For editable fields
export type ProductInput = Omit<Product, "id" | "profit">;

const generateId = () => {
  return Math.random().toString(36).substring(2, 11);
};

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedProducts = localStorage.getItem("ebayProducts");
      const products = storedProducts ? JSON.parse(storedProducts) : [];
      setProducts(
        products.map((p: Product) => ({
          ...p,
          cost: p.cost ?? 0,
          profit: (p.price ?? 0) - (p.cost ?? 0),
        }))
      );
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined" && products.length > 0) {
      localStorage.setItem("ebayProducts", JSON.stringify(products));
    }
  }, [products]);

  const addProduct = (newProduct: ProductInput | ProductInput[]) => {
    setProducts((prevProducts) => [
      ...prevProducts,
      ...(Array.isArray(newProduct)
        ? newProduct.map((product) => ({
            ...product,
            id: generateId(),
            profit: product.price - product.cost,
            condition: product.condition as ProductCondition,
          }))
        : [
            {
              ...newProduct,
              id: generateId(),
              profit: newProduct.price - newProduct.cost,
              condition: newProduct.condition as ProductCondition,
            },
          ]),
    ]);
  };

  const removeProduct = (id: string) => {
    setProducts(products.filter((p) => p.id !== id));
  };

  const editProduct = (id: string, updatedProduct: ProductInput) => {
    setProducts(
      products.map((p) =>
        p.id === id
          ? {
              ...updatedProduct,
              id,
              profit: updatedProduct.price - updatedProduct.cost, // Calculate profit
            }
          : p
      )
    );
  };

  const removeAllProducts = () => {
    setProducts([]);
  };

  return {
    products,
    isLoading,
    addProduct,
    removeProduct,
    editProduct,
    removeAllProducts,
  };
}
