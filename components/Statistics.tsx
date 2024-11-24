import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Product } from "@/hooks/useProducts"

interface StatisticsProps {
  products: Product[]
}

export function Statistics({ products }: StatisticsProps) {
  const totalItems = products.reduce((sum, product) => sum + product.quantity, 0)
  const totalValue = products.reduce((sum, product) => sum + product.price * product.quantity, 0)
  const averagePrice = totalItems > 0 ? totalValue / totalItems : 0
  const uniqueCategories = new Set(products.map(p => p.category)).size

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Items</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalItems}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Value</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${totalValue.toFixed(2)}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Average Price</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${averagePrice.toFixed(2)}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Unique Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{uniqueCategories}</div>
        </CardContent>
      </Card>
    </div>
  )
}

