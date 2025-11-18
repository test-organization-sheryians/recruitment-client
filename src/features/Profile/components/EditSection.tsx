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
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// Proper types instead of any
interface ExperienceItem {
  title: string;
  company: string;
  start: string;
  end: string;
  description: string;
}

interface Field {
  key: string;
  label: string;
  value: string | ExperienceItem;
  disabled?: boolean;
}

interface EditSectionProps {
  title: string;
  fields: Field[];
  onSave: (updatedValues: Record<string, string | ExperienceItem>) => void;
  allowAddMore?: boolean;
  type?: "string" | "experience";
}

export default function EditSection({
  title,
  fields,
  onSave,
  allowAddMore = false,
  type = "string",
}: EditSectionProps) {
  const [formValues, setFormValues] = useState<
    Record<string, string | ExperienceItem>
  >({});

  useEffect(() => {
    const initialValues: Record<string, string | ExperienceItem> = {};
    fields.forEach((f) => {
      initialValues[f.key] = f.value;
    });
    setFormValues(initialValues);
  }, [fields]);

  const handleChange = (
    key: string,
    value: string | ExperienceItem
  ) => {
    setFormValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleAddField = () => {
    const newKey = `new_${Date.now()}`; // better than length-based key
    setFormValues((prev) => ({
      ...prev,
      [newKey]: {
        title: "",
        company: "",
        start: "",
        end: "",
        description: "",
      } satisfies ExperienceItem,
    }));
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Edit
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit {title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
          {Object.entries(formValues).map(([key, value], index) => {
            if (type === "experience") {
              const exp = value as ExperienceItem; // safe because type === "experience"
              return (
                <div key={key} className="space-y-3 rounded-lg border p-4">
                  <p className="text-sm font-medium text-muted-foreground">
                    {fields[index]?.label || `Experience ${index + 1}`}
                  </p>
                  <div className="grid grid-cols-2 gap-3 space-y-3 md:grid">
                    <Input
                      placeholder="Job Title"
                      value={exp.title}
                      onChange={(e) =>
                        handleChange(key, { ...exp, title: e.target.value })
                      }
                    />
                    <Input
                      placeholder="Company"
                      value={exp.company}
                      onChange={(e) =>
                        handleChange(key, { ...exp, company: e.target.value })
                      }
                    />
                    <Input
                      placeholder="Start Date"
                      value={exp.start}
                      onChange={(e) =>
                        handleChange(key, { ...exp, start: e.target.value })
                      }
                    />
                    <Input
                      placeholder="End Date (or 'Present')"
                      value={exp.end}
                      onChange={(e) =>
                        handleChange(key, { ...exp, end: e.target.value })
                      }
                    />
                    <Input
                      placeholder="Description"
                      value={exp.description}
                      onChange={(e) =>
                        handleChange(key, {
                          ...exp,
                          description: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              );
            }

            // Regular string fields
            return (
              <div key={key}>
                <p className="text-sm font-medium text-muted-foreground">
                  {fields[index]?.label || `Item ${index + 1}`}
                </p>
                <Input
                  value={typeof value === "string" ? value : ""}
                  onChange={(e) => handleChange(key, e.target.value)}
                  disabled={fields[index]?.disabled}
                />
              </div>
            );
          })}

          {allowAddMore && type === "experience" && (
            <Button
              variant="outline"
              className="w-full"
              onClick={handleAddField}
            >
              + Add Experience
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
            }}
          >
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}