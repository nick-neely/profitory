"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { PRODUCT_CONDITIONS } from "@/constants";
import { Product } from "@/hooks/useProducts";
import { cn, formatCurrency } from "@/lib/utils";
import {
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Download,
  Filter,
  Loader2,
  SortAsc,
  SortDesc,
  Trash,
} from "lucide-react";
import { useState } from "react";
import { DeleteAllConfirmationModal } from "./DeleteAllConfirmationModal";
import { DeleteConfirmationModal } from "./DeleteConfirmationModal";
import { EditProductForm } from "./EditProductForm";
import {
  NumberFilter,
  type NumberFilter as TNumberFilter,
} from "./NumberFilter";
import { PriceFilter } from "./PriceFilter";
import { ProductDetail } from "./ProductDetail";

interface ProductTableProps {
  products: Product[];
  isLoading: boolean;
  onRemoveProduct: (id: string) => void;
  onEditProduct: (id: string, product: Omit<Product, "id">) => void;
  onRemoveAllProducts: () => void;
}

type SortConfig = {
  key: keyof Product;
  direction: "asc" | "desc";
};

type PriceOperator = ">" | ">=" | "<" | "<=" | "=";
type PriceFilter = { operator: PriceOperator; value: number } | null;
type FilterValue = string | PriceFilter | TNumberFilter;

