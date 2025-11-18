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

export interface Field {
  name: string;
  label: string;
  value: string;
  type?: "text" | "textarea";
}

interface EditSectionDialogProps {
  title: string;
  fields: Field[];
  onSave: (updatedData: Record<string, string>) => void;
}

export default function EditSectionDialog({
  title,
  fields,
  onSave,
}: EditSectionDialogProps) {
  const [formData, setFormData] = useState<Record<string, string>>(
    fields.reduce((acc, f) => ({ ...acc, [f.name]: f.value }), {})
  );

  const handleChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="absolute top-4 right-4 text-sm text-blue-600 hover:underline">
          Edit
        </button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {fields.map((field) => (
            <div key={field.name}>
              <p className="text-sm font-medium mb-1">{field.label}</p>

              {field.type === "textarea" ? (
                <textarea
                  className="w-full border rounded-md p-2"
                  rows={4}
                  value={formData[field.name]}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                />
              ) : (
                <Input
                  value={formData[field.name]}
                  onChange={(e) =>
                    handleChange(field.name, e.target.value)
                  }
                />
              )}
            </div>
          ))}
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>

          <Button
            onClick={() => {
              onSave(formData);
            }}
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
