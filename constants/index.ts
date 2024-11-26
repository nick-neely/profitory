import { ColumnConstraints } from "@/hooks/useColumnResize";

export const PRODUCT_CONDITIONS = [
  "New",
  "Refurbished",
  "Used - Like New",
  "Used - Good",
  "Used - Acceptable",
] as const;

export type ProductCondition = (typeof PRODUCT_CONDITIONS)[number];

export const columnConstraints: ColumnConstraints = {
  brand: { minWidth: 100, maxWidth: 300 },
  name: { minWidth: 150, maxWidth: 400 },
  price: { minWidth: 80, maxWidth: 150 },
  quantity: { minWidth: 80, maxWidth: 150 },
  condition: { minWidth: 100, maxWidth: 250 },
  category: { minWidth: 100, maxWidth: 250 },
  cost: { minWidth: 80, maxWidth: 150 },
  profit: { minWidth: 80, maxWidth: 150 },
};