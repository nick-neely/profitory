import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { FilterValue } from "@/hooks/useProductTable";
import { Download, Filter, Trash } from "lucide-react";
import { Dispatch, SetStateAction } from "react";

interface ControlsBarProps {
  showFilterInputs: boolean;
  setShowFilterInputs: (show: boolean) => void;
  setFilters: Dispatch<SetStateAction<Record<string, FilterValue>>>;

  handleExportToCSV: () => void;
  setIsDeleteAllModalOpen: (open: boolean) => void;
  isExportDisabled: boolean;
}

export function ControlsBar({
  showFilterInputs,
  setShowFilterInputs,
  setFilters,
  handleExportToCSV,
  setIsDeleteAllModalOpen,
  isExportDisabled,
}: ControlsBarProps) {
  return (
    <div className="flex justify-between items-center mb-4 bg-background">
      <div className="flex space-x-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={showFilterInputs ? "secondary" : "outline"}
                onClick={() => {
                  if (showFilterInputs) {
                    setFilters({});
                  }
                  setShowFilterInputs(!showFilterInputs);
                }}
              >
                <Filter className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{showFilterInputs ? "Hide Filters" : "Show Filters"}</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                onClick={handleExportToCSV}
                disabled={isExportDisabled}
              >
                <Download
                  className={`h-4 w-4 ${
                    isExportDisabled ? "text-muted-foreground" : ""
                  }`}
                />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Export to CSV</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                onClick={() => setIsDeleteAllModalOpen(true)}
                disabled={isExportDisabled}
                className="hover:bg-red-500 hover:text-white"
              >
                <Trash
                  className={`h-4 w-4 ${
                    isExportDisabled ? "text-muted-foreground" : ""
                  }`}
                />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Delete All Products</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
}
