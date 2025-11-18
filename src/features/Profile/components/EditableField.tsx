"use client";

import { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface EditableFieldProps {
  label: string;
  value: string;
  onChange: (newValue: string) => void;
}

export default function EditableField({
  label,
  value,
  onChange,
}: EditableFieldProps) {
  const [temp, setTemp] = useState(value);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="cursor-pointer p-2 rounded hover:bg-gray-100">
          <p className="text-xs text-gray-500">{label}</p>
          <p className="font-medium">{value}</p>
        </div>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit {label}</DialogTitle>
        </DialogHeader>

        <Input value={temp} onChange={(e) => setTemp(e.target.value)} />

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>

            <Button
              onClick={() => {
                onChange(temp); // update parent
              }}
            >
              Save
            </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
