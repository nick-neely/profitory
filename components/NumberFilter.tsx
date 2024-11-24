
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
import { Hash } from "lucide-react";

export type NumberOperator = "=" | ">" | ">=" | "<" | "<=";

export type NumberFilter = {
  operator: NumberOperator;
  value: number;
} | null;

interface NumberFilterProps {
  value: NumberFilter;
  onChange: (filter: NumberFilter) => void;
  placeholder?: string;
  step?: number;
  min?: number;
}

const OPERATORS: { value: NumberOperator; label: string }[] = [
  { value: "=", label: "Equal to" },
  { value: ">", label: "Greater than" },
  { value: ">=", label: "Greater than or equal to" },
  { value: "<", label: "Less than" },
  { value: "<=", label: "Less than or equal to" },
];

export function NumberFilter({ 
  value, 
  onChange, 
  placeholder = "Filter number...",
  step = 1,
  min = 0 
}: NumberFilterProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full justify-start">
          <Hash className="mr-2 h-4 w-4" />
          {value ? (
            <span>
              {value.operator} {value.value}
            </span>
          ) : (
            <span>{placeholder}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Number Filter</h4>
            <p className="text-sm text-muted-foreground">
              Set the numeric filter criteria
            </p>
          </div>
          <div className="grid gap-2">
            <Select
              value={value?.operator || "="}
              onValueChange={(op) =>
                onChange({
                  operator: op as NumberOperator,
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
              step={step}
              min={min}
              placeholder="Enter value..."
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