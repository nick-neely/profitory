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
import { Product, ProductInput } from "@/hooks/useProducts";
import { useProductTable } from "@/hooks/useProductTable";
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
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { DeleteAllConfirmationModal } from "./DeleteAllConfirmationModal";
import { DeleteConfirmationModal } from "./DeleteConfirmationModal";
import { EditProductForm } from "./EditProductForm";
import {
  NumberFilter,
  type NumberFilter as TNumberFilter,
} from "./NumberFilter";
import { PriceFilter } from "./PriceFilter";
import { ProductDetail } from "./ProductDetail";

// Define interface for column constraints
interface ColumnConstraints {
  [key: string]: { minWidth: number; maxWidth: number };
}

// Define min and max width constraints for each column
const columnConstraints: ColumnConstraints = {
  brand: { minWidth: 100, maxWidth: 300 },
  name: { minWidth: 150, maxWidth: 400 },
  price: { minWidth: 80, maxWidth: 150 },
  quantity: { minWidth: 80, maxWidth: 150 },
  condition: { minWidth: 100, maxWidth: 250 },
  category: { minWidth: 100, maxWidth: 250 },
  cost: { minWidth: 80, maxWidth: 150 },
  profit: { minWidth: 80, maxWidth: 150 },
};

interface ProductTableProps {
  products: Product[];
  isLoading: boolean;
  onRemoveProduct: (id: string) => void;
  onEditProduct: (id: string, product: ProductInput) => void;
  onRemoveAllProducts: () => void;
}

type PriceOperator = ">" | ">=" | "<" | "<=" | "=";
type PriceFilter = { operator: PriceOperator; value: number } | null;

const useColumnResize = (initialWidths: Record<string, number>) => {
  const [isResizing, setIsResizing] = useState(false);
  const widths = useRef(initialWidths);
  const resizingColumn = useRef<string | null>(null);
  const startX = useRef<number>(0);
  const startWidth = useRef<number>(0);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const handleMouseDown = useCallback(
    (column: string, width: number, e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      setIsResizing(true);
      resizingColumn.current = column;
      startX.current = e.clientX;
      startWidth.current = width;
    },
    []
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isResizing || !resizingColumn.current || !containerRef.current)
        return;

      const delta = e.clientX - startX.current;
      const column = resizingColumn.current;
      const startWidthValue = startWidth.current;
      const { minWidth, maxWidth } = columnConstraints[column];
      const newWidth = Math.max(
        minWidth,
        Math.min(startWidthValue + delta, maxWidth)
      );

      requestAnimationFrame(() => {
        document.documentElement.style.setProperty(
          `--column-width-${column}`,
          `${newWidth}px`
        );
      });
    },
    [isResizing]
  );

  const handleMouseUp = useCallback(() => {
    if (!isResizing || !resizingColumn.current) return;

    const finalWidth = parseInt(
      getComputedStyle(document.documentElement)
        .getPropertyValue(`--column-width-${resizingColumn.current}`)
        .slice(0, -2)
    );

    widths.current = {
      ...widths.current,
      [resizingColumn.current]: finalWidth,
    };

    setIsResizing(false);
    resizingColumn.current = null;
  }, [isResizing]);

  return {
    containerRef,
    isResizing,
    widths: widths.current,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
  };
};

