import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { toast } from "sonner";

interface DeleteConfirmationModalProps {
  onConfirm: () => void;
  productName: string;
  trigger?: React.ReactNode;
}

export function DeleteConfirmationModal({
  onConfirm,
  productName,
  trigger,
}: DeleteConfirmationModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleConfirm = () => {
    try {
      onConfirm();
      setIsOpen(false); // Close the modal first
      toast.success(`Successfully deleted "${productName}"`);
    } catch (err: unknown) {
      const error = err as Error;
      toast.error(`Failed to delete "${productName}": ${error.message}`);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button
            variant="outline"
            className="text-red-600 hover:bg-red-100 hover:text-red-700 dark:hover:bg-red-900/30"
          >
            Remove
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Confirm Deletion</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete the product &quot;{productName}
            &quot;? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
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
