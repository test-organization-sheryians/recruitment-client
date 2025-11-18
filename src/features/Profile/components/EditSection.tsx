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
  type?: "string" | "experience"; // NEWw
}

export default function EditSection({
  title,
  fields,
  onSave,
  allowAddMore = false,
  type = "string",
}: EditSectionProps) {
  const [formValues, setFormValues] = useState<Record<string, any>>({});

  useEffect(() => {
    const initialValues: Record<string, any> = {};
    fields.forEach((f) => {
      initialValues[f.key] = f.value;
    });
    setFormValues(initialValues);
  }, [fields]);

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

        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
{Object.entries(formValues).map(([key, value], index) => {
  if (type === "experience") {
    // Render multi-input experience fields
    const exp = value;
    return (
      <div key={key} className="space-y-2 p-2 border rounded">
        <p className="text-xs text-gray-500 mb-1">
          {fields[index]?.label || `Experience ${index + 1}`}
        </p>
        <Input placeholder="Title" value={exp.title} onChange={(e) => handleChange(key, {...exp, title: e.target.value})} />
        <Input placeholder="Company" value={exp.company} onChange={(e) => handleChange(key, {...exp, company: e.target.value})} />
        <Input placeholder="Start Date" value={exp.start} onChange={(e) => handleChange(key, {...exp, start: e.target.value})} />
        <Input placeholder="End Date" value={exp.end} onChange={(e) => handleChange(key, {...exp, end: e.target.value})} />
        <Input placeholder="Description" value={exp.description} onChange={(e) => handleChange(key, {...exp, description: e.target.value})} />
      </div>
    );
  }

  // fallback for string inputs
  return (
    <div key={key}>
      <p className="text-xs text-gray-500 mb-1">
        {fields[index]?.label || `Item ${index + 1}`}
      </p>
      <Input
        value={typeof value === "object" ? "" : value}
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
            }}
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
