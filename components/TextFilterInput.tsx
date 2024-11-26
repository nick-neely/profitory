import { Input } from "@/components/ui/input";

interface TextFilterInputProps {
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
}

export function TextFilterInput({
  placeholder,
  value,
  onChange,
}: TextFilterInputProps) {
  return (
    <Input
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="max-w-sm"
    />
  );
}