export function ProductTable({
  products,
  isLoading,
  onRemoveProduct,
  onEditProduct,
  onRemoveAllProducts,
}: ProductTableProps) {
  const [filters, setFilters] = useState<Record<string, FilterValue>>({});
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: "brand",
    direction: "asc",
  });
  const [showFilterInputs, setShowFilterInputs] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isDeleteAllModalOpen, setIsDeleteAllModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const defaultColumns: (keyof Product)[] = [
    "brand",
    "name",
    "price",
    "quantity",
    "condition",
    "category",
  ];

  const [columns, setColumns] = useState<(keyof Product)[]>(defaultColumns);

  const toggleColumn = (column: keyof Product) => {
    setColumns((prev) =>
      prev.includes(column)
        ? prev.filter((col) => col !== column)
        : [...prev, column]
    );
  };

  const resetColumns = () => {
    setColumns(defaultColumns);
  };

  const hiddenColumnsCount = defaultColumns.length - columns.length;

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
    Object.entries(filters).every(([key, filter]) => {
      if (!filter) return true;

      if (key === "price" || key === "quantity") {
        const numericFilter = filter as { operator: string; value: number };
        const value = product[key as keyof Product] as number;
        switch (numericFilter.operator) {
          case ">":
            return value > numericFilter.value;
          case ">=":
            return value >= numericFilter.value;
          case "<":
            return value < numericFilter.value;
          case "<=":
            return value <= numericFilter.value;
          case "=":
            return value === numericFilter.value;
          default:
            return true;
        }
      }

      return String(product[key as keyof Product])
        .toLowerCase()
        .includes(String(filter).toLowerCase());
    })
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
      formatCurrency(product.price),
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

  const renderFilterInput = (column: keyof Product) => {
    if (column === "condition") {
      return (
        <Select
          value={
            typeof filters[column] === "string"
              ? (filters[column] as string)
              : "all"
          }
          onValueChange={(value) =>
            handleFilterChange(column, value === "all" ? "" : value)
          }
        >
          <SelectTrigger className="max-w-sm">
            <SelectValue placeholder={`Filter ${column}`} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            {PRODUCT_CONDITIONS.map((condition) => (
              <SelectItem key={condition} value={condition}>
                {condition}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    }

    if (column === "price") {
      return (
        <PriceFilter
          value={
            filters[column] as { operator: PriceOperator; value: number } | null
          }
          onChange={(value) =>
            setFilters((prev) => ({ ...prev, [column]: value }))
          }
        />
      );
    }

    if (column === "quantity") {
      return (
        <NumberFilter
          value={filters[column] as TNumberFilter}
          onChange={(value) =>
            setFilters((prev) => ({ ...prev, [column]: value }))
          }
          placeholder="Filter quantity..."
          min={0}
          step={1}
        />
      );
    }

    return (
      <Input
        placeholder={`Filter ${column}`}
        value={(filters[column] as string) || ""}
        onChange={(e) => handleFilterChange(column, e.target.value)}
        className="max-w-sm"
      />
    );
  };

  const handleRowClick = (product: Product) => {
    return () => {
      setSelectedProduct(product);
      setIsDetailOpen(true);
    };
  };

  const [pinnedColumns, setPinnedColumns] = useState<{
    left: (keyof Product)[];
    right: (keyof Product)[];
  }>({
    left: [],
    right: [],
  });

  const pinColumn = (column: keyof Product, position: "left" | "right") => {
    setPinnedColumns((prev) => {
      const otherPosition = position === "left" ? "right" : "left";
      return {
        ...prev,
        [position]: [...prev[position], column],
        [otherPosition]: prev[otherPosition].filter((col) => col !== column),
      };
    });
  };

  const unpinColumn = (column: keyof Product) => {
    setPinnedColumns((prev) => ({
      left: prev.left.filter((col) => col !== column),
      right: prev.right.filter((col) => col !== column),
    }));
  };

  const renderColumnHeader = (column: keyof Product) => {
    const label = column.charAt(0).toUpperCase() + column.slice(1);
    const isPinnedLeft = pinnedColumns.left.includes(column);
    const isPinnedRight = pinnedColumns.right.includes(column);
    const isPinned = isPinnedLeft || isPinnedRight;

    return (
      <ContextMenu>
        <ContextMenuTrigger asChild>
          <Button
            variant="ghost"
            onClick={() => handleSort(column)}
            className={cn(
              "h-8 px-2 lg:px-3 w-full justify-start",
              isPinned && "bg-muted"
            )}
          >
            {label}
            {sortConfig.key === column ? (
              sortConfig.direction === "asc" ? (
                <SortAsc className="ml-2 h-4 w-4" />
              ) : (
                <SortDesc className="ml-2 h-4 w-4" />
              )
            ) : (
              <ArrowUpDown className="ml-2 h-4 w-4" />
            )}
          </Button>
        </ContextMenuTrigger>
        <ContextMenuContent className="w-64">
          <ContextMenuItem onClick={() => handleSort(column)}>
            Sort {sortConfig.direction === "asc" ? "Descending" : "Ascending"}
          </ContextMenuItem>
          <ContextMenuSeparator />
          {column === "price" && (
            <ContextMenuItem
              onClick={() => {
                setShowFilterInputs(true);
                const element = document.querySelector(
                  `[data-filter="${column}"]`
                );
                if (element instanceof HTMLElement) {
                  element.click();
                }
              }}
            >
              Filter by Price...
            </ContextMenuItem>
          )}
          {column === "quantity" && (
            <ContextMenuItem
              onClick={() => {
                setShowFilterInputs(true);
                const element = document.querySelector(
                  `[data-filter="${column}"]`
                );
                if (element instanceof HTMLElement) {
                  element.click();
                }
              }}
            >
              Filter by Quantity...
            </ContextMenuItem>
          )}
          {column === "condition" && (
            <ContextMenuItem
              onClick={() => {
                setShowFilterInputs(true);
              }}
            >
              Filter by Condition...
            </ContextMenuItem>
          )}
          {(column === "brand" ||
            column === "name" ||
            column === "category") && (
            <ContextMenuItem
              onClick={() => {
                setShowFilterInputs(true);
                setFilters((prev) => ({ ...prev, [column]: "" }));
              }}
            >
              Filter by Text...
            </ContextMenuItem>
          )}
          {filters[column] && (
            <>
              <ContextMenuSeparator />
              <ContextMenuItem
                onClick={() => {
                  setFilters((prev) => {
                    const newFilters = { ...prev };
                    delete newFilters[column];
                    return newFilters;
                  });
                }}
              >
                Clear Filter
              </ContextMenuItem>
            </>
          )}
          <ContextMenuSeparator />
          <ContextMenuSub>
            <ContextMenuSubTrigger>
              Column Pinning
              {isPinned && (
                <Badge variant="secondary" className="ml-2">
                  {isPinnedLeft ? "Left" : "Right"}
                </Badge>
              )}
            </ContextMenuSubTrigger>
            <ContextMenuSubContent>
              <ContextMenuItem onClick={() => pinColumn(column, "left")}>
                Pin to Left
              </ContextMenuItem>
              <ContextMenuItem onClick={() => pinColumn(column, "right")}>
                Pin to Right
              </ContextMenuItem>
              {isPinned && (
                <>
                  <ContextMenuSeparator />
                  <ContextMenuItem onClick={() => unpinColumn(column)}>
                    Unpin Column
                  </ContextMenuItem>
                </>
              )}
            </ContextMenuSubContent>
          </ContextMenuSub>
          <ContextMenuSub>
            <ContextMenuSubTrigger>
              Column Visibility
              {hiddenColumnsCount > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {hiddenColumnsCount}
                </Badge>
              )}
            </ContextMenuSubTrigger>
            <ContextMenuSubContent>
              {defaultColumns.map((col) => (
                <ContextMenuCheckboxItem
                  key={col}
                  checked={columns.includes(col)}
                  onCheckedChange={() => toggleColumn(col)}
                >
                  {col.charAt(0).toUpperCase() + col.slice(1)}
                </ContextMenuCheckboxItem>
              ))}
              <ContextMenuSeparator />
              <ContextMenuItem onClick={resetColumns}>
                Reset Columns
              </ContextMenuItem>
            </ContextMenuSubContent>
          </ContextMenuSub>
        </ContextMenuContent>
      </ContextMenu>
    );
  };

  const visibleColumns = columns;

  const sortedColumns = [
    ...pinnedColumns.left,
    ...visibleColumns.filter(
      (col) =>
        !pinnedColumns.left.includes(col) && !pinnedColumns.right.includes(col)
    ),
    ...pinnedColumns.right,
  ];

  return (
    <div className="space-y-6 py-4">
      <div className="relative">
        {isLoading && (
          <div className="absolute inset-0 bg-background/50 backdrop-blur-sm flex items-center justify-center z-50">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        )}
        <div className="flex justify-between items-center mb-4">
          <div className="flex space-x-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    onClick={() => {
                      if (showFilterInputs) {
                        setFilters({});
                      }
                      setShowFilterInputs(!showFilterInputs);
                    }}
                  >
                    <Filter className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{showFilterInputs ? "Hide Filters" : "Show Filters"}</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    onClick={exportToCSV}
                    disabled={sortedProducts.length === 0}
                  >
                    <Download
                      className={`h-4 w-4 ${
                        sortedProducts.length === 0
                          ? "text-muted-foreground"
                          : ""
                      }`}
                    />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Export to CSV</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    onClick={() => setIsDeleteAllModalOpen(true)}
                    disabled={sortedProducts.length === 0}
                    className="hover:bg-red-500 hover:text-white"
                  >
                    <Trash
                      className={`h-4 w-4 ${
                        sortedProducts.length === 0
                          ? "text-muted-foreground"
                          : ""
                      }`}
                    />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Delete All Products</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">
              Items per page:
            </span>
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
              {sortedColumns.map((column) => (
                <TableHead
                  key={column}
                  className={cn(
                    pinnedColumns.left.includes(column) &&
                      "sticky left-0 bg-background",
                    pinnedColumns.right.includes(column) &&
                      "sticky right-0 bg-background"
                  )}
                >
                  {renderColumnHeader(column)}
                </TableHead>
              ))}
              <TableHead className="sticky right-0 bg-background">
                Action
              </TableHead>
            </TableRow>
            {showFilterInputs && (
              <TableRow>
                {columns.map((column) => (
                  <TableHead key={`filter-${column}`}>
                    <div data-filter={column}>{renderFilterInput(column)}</div>
                  </TableHead>
                ))}
                <TableHead></TableHead>
              </TableRow>
            )}
          </TableHeader>
          <TableBody>
            {paginatedProducts.map((product) => (
              <TableRow
                key={product.id}
                className="cursor-pointer hover:bg-muted/50"
                onClick={handleRowClick(product)}
              >
                {sortedColumns.map((column) => (
                  <TableCell
                    key={`${product.id}-${column}`}
                    className={cn(
                      pinnedColumns.left.includes(column) &&
                        "sticky left-0 bg-background",
                      pinnedColumns.right.includes(column) &&
                        "sticky right-0 bg-background"
                    )}
                  >
                    {column === "price"
                      ? formatCurrency(product[column])
                      : product[column]}
                  </TableCell>
                ))}
                <TableCell
                  className="sticky right-0 bg-background"
                  onClick={(e) => e.stopPropagation()}
                >
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
                {formatCurrency(
                  sortedProducts.reduce(
                    (total, product) =>
                      total + product.price * product.quantity,
                    0
                  )
                )}
              </TableCell>
              <TableCell></TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={8}>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                    {Math.min(
                      currentPage * itemsPerPage,
                      sortedProducts.length
                    )}{" "}
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
        <ProductDetail
          product={selectedProduct}
          isOpen={isDetailOpen}
          onOpenChange={setIsDetailOpen}
        />
      </div>
    </div>
  );
}