export function ProductTable({
  products,
  isLoading,
  onRemoveProduct,
  onEditProduct,
  onRemoveAllProducts,
}: ProductTableProps) {
  const {
    filters,
    setFilters,
    sortConfig,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
    totalPages,
    paginatedProducts,
    sortedProducts,
    handleFilterChange,
    handleSort,
  } = useProductTable(products);

  const [showFilterInputs, setShowFilterInputs] = useState(false);
  const [isDeleteAllModalOpen, setIsDeleteAllModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [deleteProduct, setDeleteProduct] = useState<Product | null>(null);
  const [stickyHeader, setStickyHeader] = useState(true);

  const defaultColumns = useMemo<(keyof Product)[]>(
    () => [
      "brand",
      "name",
      "cost",
      "price",
      "profit",
      "quantity",
      "condition",
      "category",
    ],
    []
  );

  const [columns, setColumns] = useState<(keyof Product)[]>(defaultColumns);

  const toggleColumn = (column: keyof Product) => {
    setColumns((prev) =>
      prev.includes(column)
        ? prev.filter((col) => col !== column)
        : [...prev, column]
    );
  };

  const resetColumns = useCallback(() => {
    setColumns(defaultColumns);
  }, [defaultColumns]);

  const hiddenColumnsCount = defaultColumns.length - columns.length;

  const exportToCSV = () => {
    const headers = [
      "Brand",
      "Name",
      "Cost",
      "Price",
      "Profit",
      "Quantity",
      "Condition",
      "Category",
    ];
    const rows = sortedProducts.map((product) => [
      product.brand,
      product.name,
      formatCurrency(product.cost),
      formatCurrency(product.price),
      formatCurrency(product.profit),
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

  const exportColumn = useCallback(
    (column: keyof Product, format: "csv") => {
      const columnData = sortedProducts.map((product) => {
        const value = product[column];
        return column === "price" || column === "cost" || column === "profit"
          ? formatCurrency(value as number)
          : String(value);
      });

      if (format === "csv") {
        const csvContent = [column, ...columnData]
          .map((value) => `"${value}"`)
          .join(",");
        const blob = new Blob([csvContent], {
          type: "text/csv;charset=utf-8;",
        });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `${column}.csv`);
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    },
    [sortedProducts]
  );

  const copyColumnToClipboard = useCallback(
    async (column: keyof Product) => {
      const columnData = sortedProducts
        .map((product) => {
          const value = product[column];
          return column === "price" || column === "cost" || column === "profit"
            ? formatCurrency(value as number)
            : String(value);
        })
        .join(", ");

      try {
        await navigator.clipboard.writeText(columnData);
      } catch (err) {
        console.error("Failed to copy to clipboard:", err);
      }
    },
    [sortedProducts]
  );

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

  const columnWidthsInit = useMemo(
    () => ({
      brand: 150,
      name: 250,
      cost: 80,
      price: 80,
      profit: 80,
      quantity: 80,
      condition: 150,
      category: 150,
    }),
    []
  );

  const {
    containerRef,
    isResizing,
    widths,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
  } = useColumnResize(columnWidthsInit);

  // Add event listeners
  useEffect(() => {
    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isResizing, handleMouseMove, handleMouseUp]);

  // Add CSS variables for initial column widths with constraints
  useEffect(() => {
    Object.entries(columnWidthsInit).forEach(([column, width]) => {
      const { minWidth, maxWidth } = columnConstraints[column];
      const initialWidth = Math.max(minWidth, Math.min(width, maxWidth));
      document.documentElement.style.setProperty(
        `--column-width-${column}`,
        `${initialWidth}px`
      );
    });
  }, [columnWidthsInit]);

  const resetColumnWidths = useCallback(() => {
    Object.entries(columnWidthsInit).forEach(([column, width]) => {
      const { minWidth, maxWidth } = columnConstraints[column];
      const initialWidth = Math.max(minWidth, Math.min(width, maxWidth));
      document.documentElement.style.setProperty(
        `--column-width-${column}`,
        `${initialWidth}px`
      );
    });
  }, [columnWidthsInit]);

  const renderColumnHeader = useCallback(
    (column: keyof Product) => {
      const label = column.charAt(0).toUpperCase() + column.slice(1);
      const isPinnedLeft = pinnedColumns.left.includes(column);
      const isPinnedRight = pinnedColumns.right.includes(column);
      const isPinned = isPinnedLeft || isPinnedRight;

      return (
        <div className="relative flex items-center h-full">
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
                Sort{" "}
                {sortConfig.direction === "asc" ? "Descending" : "Ascending"}
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
                <ContextMenuSubTrigger>Export</ContextMenuSubTrigger>
                <ContextMenuSubContent>
                  <ContextMenuItem onClick={() => exportColumn(column, "csv")}>
                    Export Column to CSV
                  </ContextMenuItem>
                  <ContextMenuItem
                    onClick={() => copyColumnToClipboard(column)}
                  >
                    Copy Column to Clipboard
                  </ContextMenuItem>
                </ContextMenuSubContent>
              </ContextMenuSub>
              <ContextMenuSeparator />
              <ContextMenuSub>
                <ContextMenuSubTrigger>
                  Column Customization
                </ContextMenuSubTrigger>
                <ContextMenuSubContent>
                  <ContextMenuCheckboxItem
                    checked={stickyHeader}
                    onCheckedChange={setStickyHeader}
                  >
                    Sticky Header
                  </ContextMenuCheckboxItem>
                  <ContextMenuItem onClick={resetColumnWidths}>
                    Reset Column Widths
                  </ContextMenuItem>
                  <ContextMenuSeparator />
                  <ContextMenuItem onClick={() => toggleColumn(column)}>
                    {columns.includes(column) ? "Hide Column" : "Show Column"}
                  </ContextMenuItem>
                  <ContextMenuItem onClick={resetColumns}>
                    Reset All Columns
                  </ContextMenuItem>
                </ContextMenuSubContent>
              </ContextMenuSub>
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
          <div
            className="absolute -right-px top-0 h-full w-2 group cursor-col-resize select-none touch-none flex items-center justify-center"
            onMouseDown={(e) => handleMouseDown(column, widths[column], e)}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="h-4 w-px bg-border group-hover:bg-primary/60 group-active:bg-primary/90 transition-colors" />
          </div>
        </div>
      );
    },
    [
      handleMouseDown,
      widths,
      columns,
      copyColumnToClipboard,
      defaultColumns,
      exportColumn,
      filters,
      hiddenColumnsCount,
      pinnedColumns.left,
      pinnedColumns.right,
      resetColumns,
      resetColumnWidths,
      sortConfig.direction,
      sortConfig.key,
      stickyHeader,
    ]
  );

  const visibleColumns = columns;

  const sortedColumns = [
    ...pinnedColumns.left,
    ...visibleColumns.filter(
      (col) =>
        !pinnedColumns.left.includes(col) && !pinnedColumns.right.includes(col)
    ),
    ...pinnedColumns.right,
  ];

  const exportRowToCSV = useCallback(
    (product: Product) => {
      const headers = columns;
      const row = columns.map((column) => {
        const value = product[column];
        return column === "price" || column === "cost" || column === "profit"
          ? formatCurrency(value as number)
          : String(value);
      });

      const csvContent = [headers, row]
        .map((row) => row.map((item) => `"${item}"`).join(","))
        .join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `product-${product.id}.csv`);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
    [columns]
  );

  const copyRowToClipboard = useCallback(
    async (product: Product) => {
      const rowData = columns
        .map((column) => {
          const value = product[column];
          return column === "price" || column === "cost" || column === "profit"
            ? formatCurrency(value as number)
            : String(value);
        })
        .join(", ");

      try {
        await navigator.clipboard.writeText(rowData);
      } catch (err) {
        console.error("Failed to copy to clipboard:", err);
      }
    },
    [columns]
  );

  return (
    <div className="space-y-6 py-4">
      {/* Create a wrapper div with relative positioning and overflow */}
      <div className="relative" ref={containerRef}>
        {/* Controls bar - keep this outside the scrollable area */}
        <div className="flex justify-between items-center mb-4 bg-background">
          <div className="flex space-x-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={showFilterInputs ? "secondary" : "outline"}
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

        {/* Scrollable table container */}
        <div className="relative rounded-md border">
          {isLoading && (
            <div className="absolute inset-0 bg-background/50 backdrop-blur-sm flex items-center justify-center z-50">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          )}
          <div className="overflow-auto max-h-[calc(100vh-12rem)]">
            <Table className={cn(isResizing ? "select-none" : "", "relative")}>
              <TableHeader
                className={cn(
                  stickyHeader && "sticky top-0 z-10 bg-background",
                  "[&_tr]:bg-background",
                  // Make the border more visible
                  stickyHeader &&
                    "[&_tr:first-child]:border-b-2 [&_tr:first-child]:border-border"
                )}
              >
                <TableRow>
                  {sortedColumns.map((column) => (
                    <TableHead
                      key={column}
                      style={{
                        width: `var(--column-width-${column})`,
                        position: "relative",
                      }}
                      className={cn(
                        "transition-none", // Disable transitions during resize
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
                        <div data-filter={column}>
                          {renderFilterInput(column)}
                        </div>
                      </TableHead>
                    ))}
                    <TableHead></TableHead>
                  </TableRow>
                )}
              </TableHeader>
              <TableBody>
                {paginatedProducts.map((product) => (
                  <ContextMenu key={product.id}>
                    <ContextMenuTrigger asChild>
                      <TableRow
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
                            {column === "price" ||
                            column === "cost" ||
                            column === "profit"
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
                            <Button
                              variant="outline"
                              onClick={() => setDeleteProduct(product)}
                              className="text-red-600 hover:bg-red-100 hover:text-red-700 dark:hover:bg-red-900/30"
                            >
                              Remove
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    </ContextMenuTrigger>
                    <ContextMenuContent>
                      <ContextMenuItem
                        onClick={() => handleRowClick(product)()}
                      >
                        View Details
                      </ContextMenuItem>
                      <ContextMenuSeparator />
                      <ContextMenuItem onClick={() => exportRowToCSV(product)}>
                        Export Row to CSV
                      </ContextMenuItem>
                      <ContextMenuItem
                        onClick={() => copyRowToClipboard(product)}
                      >
                        Copy Row to Clipboard
                      </ContextMenuItem>
                      <ContextMenuSeparator />
                      <ContextMenuItem
                        className="text-red-600"
                        onClick={() => setDeleteProduct(product)}
                      >
                        Delete Row
                      </ContextMenuItem>
                    </ContextMenuContent>
                  </ContextMenu>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={5} className="font-medium">
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
                  <TableCell />
                  <TableCell />
                </TableRow>
                <TableRow className="bg-slate-50 dark:bg-slate-900">
                  <TableCell colSpan={9}>
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
                            setCurrentPage((prev) =>
                              Math.min(totalPages, prev + 1)
                            )
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
          </div>
        </div>

        {/* Modals - keep these outside the scrollable area */}
        <DeleteAllConfirmationModal
          isOpen={isDeleteAllModalOpen}
          onOpenChange={setIsDeleteAllModalOpen}
          onConfirm={onRemoveAllProducts}
        />
        <DeleteConfirmationModal
          isOpen={deleteProduct !== null}
          onOpenChange={(open) => !open && setDeleteProduct(null)}
          onConfirm={() => {
            if (deleteProduct) {
              onRemoveProduct(deleteProduct.id);
              setDeleteProduct(null);
            }
          }}
          productName={deleteProduct?.name ?? ""}
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
