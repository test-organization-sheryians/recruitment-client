"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
  DialogDescription, // ← added
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Field {
  key: string;
  label: string;
  value: any; // string or object (for experience)
  disabled?: boolean;
}

interface EditSectionProps {
  title: string;
  fields: Field[];
  onSave: (updatedValues: Record<string, any>) => void;
  allowAddMore?: boolean;
}

export default function EditSection({
  title,
  fields,
  onSave,
  allowAddMore = false,
}: EditSectionProps) {
  const [formValues, setFormValues] = useState<Record<string, any>>({});
  const [open, setOpen] = useState(false);

  // Initialize form values only when dialog opens
  useEffect(() => {
    if (open) {
      const initialValues: Record<string, any> = {};
      fields.forEach((f) => {
        initialValues[f.key] = f.value;
      });
      setFormValues(initialValues);
    }
  }, [open, fields]);

  const handleChange = (key: string, value: any) => {
    setFormValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleAddField = () => {
    const newKey = String(Object.keys(formValues).length);
    setFormValues((prev) => ({
      ...prev,
      [newKey]: { title: "", company: "", start: "", end: "", description: "" },
    }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Edit
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit {title}</DialogTitle>
          <DialogDescription className="text-sm text-gray-500">
            Modify the fields and click Save to update
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
          {Object.entries(formValues).map(([key, value], index) => {
            if (typeof value === "object" && value !== null && "title" in value) {
              return (
                <div key={key} className="space-y-2 p-2 border rounded">
                  <p className="text-xs text-gray-500 mb-1">
                    {fields[index]?.label || `Experience ${index + 1}`}
                  </p>
                  <Input
                    placeholder="Title"
                    value={value.title}
                    onChange={(e) =>
                      handleChange(key, { ...value, title: e.target.value })
                    }
                  />
                  <Input
                    placeholder="Company"
                    value={value.company}
                    onChange={(e) =>
                      handleChange(key, { ...value, company: e.target.value })
                    }
                  />
                  <Input
                    placeholder="Start Date"
                    value={value.start}
                    onChange={(e) =>
                      handleChange(key, { ...value, start: e.target.value })
                    }
                  />
                  <Input
                    placeholder="End Date"
                    value={value.end}
                    onChange={(e) =>
                      handleChange(key, { ...value, end: e.target.value })
                    }
                  />
                  <Input
                    placeholder="Description"
                    value={value.description}
                    onChange={(e) =>
                      handleChange(key, { ...value, description: e.target.value })
                    }
                  />
                </div>
              );
            }

            return (
              <div key={key}>
                <p className="text-xs text-gray-500 mb-1">
                  {fields[index]?.label || `Item ${index + 1}`}
                </p>
                <Input
                  value={value}
                  onChange={(e) => handleChange(key, e.target.value)}
                  disabled={fields[index]?.disabled}
                />
              </div>
            );
          })}

          {allowAddMore && (
            <Button
              variant="ghost"
              className="w-full mt-2 border"
              onClick={handleAddField}
            >
              + Add More
            </Button>
          )}
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>

          <Button
            onClick={() => {
              onSave(formValues);
              setOpen(false);
            }}
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}