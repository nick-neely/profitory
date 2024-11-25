import type { ButtonProps } from "@/components/ui/button";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Upload } from "lucide-react";
import { useCallback } from "react";
import { Accept, useDropzone } from "react-dropzone";

interface DropzoneProps {
  onDrop: (files: File[]) => void;
  accept?: Accept;
  disabled?: boolean;
  multiple?: boolean;
  className?: string;
  buttonClassName?: string;
  dropzoneClassName?: string;
  buttonContent?: React.ReactNode;
  dropzoneContent?: React.ReactNode;
  buttonText?: string;
  buttonVariant?: ButtonProps["variant"];
}

export function Dropzone({
  onDrop,
  accept,
  disabled,
  multiple = false,
  className,
  buttonClassName,
  dropzoneClassName,
  buttonContent,
  dropzoneContent,
  buttonText = "Import File",
  buttonVariant = "default",
}: DropzoneProps) {
  const handleDrop = useCallback(
    (acceptedFiles: File[]) => {
      onDrop(acceptedFiles);
    },
    [onDrop]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleDrop,
    accept,
    disabled,
    multiple,
  });

  return (
    <div className={cn("h-9", className)}>
      <div {...getRootProps()} className="h-full w-full">
        <input {...getInputProps()} />
        {isDragActive ? (
          <div
            className={cn(
              "h-full rounded-md",
              "flex items-center justify-center",
              "transition-all duration-300 ease-in-out",
              "bg-background/50",
              "border-2 border-dashed border-primary/50",
              "hover:border-primary/70",
              "shadow-sm w-64",
              disabled && "opacity-50 cursor-not-allowed",
              dropzoneClassName
            )}
          >
            {dropzoneContent ?? (
              <div className="flex items-center gap-2 text-foreground/80">
                <Upload className="h-4 w-4 shrink-0" />
                <p className="text-sm font-medium">Drop here to upload</p>
              </div>
            )}
          </div>
        ) : (
          <Button
            type="button"
            variant={buttonVariant}
            disabled={disabled}
            className={cn("h-full", buttonClassName)}
          >
            {buttonContent ?? (
              <div className="flex items-center gap-2">
                <Upload className="h-4 w-4 shrink-0" />
                <span>{buttonText}</span>
              </div>
            )}
          </Button>
        )}
      </div>
    </div>
  );
}
