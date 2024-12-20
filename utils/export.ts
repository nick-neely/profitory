import { Product } from "@/hooks/useProducts";
import { formatCurrency } from "@/lib/utils";

type ExportableData = Product | Product[];
type DataFields = keyof Product;

interface ExportOptions {
  filename?: string;
  fields?: DataFields[];
  formatters?: Partial<Record<DataFields, (value: string | number) => string>>;
}

const defaultFormatters: Partial<
  Record<DataFields, (value: string | number) => string>
> = {
  price: (value) => formatCurrency(Number(value)),
  cost: (value) => formatCurrency(Number(value)),
  profit: (value) => formatCurrency(Number(value)),
};

function formatDataForExport(
  data: ExportableData,
  options: ExportOptions = {}
) {
  const items = Array.isArray(data) ? data : [data];
  const fields =
    options.fields || (Object.keys(items[0] || {}) as DataFields[]);
  const formatters = { ...defaultFormatters, ...options.formatters };

  const headers = fields.map(
    (field) => field.charAt(0).toUpperCase() + field.slice(1)
  );

  const rows = items.map((item) =>
    fields.map((field) => {
      const value = item[field];
      const formatter = formatters[field];
      return formatter ? formatter(value) : String(value);
    })
  );

  return [headers, ...rows].map((row) => row.join(",")).join("\n");
}

export function exportToCSV(
  data: ExportableData,
  options: ExportOptions = {}
): void {
  const csvContent = formatDataForExport(data, options);
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  const filename = options.filename || "export.csv";

  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export async function copyToClipboard(
  data: ExportableData,
  options: ExportOptions = {}
): Promise<void> {
  try {
    const content = formatDataForExport(data, {
      ...options,
    });
    await navigator.clipboard.writeText(content);
  } catch (err) {
    console.error("Failed to copy to clipboard:", err);
    throw err;
  }
}
