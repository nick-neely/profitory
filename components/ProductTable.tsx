"use client"

import { useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from "@/components/ui/table"
import { Product } from "@/hooks/useProducts";
import { EditProductForm } from './EditProductForm'
import { DeleteConfirmationModal } from './DeleteConfirmationModal'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ArrowUpDown, Filter, SortAsc, SortDesc } from 'lucide-react'

interface ProductTableProps {
  products: Product[]
  onRemoveProduct: (id: string) => void
  onEditProduct: (id: string, product: Omit<Product, 'id'>) => void
}

type SortConfig = {
  key: keyof Product
  direction: 'asc' | 'desc'
}

export function ProductTable({ products, onRemoveProduct, onEditProduct }: ProductTableProps) {
  const [filters, setFilters] = useState<Partial<Record<keyof Product, string>>>({})
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'brand', direction: 'asc' })
  const [showSortInputs, setShowSortInputs] = useState(false)
  const [showFilterInputs, setShowFilterInputs] = useState(false)

  const handleFilterChange = (key: keyof Product, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const handleSort = (key: keyof Product) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }))
  }

  const filteredProducts = products.filter(product => 
    Object.entries(filters).every(([key, value]) => 
      String(product[key as keyof Product]).toLowerCase().includes(value.toLowerCase())
    )
  )

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1
    if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1
    return 0
  })

  const renderSortButton = (key: keyof Product, label: string) => (
    <Button
      variant="ghost"
      onClick={() => handleSort(key)}
      className="h-8 px-2 lg:px-3"
    >
      {label}
      <ArrowUpDown className="ml-2 h-4 w-4" />
    </Button>
  )

  const columns: (keyof Product)[] = ['brand', 'name', 'price', 'quantity', 'condition', 'category']

  return (
    <div className="space-y-4">
      <div className="flex space-x-2 mb-4">
        <Button
          variant="outline"
          onClick={() => setShowSortInputs(!showSortInputs)}
          title={showSortInputs ? "Hide Sort" : "Show Sort"}
        >
          {showSortInputs ? <SortDesc className="h-4 w-4" /> : <SortAsc className="h-4 w-4" />}
        </Button>
        <Button
          variant="outline"
          onClick={() => setShowFilterInputs(!showFilterInputs)}
          title={showFilterInputs ? "Hide Filters" : "Show Filters"}
        >
          <Filter className="h-4 w-4" />
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map(column => (
              <TableHead key={column}>
                {showSortInputs ? renderSortButton(column, column.charAt(0).toUpperCase() + column.slice(1)) : column.charAt(0).toUpperCase() + column.slice(1)}
              </TableHead>
            ))}
            <TableHead>Value</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
          {showFilterInputs && (
            <TableRow>
              {columns.map(column => (
                <TableHead key={`filter-${column}`}>
                  <Input
                    placeholder={`Filter ${column}`}
                    value={filters[column] || ''}
                    onChange={(e) => handleFilterChange(column, e.target.value)}
                    className="max-w-sm"
                  />
                </TableHead>
              ))}
              <TableHead></TableHead>
              <TableHead></TableHead>
            </TableRow>
          )}
        </TableHeader>
        <TableBody>
          {sortedProducts.map((product) => (
            <TableRow key={product.id}>
              {columns.map(column => (
                <TableCell key={`${product.id}-${column}`}>
                  {column === 'price' ? `$${product[column].toFixed(2)}` : product[column]}
                </TableCell>
              ))}
              <TableCell>${(product.price * product.quantity).toFixed(2)}</TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <EditProductForm product={product} onEditProduct={onEditProduct} />
                  <DeleteConfirmationModal 
                    onConfirm={() => onRemoveProduct(product.id)} 
                    productName={product.name}
                  />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={5} className="font-medium">
              Totals
            </TableCell>
            <TableCell className="font-medium">
              {sortedProducts.reduce((total, product) => total + product.quantity, 0)} items
            </TableCell>
            <TableCell className="font-medium">
              ${sortedProducts.reduce((total, product) => total + product.price * product.quantity, 0).toFixed(2)}
            </TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  )
}

