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
        const newPinned = {
          ...prev,
          [otherPosition]: prev[otherPosition].filter((col) => col !== column),
        };

        if (!prev[position].includes(column)) {
          newPinned[position] = [...prev[position], column];
        }

        return newPinned;
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

  const isPinned = useCallback(
    (column: keyof Product) => {
      return (
        pinnedColumns.left.includes(column) ||
        pinnedColumns.right.includes(column)
      );
    },
    [pinnedColumns]
  );

  const getPinnedPosition = useCallback(
    (column: keyof Product): "left" | "right" | null => {
      if (pinnedColumns.left.includes(column)) return "left";
      if (pinnedColumns.right.includes(column)) return "right";
      return null;
    },
    [pinnedColumns]
  );

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
    isPinned,
    getPinnedPosition,
  };
}