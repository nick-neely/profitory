import { useState, useEffect } from 'react'

export interface Product {
  id: string
  brand: string
  name: string
  price: number
  quantity: number
  condition: string
  category: string
}

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    const storedProducts = localStorage.getItem('ebayProducts')
    if (storedProducts) {
      setProducts(JSON.parse(storedProducts))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('ebayProducts', JSON.stringify(products))
  }, [products])

  const addProduct = (product: Omit<Product, 'id'>) => {
    setProducts([...products, { ...product, id: Date.now().toString() }])
  }

  const removeProduct = (id: string) => {
    setProducts(products.filter(p => p.id !== id))
  }

  const editProduct = (id: string, updatedProduct: Omit<Product, 'id'>) => {
    setProducts(products.map(p => p.id === id ? { ...updatedProduct, id } : p))
  }

  return { products, addProduct, removeProduct, editProduct }
}

