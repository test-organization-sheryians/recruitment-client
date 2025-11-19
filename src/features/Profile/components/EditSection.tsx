"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Field {
  key: string;
  label: string;
  value: any; // string OR object
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

  useEffect(() => {
    if (open) {
      const initial: Record<string, any> = {};
      fields.forEach((f) => {
        // Keep strings as strings and objects as objects
        initial[f.key] = typeof f.value === "object"
          ? { ...f.value }
          : f.value;
      });
      setFormValues(initial);
    }
  }, [open, fields]);

  const handleChange = (key: string, value: any) => {
    setFormValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleAddField = () => {
    const newKey = String(Object.keys(formValues).length);

    // Detect type from FIRST field
    const first = fields[0]?.value;

    const isExperience = typeof first === "object";

    setFormValues((p) => ({
      ...p,
      [newKey]: isExperience
        ? {
            title: "",
            company: "",
            start: "",
            end: "",
            description: "",
          }
        : "",
    }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">Edit</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit {title}</DialogTitle>
          <DialogDescription>
            Update values and click save.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
          {Object.entries(formValues).map(([key, value], index) => {
            const fieldMeta = fields[index];

            const isExperience = typeof value === "object" && value !== null && "title" in value;

            // EXPERIENCE UI
            if (isExperience) {
              return (
                <div key={key} className="p-2 border rounded space-y-2 bg-gray-50">
                  <p className="text-xs text-gray-500 mb-1">
                    {fieldMeta?.label || `Item ${index + 1}`}
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
                      handleChange(key, {
                        ...value,
                        description: e.target.value,
                      })
                    }
                  />
                </div>
              );
            }

            // SIMPLE TEXT FIELD
            return (
              <div key={key}>
                <p className="text-xs text-gray-500 mb-1">
                  {fieldMeta?.label || `Item ${index + 1}`}
                </p>
                <Input
                  value={value}
                  disabled={fieldMeta?.disabled}
                  onChange={(e) => handleChange(key, e.target.value)}
                />
              </div>
            );
          })}

          {allowAddMore && (
            <Button variant="outline" className="w-full" onClick={handleAddField}>
              + Add More
            </Button>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>

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
