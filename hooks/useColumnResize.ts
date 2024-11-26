
import { useCallback, useRef, useState } from "react";

// Define interface for column constraints
export interface ColumnConstraints {
  [key: string]: { minWidth: number; maxWidth: number };
}

interface UseColumnResizeProps {
  initialWidths: Record<string, number>;
  columnConstraints: ColumnConstraints;
}

export function useColumnResize({ initialWidths, columnConstraints }: UseColumnResizeProps) {
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
    [isResizing, columnConstraints]
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

  const resetColumnWidths = useCallback(() => {
    Object.entries(initialWidths).forEach(([column, width]) => {
      const { minWidth, maxWidth } = columnConstraints[column];
      const initialWidth = Math.max(minWidth, Math.min(width, maxWidth));
      document.documentElement.style.setProperty(
        `--column-width-${column}`,
        `${initialWidth}px`
      );
    });
  }, [initialWidths, columnConstraints]);

  return {
    containerRef,
    isResizing,
    widths: widths.current,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    resetColumnWidths,
  };
}