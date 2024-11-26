import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PRODUCT_CONDITIONS } from "@/constants";

interface ConditionFilterInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function ConditionFilterInput({
  value,
  onChange,
}: ConditionFilterInputProps) {
  return (
    <Select
      value={value || "all"}
      onValueChange={(value) => onChange(value === "all" ? "" : value)}
    >
      <SelectTrigger className="max-w-sm">
        <SelectValue placeholder="Filter condition" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All</SelectItem>
        {PRODUCT_CONDITIONS.map((condition) => (
          <SelectItem key={condition} value={condition}>
            {condition}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
