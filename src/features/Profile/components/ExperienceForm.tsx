"use client";

import { useForm } from "react-hook-form";
import { Experience } from "@/types/profile";

interface ExperienceFormProps {
  onSubmit: (data: Omit<Experience, "id">) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
  error?: string | null;
}

export default function ExperienceForm({
  onSubmit,
  onCancel,
  isLoading = false,
  error = null,
}: ExperienceFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<Omit<Experience, "id">>({
    defaultValues: {
      company: "",
      title: "",
      startDate: "",
      endDate: "",
      description: "",
      isCurrent: false,
    },
  });

  const isCurrent = watch("isCurrent");

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4"
      data-testid="experience-form"
    >
      {error && (
        <div className="p-2 text-red-600 bg-red-100 rounded">{error}</div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Company *
        </label>
        <input
          type="text"
          {...register("company", { required: "Company is required" })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          disabled={isLoading}
        />
        {errors.company && (
          <p className="mt-1 text-sm text-red-600">{errors.company.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Job Title *
        </label>
        <input
          type="text"
          {...register("title", { required: "Job title is required" })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          disabled={isLoading}
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Start Date *
          </label>
          <input
            type="date"
            {...register("startDate", { required: "Start date is required" })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            disabled={isLoading}
          />
          {errors.startDate && (
            <p className="mt-1 text-sm text-red-600">
              {errors.startDate.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            End Date {!isCurrent && "*"}
          </label>
          <input
            type="date"
            {...register("endDate", {
              required: !isCurrent ? "End date is required" : false,
              validate: (value) => {
                if (!isCurrent && !value) return "End date is required";
                return true;
              },
            })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            disabled={isLoading || isCurrent}
          />
          {errors.endDate && (
            <p className="mt-1 text-sm text-red-600">{errors.endDate.message}</p>
          )}
        </div>
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="isCurrent"
          {...register("isCurrent")}
          className="h-4 w-4 text-blue-600 rounded border-gray-300"
          disabled={isLoading}
        />
        <label htmlFor="isCurrent" className="ml-2 text-sm text-gray-700">
          I am currently working here
        </label>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          {...register("description")}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          disabled={isLoading}
        />
      </div>

      <div className="flex justify-end space-x-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none"
          disabled={isLoading}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none"
          disabled={isLoading}
        >
          {isLoading ? "Saving..." : "Save Experience"}
        </button>
      </div>
    </form>
  );
}