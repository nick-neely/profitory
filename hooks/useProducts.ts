import { useEffect, useState } from "react";

export interface Product {
  id: string;
  brand: string;
  name: string;
  price: number;
  quantity: number;
  condition: string;
  category: string;
}

const generateId = () => {
  return Math.random().toString(36).substring(2, 11);
};

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedProducts = localStorage.getItem("ebayProducts");
      setProducts(storedProducts ? JSON.parse(storedProducts) : []);
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined" && products.length > 0) {
      localStorage.setItem("ebayProducts", JSON.stringify(products));
    }
  }, [products]);

  const addProduct = (
    newProduct: Omit<Product, "id"> | Omit<Product, "id">[]
  ) => {
    setProducts((prevProducts) => [
      ...prevProducts,
      ...(Array.isArray(newProduct)
        ? newProduct.map((product) => ({ ...product, id: generateId() }))
        : [{ ...newProduct, id: generateId() }]),
    ]);
  };

  const removeProduct = (id: string) => {
    setProducts(products.filter((p) => p.id !== id));
  };

  const editProduct = (id: string, updatedProduct: Omit<Product, "id">) => {
    setProducts(
      products.map((p) => (p.id === id ? { ...updatedProduct, id } : p))
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
