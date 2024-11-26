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
import { Table } from "@/components/ui/table";
import { columnConstraints, PRODUCT_CONDITIONS } from "@/constants";
import { useColumnManagement } from "@/hooks/useColumnManagement";
import { useColumnResize } from "@/hooks/useColumnResize";
import { Product, ProductInput } from "@/hooks/useProducts";
import { useProductTable } from "@/hooks/useProductTable";
import { cn } from "@/lib/utils";
import { copyToClipboard } from "@/utils/copy";
import { exportToCSV } from "@/utils/export";
import { ArrowUpDown, Loader2, SortAsc, SortDesc } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { ControlsBar } from "./ControlsBar";
import { DeleteAllConfirmationModal } from "./DeleteAllConfirmationModal";
import { DeleteConfirmationModal } from "./DeleteConfirmationModal";
import {
  NumberFilter,
  type NumberFilter as TNumberFilter,
} from "./NumberFilter";
import { PaginationControls } from "./PaginationControls";
import { PriceFilter } from "./PriceFilter";
import { ProductDetailModal } from "./ProductDetailModal";
import { ProductTableBody } from "./ProductTableBody";
import { ProductTableFooter } from "./ProductTableFooter";
import { ProductTableHeader } from "./ProductTableHeader";

interface ProductTableProps {
  products: Product[];
  isLoading: boolean;
  onRemoveProduct: (id: string) => void;
  onEditProduct: (id: string, product: ProductInput) => void;
  onRemoveAllProducts: () => void;
}

type PriceOperator = ">" | ">=" | "<" | "<=" | "=";
type PriceFilter = { operator: PriceOperator; value: number } | null;

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
  const [stickyFooter, setStickyFooter] = useState(false);
  const [visibleTotals, setVisibleTotals] = useState<(keyof Product)[]>([
    "quantity",
    "price",
    "cost",
    "profit",
  ]);

  const {
    columns,
    toggleColumn,
    resetColumns,
    hiddenColumnsCount,
    pinnedColumns,
    pinColumn,
    unpinColumn,
    sortedColumns,
    defaultColumns,
  } = useColumnManagement();

  const handleExportToCSV = () => {
    exportToCSV(sortedProducts, {
      filename: "products.csv",
      fields: columns,
    });
  };

  const handleExportColumn = useCallback(
    (column: keyof Product) => {
      exportToCSV(sortedProducts, {
        filename: `${column}.csv`,
        fields: [column],
      });
    },
    [sortedProducts]
  );

  const handleCopyColumnToClipboard = useCallback(
    async (column: keyof Product) => {
      try {
        await copyToClipboard(sortedProducts, {
          fields: [column],
        });
      } catch (err) {
        toast.error("Failed to copy column to clipboard", {
          description:
            err instanceof Error ? err.message : "Unknown error occurred",
        });
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

  const handleRowClick = useCallback((product: Product) => {
    setSelectedProduct(product);
    setIsDetailOpen(true);
  }, []);

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
    resetColumnWidths,
  } = useColumnResize({
    initialWidths: columnWidthsInit,
    columnConstraints,
  });

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

  // CSS variables for initial column widths with constraints
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
                  <ContextMenuItem onClick={() => handleExportColumn(column)}>
                    Export Column to CSV
                  </ContextMenuItem>
                  <ContextMenuItem
                    onClick={() => handleCopyColumnToClipboard(column)}
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
      pinnedColumns.left,
      pinnedColumns.right,
      sortConfig.key,
      sortConfig.direction,
      filters,
      stickyHeader,
      resetColumnWidths,
      columns,
      resetColumns,
      hiddenColumnsCount,
      defaultColumns,
      handleSort,
      setFilters,
      handleExportColumn,
      handleCopyColumnToClipboard,
      toggleColumn,
      pinColumn,
      unpinColumn,
      handleMouseDown,
      widths,
    ]
  );

  return (
    <div className="space-y-6 py-4">
      <div className="relative" ref={containerRef}>
        <ControlsBar
          showFilterInputs={showFilterInputs}
          setShowFilterInputs={setShowFilterInputs}
          setFilters={setFilters}
          handleExportToCSV={handleExportToCSV}
          setIsDeleteAllModalOpen={setIsDeleteAllModalOpen}
          isExportDisabled={sortedProducts.length === 0}
        />

        <div className="relative rounded-md border">
          {isLoading && (
            <div className="absolute inset-0 bg-background/50 backdrop-blur-sm flex items-center justify-center z-50">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          )}
          <div className="overflow-auto max-h-[calc(100vh-12rem)]">
            <Table className={cn(isResizing ? "select-none" : "", "relative")}>
              <ProductTableHeader
                sortedColumns={sortedColumns}
                renderColumnHeader={renderColumnHeader}
                showFilterInputs={showFilterInputs}
                columns={columns}
                renderFilterInput={renderFilterInput}
                pinnedColumns={pinnedColumns}
                stickyHeader={stickyHeader}
                handleMouseDown={handleMouseDown}
                widths={widths}
                filters={filters}
                handleSort={handleSort}
                setFilters={setFilters}
                resetColumnWidths={resetColumnWidths}
                resetColumns={resetColumns}
                toggleColumn={toggleColumn}
                hiddenColumnsCount={hiddenColumnsCount}
                defaultColumns={defaultColumns}
                stickyFooter={stickyFooter}
                setStickyFooter={setStickyFooter}
                setShowFilterInputs={setShowFilterInputs}
              />

              <ProductTableBody
                paginatedProducts={paginatedProducts}
                columnConfig={{
                  pinnedColumns,
                  visibleColumns: columns,
                  sortedColumns,
                }}
                actions={{
                  onEditProduct,
                  onRemoveProduct: (id) =>
                    setDeleteProduct(products.find((p) => p.id === id) || null),
                  onRowClick: handleRowClick,
                }}
              />

              <ProductTableFooter
                paginatedProducts={paginatedProducts}
                sortedColumns={sortedColumns}
                visibleTotals={visibleTotals}
                setVisibleTotals={setVisibleTotals}
                stickyFooter={stickyFooter}
                setStickyFooter={setStickyFooter}
              />
            </Table>
          </div>
        </div>

        <div className="border-t bg-slate-50 dark:bg-slate-900">
          <div className="px-4 py-3">
            <PaginationControls
              currentPage={currentPage}
              totalPages={totalPages}
              itemsPerPage={itemsPerPage}
              setCurrentPage={setCurrentPage}
              setItemsPerPage={setItemsPerPage}
              totalItems={sortedProducts.length}
            />
          </div>
        </div>

        {/* Modals */}
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
        <ProductDetailModal
          product={selectedProduct}
          isOpen={isDetailOpen}
          onOpenChange={setIsDetailOpen}
        />
      </div>
    </div>
  );
}
