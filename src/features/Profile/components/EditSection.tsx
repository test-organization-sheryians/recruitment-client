"use client";

import { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Field {
  key: string;
  label: string;
  value: string;
  disabled?: boolean;
}

interface EditSectionProps {
  title: string;
  fields: Field[];
  onSave: (updatedValues: Record<string, string>) => void;
}

export default function EditSection({ title, fields, onSave }: EditSectionProps) {
  const [formValues, setFormValues] = useState(
    Object.fromEntries(fields.map((f) => [f.key, f.value]))
  );

  const handleChange = (key: string, value: string) => {
    setFormValues((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Edit
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit {title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {fields.map((field) => (
            <div key={field.key}>
              <p className="text-xs text-gray-500 mb-1">{field.label}</p>
              <Input
                value={formValues[field.key]}
                disabled={field.disabled}
                onChange={(e) => handleChange(field.key, e.target.value)}
              />
            </div>
          ))}
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>

          <Button
            onClick={() => {
              onSave(formValues);
            }}
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
