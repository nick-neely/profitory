
import { Product } from "@/hooks/useProducts";
import { formatCurrency } from "@/lib/utils";

type CopyableData = Product | Product[];
type DataFields = keyof Product;

interface CopyOptions {
  fields?: DataFields[];
  formatters?: Partial<Record<DataFields, (value: string | number) => string>>;
}

const defaultFormatters: Partial<Record<DataFields, (value: string | number) => string>> = {
  price: (value) => formatCurrency(Number(value)),
  cost: (value) => formatCurrency(Number(value)),
  profit: (value) => formatCurrency(Number(value)),
};

function formatDataForCopy(data: CopyableData, options: CopyOptions = {}) {
  const items = Array.isArray(data) ? data : [data];
  const fields = options.fields || Object.keys(items[0] || {}) as DataFields[];
  const formatters = { ...defaultFormatters, ...options.formatters };

  const rows = items.map((item) =>
    fields.map((field) => {
      const value = item[field];
      const formatter = formatters[field];
      return formatter ? formatter(value) : String(value);
    })
  );

  // For single column copy
  if (fields.length === 1) {
    return rows.map(row => row[0]).join(', ');
  }

  // For multi-column copy
  return rows.map((row) => row.join(', ')).join('\n');
}

export async function copyToClipboard(
  data: CopyableData,
  options: CopyOptions = {}
): Promise<void> {
  try {
    const content = formatDataForCopy(data, options);
    await navigator.clipboard.writeText(content);
  } catch (err) {
    console.error("Failed to copy to clipboard:", err);
    throw err;
  }
}