
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { formatCurrency } from "@/lib/utils";
import { DollarSign } from "lucide-react";

type PriceOperator = "=" | ">" | ">=" | "<" | "<=";

type PriceFilter = {
  operator: PriceOperator;
  value: number;
} | null;

interface PriceFilterProps {
  value: PriceFilter;
  onChange: (filter: PriceFilter) => void;
}

const OPERATORS: { value: PriceOperator; label: string }[] = [
  { value: "=", label: "Equal to" },
  { value: ">", label: "Greater than" },
  { value: ">=", label: "Greater than or equal to" },
  { value: "<", label: "Less than" },
  { value: "<=", label: "Less than or equal to" },
];

export function PriceFilter({ value, onChange }: PriceFilterProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full justify-start">
          <DollarSign className="mr-2 h-4 w-4" />
          {value ? (
            <span>
              {value.operator} {formatCurrency(value.value)}
            </span>
          ) : (
            <span>Filter price...</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Price Filter</h4>
            <p className="text-sm text-muted-foreground">
              Set the price filter criteria
            </p>
          </div>
          <div className="grid gap-2">
            <Select
              value={value?.operator || "="}
              onValueChange={(op) =>
                onChange({
                  operator: op as PriceOperator,
                  value: value?.value || 0,
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select operation" />
              </SelectTrigger>
              <SelectContent>
                {OPERATORS.map((op) => (
                  <SelectItem key={op.value} value={op.value}>
                    {op.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              type="number"
              step="0.01"
              min="0"
              placeholder="Enter price..."
              value={value?.value || ""}
              onChange={(e) =>
                onChange({
                  operator: value?.operator || "=",
                  value: parseFloat(e.target.value) || 0,
                })
              }
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => onChange(null)}
              size="sm"
            >
              Clear
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}