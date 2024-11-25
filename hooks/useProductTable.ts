
import { useState, useMemo, useCallback } from "react";
import type { Product } from "./useProducts";

export type SortConfig = {
  key: keyof Product;
  direction: "asc" | "desc";
};

export type PriceOperator = ">" | ">=" | "<" | "<=" | "=";

export type NumberFilter = {
  operator: PriceOperator;
  value: number;
};

export type FilterValue = string | NumberFilter | null;

export function useProductTable(products: Product[]) {
  const [filters, setFilters] = useState<Record<string, FilterValue>>({});
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: "brand",
    direction: "asc",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const filteredProducts = useMemo(() => {
    return products.filter((product) =>
      Object.entries(filters).every(([key, filter]) => {
        if (!filter) return true;

        if (key === "price" || key === "quantity") {
          const numericFilter = filter as NumberFilter;
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
  }, [products, filters]);

  const sortedProducts = useMemo(() => {
    return [...filteredProducts].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key])
        return sortConfig.direction === "asc" ? -1 : 1;
      if (a[sortConfig.key] > b[sortConfig.key])
        return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredProducts, sortConfig]);

  const paginatedProducts = useMemo(() => {
    return sortedProducts.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );
  }, [sortedProducts, currentPage, itemsPerPage]);

  const totalPages = useMemo(
    () => Math.ceil(sortedProducts.length / itemsPerPage),
    [sortedProducts.length, itemsPerPage]
  );

  const handleFilterChange = useCallback(
    (key: keyof Product, value: FilterValue) => {
      setFilters((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const handleSort = useCallback((key: keyof Product) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  }, []);

  return {
    filters,
    setFilters,
    sortConfig,
    setSortConfig,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
    totalPages,
    paginatedProducts,
    sortedProducts,
    handleFilterChange,
    handleSort,
  };
}