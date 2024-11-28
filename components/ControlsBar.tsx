import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { FilterValue } from "@/hooks/useProductTable";
import { Download, Filter, Menu, Trash } from "lucide-react";
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
  const MobileControls = () => (
    <div className="grid gap-4 py-4">
      <Button
        variant={showFilterInputs ? "secondary" : "outline"}
        onClick={() => {
          if (showFilterInputs) {
            setFilters({});
          }
          setShowFilterInputs(!showFilterInputs);
        }}
        className="justify-start h-12"
      >
        <Filter className="h-5 w-5 mr-2" />
        <span>{showFilterInputs ? "Hide Filters" : "Show Filters"}</span>
      </Button>
      <Button
        variant="outline"
        onClick={handleExportToCSV}
        disabled={isExportDisabled}
        className="justify-start h-12"
      >
        <Download
          className={`h-5 w-5 mr-2 ${
            isExportDisabled ? "text-muted-foreground" : ""
          }`}
        />
        <span>Export to CSV</span>
      </Button>
      <Button
        variant="outline"
        onClick={() => setIsDeleteAllModalOpen(true)}
        disabled={isExportDisabled}
        className="justify-start h-12 hover:bg-red-500 hover:text-white"
      >
        <Trash
          className={`h-5 w-5 mr-2 ${
            isExportDisabled ? "text-muted-foreground" : ""
          }`}
        />
        <span>Delete All Products</span>
      </Button>
    </div>
  );

  return (
    <div className="flex justify-between items-center mb-4 bg-background">
      {/* Mobile Controls */}
      <div className="w-full md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-start px-4 h-12"
            >
              <Menu className="h-5 w-5 mr-2" />
              <span>Controls</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom">
            <SheetHeader>
              <SheetTitle>Controls</SheetTitle>
            </SheetHeader>
            <MobileControls />
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Controls */}
      <div className="hidden md:flex space-x-2">
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
