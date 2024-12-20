import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

interface DeleteConfirmationModalProps {
  onConfirm: () => void;
  productName: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteConfirmationModal({
  onConfirm,
  productName,
  isOpen,
  onOpenChange,
}: DeleteConfirmationModalProps) {
  const handleConfirm = () => {
    try {
      onConfirm();
      onOpenChange(false);
      toast.success(`Successfully deleted "${productName}"`);
    } catch (err: unknown) {
      const error = err as Error;
      toast.error(`Failed to delete "${productName}": ${error.message}`);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Confirm Deletion</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete the product &quot;{productName}
            &quot;? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleConfirm}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
