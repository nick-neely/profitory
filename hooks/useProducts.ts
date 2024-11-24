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
  const [products, setProducts] = useState<Product[]>(() => {
    const storedProducts = localStorage.getItem('ebayProducts')
    return storedProducts ? JSON.parse(storedProducts) : []
  })

  useEffect(() => {
    if (products.length > 0) {
      localStorage.setItem('ebayProducts', JSON.stringify(products))
    }
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

