import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";

interface DeleteAllConfirmationModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export function DeleteAllConfirmationModal({
  isOpen,
  onOpenChange,
  onConfirm,
}: DeleteAllConfirmationModalProps) {
  const [confirmationPhrase, setConfirmationPhrase] = useState("");
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    if (isOpen) {
      // Generate a random short phrase when the modal opens
      const words = [
        // Colors
        "red",
        "blue",
        "pink",
        "gold",
        "jade",

        // Animals
        "dog",
        "cat",
        "fox",
        "wolf",
        "bear",
        "duck",
        "fish",

        // Nature
        "tree",
        "leaf",
        "rock",
        "moon",
        "star",
        "rain",
        "wind",

        // Objects
        "book",
        "lamp",
        "key",
        "door",
        "cup",
        "ring",
        "box",

        // Food
        "cake",
        "milk",
        "rice",
        "pie",
        "jam",

        // Abstract
        "hope",
        "joy",
        "calm",
        "soft",
        "wave",

        // Simple verbs
        "jump",
        "swim",
        "run",
        "sing",
        "glow",

        // Places
        "home",
        "shop",
        "park",
        "pond",
        "cave",

        // Tech
        "code",
        "link",
        "post",
        "chat",
        "app",
      ];
      const randomWords = Array.from(
        { length: 3 },
        () => words[Math.floor(Math.random() * words.length)]
      );
      setConfirmationPhrase(randomWords.join("-"));
      setInputValue("");
    }
  }, [isOpen]);

  const handleConfirm = () => {
    const normalizedInput = inputValue.replace(/\s/g, "");
    const normalizedPhrase = confirmationPhrase.replace(/\s/g, "");
    if (normalizedInput === normalizedPhrase) {
      onConfirm();
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete All Products</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete all products? This action cannot be
            undone. To confirm, please type the following phrase:
          </DialogDescription>
          <div
            className="mt-2 font-mono bg-secondary p-3 rounded-md text-center select-none"
            onCopy={(e) => e.preventDefault()}
          >
            {confirmationPhrase.split("").map((char, index) => (
              <span
                key={index}
                className={
                  char === "-" ? "mx-2 text-muted-foreground" : "font-semibold"
                }
              >
                {char === "-" ? " - " : char}
              </span>
            ))}
          </div>
        </DialogHeader>
        <div className="mt-4">
          <Input
            placeholder="Type the confirmation phrase"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={
              inputValue.replace(/\s/g, "") !==
              confirmationPhrase.replace(/\s/g, "")
            }
          >
            Delete All
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
