"use client";

import { useEffect, useState } from "react";
import { useRegisterClient, useUpdateClient } from "../hook/useClient";
import { useToast } from "@/components/ui/Toast";
import { useRouter } from "next/navigation";

type CompanyData = {
  name: string;
  website?: string;
  sector: string;
  location?: string;
  description?: string;
};

type RegisterFormProps = {
  initialData?: CompanyData;
  isEdit?: boolean;
  clientId?: string;
};

export default function RegisterForm({ initialData, isEdit = false, clientId, }: RegisterFormProps) {
  const [formData, setFormData] = useState<CompanyData>({
    name: "",
    website: "",
    sector: "",
    location: "",
    description: "",
  });

  const toast = useToast()
  const router = useRouter()

  const {
    mutate: registerClient,
    isPending: isRegistering,
  } = useRegisterClient();

  const {
    mutate: updateClient,
    isPending: isUpdating,
  } = useUpdateClient();

  const isPending = isRegistering || isUpdating;

  // Prefill form in edit mode
  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isEdit && clientId) {
      updateClient(
        { id: clientId, data: formData },
        {
          onSuccess: () => {
            toast.success('Client updated successfully')

            setFormData({
              name: "",
              website: "",
              sector: "",
              location: "",
              description: "",
            });

            router.push('/client')
          },
          onError: (error: any) => {
            alert(error?.message || "Update failed");
          },
        }
      );
    } else {
      registerClient(formData, {
        onSuccess: () => {
          toast.success(" Registration done")

          setFormData({
            name: "",
            website: "",
            sector: "",
            location: "",
            description: "",
          });

           router.push('/client')
        },
        onError: (error: any) => {
          alert(error?.message || "Registration failed");
        },
      });
    }
  };

  return (
    <div className="bg-white shadow-xl rounded-lg p-8 w-full max-w-lg">
      <h1 className="text-2xl font-bold mb-6 text-center">
        {isEdit ? "Update Company" : "Company Registration"}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Company Name"
          required
          value={formData.name}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <input
          type="text"
          name="website"
          placeholder="Website"
          value={formData.website}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <input
          type="text"
          name="sector"
          placeholder="Sector"
          required
          value={formData.sector}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <input
          type="text"
          name="location"
          placeholder="Location"
          value={formData.location}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          rows={4}
        />

        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition disabled:opacity-50"
        >
          {isPending
            ? "Saving..."
            : isEdit
              ? "Update Client"
              : "Register"}
        </button>
      </form>
    </div>
  );
}
