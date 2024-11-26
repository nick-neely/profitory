
import { useState, useMemo, useCallback } from "react";
import type { Product } from "./useProducts";

export interface PinnedColumns {
  left: (keyof Product)[];
  right: (keyof Product)[];
}

export function useColumnManagement() {
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

  const toggleColumn = useCallback((column: keyof Product) => {
    setColumns((prev) =>
      prev.includes(column)
        ? prev.filter((col) => col !== column)
        : [...prev, column]
    );
  }, []);

  const resetColumns = useCallback(() => {
    setColumns(defaultColumns);
  }, [defaultColumns]);

  const hiddenColumnsCount = useMemo(
    () => defaultColumns.length - columns.length,
    [defaultColumns, columns]
  );

  const [pinnedColumns, setPinnedColumns] = useState<PinnedColumns>({
    left: [],
    right: [],
  });

  const pinColumn = useCallback(
    (column: keyof Product, position: "left" | "right") => {
      setPinnedColumns((prev) => {
        const otherPosition = position === "left" ? "right" : "left";
        return {
          ...prev,
          [position]: [...prev[position], column],
          [otherPosition]: prev[otherPosition].filter((col) => col !== column),
        };
      });
    },
    []
  );

  const unpinColumn = useCallback((column: keyof Product) => {
    setPinnedColumns((prev) => ({
      left: prev.left.filter((col) => col !== column),
      right: prev.right.filter((col) => col !== column),
    }));
  }, []);

  const sortedColumns = useMemo(() => {
    return [
      ...pinnedColumns.left,
      ...columns.filter(
        (col) =>
          !pinnedColumns.left.includes(col) && !pinnedColumns.right.includes(col)
      ),
      ...pinnedColumns.right,
    ];
  }, [columns, pinnedColumns]);

  return {
    columns,
    toggleColumn,
    resetColumns,
    hiddenColumnsCount,
    pinnedColumns,
    pinColumn,
    unpinColumn,
    sortedColumns,
    defaultColumns,
  };
}