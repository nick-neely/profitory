
export const PRODUCT_CONDITIONS = [
  "New",
  "Refurbished",
  "Used - Like New",
  "Used - Good",
  "Used - Acceptable",
] as const;

export type ProductCondition = (typeof PRODUCT_CONDITIONS)[number];