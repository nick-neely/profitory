"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Product } from "@/hooks/useProducts";
import {
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Download,
  Filter,
  SortAsc,
  SortDesc,
  Trash,
} from "lucide-react";
import { useState } from "react";
import { DeleteAllConfirmationModal } from "./DeleteAllConfirmationModal";
import { DeleteConfirmationModal } from "./DeleteConfirmationModal";
import { EditProductForm } from "./EditProductForm";

interface ProductTableProps {
  products: Product[];
  onRemoveProduct: (id: string) => void;
  onEditProduct: (id: string, product: Omit<Product, "id">) => void;
  onRemoveAllProducts: () => void;
}

type SortConfig = {
  key: keyof Product;
  direction: "asc" | "desc";
};

export function ProductTable({
  products,
  onRemoveProduct,
  onEditProduct,
  onRemoveAllProducts,
}: ProductTableProps) {
  const [filters, setFilters] = useState<
    Partial<Record<keyof Product, string>>
  >({});
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: "brand",
    direction: "asc",
  });
  const [showFilterInputs, setShowFilterInputs] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isDeleteAllModalOpen, setIsDeleteAllModalOpen] = useState(false);

  const handleFilterChange = (key: keyof Product, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleSort = (key: keyof Product) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const filteredProducts = products.filter((product) =>
    Object.entries(filters).every(([key, value]) =>
      String(product[key as keyof Product])
        .toLowerCase()
        .includes(value.toLowerCase())
    )
  );

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key])
      return sortConfig.direction === "asc" ? -1 : 1;
    if (a[sortConfig.key] > b[sortConfig.key])
      return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);
  const paginatedProducts = sortedProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const exportToCSV = () => {
    const headers = [
      "Brand",
      "Name",
      "Price",
      "Quantity",
      "Condition",
      "Category",
    ];
    const rows = sortedProducts.map((product) => [
      product.brand,
      product.name,
      `$${product.price.toFixed(2)}`,
      product.quantity,
      product.condition,
      product.category,
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.map((item) => `"${item}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "products.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const renderSortButton = (key: keyof Product, label: string) => (
    <Button
      variant="ghost"
      onClick={() => handleSort(key)}
      className="h-8 px-2 lg:px-3"
    >
      {label}
      {sortConfig.key === key ? (
        sortConfig.direction === "asc" ? (
          <SortAsc className="ml-2 h-4 w-4" />
        ) : (
          <SortDesc className="ml-2 h-4 w-4" />
        )
      ) : (
        <ArrowUpDown className="ml-2 h-4 w-4" />
      )}
    </Button>
  );

  const columns: (keyof Product)[] = [
    "brand",
    "name",
    "price",
    "quantity",
    "condition",
    "category",
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={() => setShowFilterInputs(!showFilterInputs)}
            title={showFilterInputs ? "Hide Filters" : "Show Filters"}
          >
            <Filter className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            onClick={exportToCSV}
            title="Export to CSV"
            disabled={sortedProducts.length === 0}
          >
            <Download
              className={`h-4 w-4 ${
                sortedProducts.length === 0 ? "text-muted-foreground" : ""
              }`}
            />
          </Button>
          <Button
            variant="outline"
            onClick={() => setIsDeleteAllModalOpen(true)}
            title="Delete All Products"
            disabled={sortedProducts.length === 0}
          >
            <Trash
              className={`h-4 w-4 ${
                sortedProducts.length === 0 ? "text-muted-foreground" : ""
              }`}
            />
          </Button>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">Items per page:</span>
          <Select
            value={String(itemsPerPage)}
            onValueChange={(value) => {
              setItemsPerPage(Number(value));
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-[100px]">
              <SelectValue>{itemsPerPage}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              {[5, 10, 20, 50, 100].map((value) => (
                <SelectItem key={value} value={String(value)}>
                  {value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead key={column}>
                {renderSortButton(
                  column,
                  column.charAt(0).toUpperCase() + column.slice(1)
                )}
              </TableHead>
            ))}
            <TableHead>Action</TableHead>
          </TableRow>
          {showFilterInputs && (
            <TableRow>
              {columns.map((column) => (
                <TableHead key={`filter-${column}`}>
                  <Input
                    placeholder={`Filter ${column}`}
                    value={filters[column] || ""}
                    onChange={(e) => handleFilterChange(column, e.target.value)}
                    className="max-w-sm"
                  />
                </TableHead>
              ))}
              <TableHead></TableHead>
            </TableRow>
          )}
        </TableHeader>
        <TableBody>
          {paginatedProducts.map((product) => (
            <TableRow key={product.id}>
              {columns.map((column) => (
                <TableCell key={`${product.id}-${column}`}>
                  {column === "price"
                    ? `$${product[column].toFixed(2)}`
                    : product[column]}
                </TableCell>
              ))}
              <TableCell>
                <div className="flex space-x-2">
                  <EditProductForm
                    product={product}
                    onEditProduct={onEditProduct}
                  />
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
            <TableCell colSpan={4} className="font-medium">
              Totals
            </TableCell>
            <TableCell className="font-medium">
              {sortedProducts.reduce(
                (total, product) => total + product.quantity,
                0
              )}{" "}
              items
            </TableCell>
            <TableCell className="font-medium">
              $
              {sortedProducts
                .reduce(
                  (total, product) => total + product.price * product.quantity,
                  0
                )
                .toFixed(2)}
            </TableCell>
            <TableCell></TableCell>
          </TableRow>
          <TableRow>
            <TableCell colSpan={8}>
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                  {Math.min(currentPage * itemsPerPage, sortedProducts.length)}{" "}
                  of {sortedProducts.length} items
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(1, prev - 1))
                    }
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <div className="text-sm">
                    Page {currentPage} of {totalPages}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                    }
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
      <DeleteAllConfirmationModal
        isOpen={isDeleteAllModalOpen}
        onOpenChange={setIsDeleteAllModalOpen}
        onConfirm={onRemoveAllProducts}
      />
    </div>
  );
}
