"use client";

import { useForm } from "react-hook-form";
import { useState } from "react";
import { useCreateJobRole } from "@/features/auth/hooks/useCreateJob";
import { useRouter } from "next/navigation";

const JobRoleCreateForm = () => {
  const router = useRouter();
  const { register, handleSubmit, reset } = useForm();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    mutate: createJobRole,
    isPending,
    isSuccess,
    isError,
    error,
  } = useCreateJobRole();

  const onSubmit = (data: any) => {
    setServerError(null);

    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("requiredExperience", data.requiredExperience);
    formData.append("category", data.category);
    formData.append("education", data.education);
    formData.append("description", data.description);
    formData.append("expiry", data.expiry);

    const skillsArray = data.skills?.split(",").map((s: string) => s.trim());
    formData.append("skills", JSON.stringify(skillsArray));

    createJobRole(formData, {
      onSuccess: () => {
        reset();
        router.push("/admin/job");
      },
      onError: (err: any) => {
        const message =
          err?.response?.data?.message ||
          err?.message ||
          "Failed to create job role.";
        setServerError(message);
      },
    });
  };

  return (
    <div className="w-full bg-white rounded-2xl py-5 px-[20%] font-[satoshi]">

      {/* Close Button */}
      <div className="flex justify-end mb-4">
        <button
          onClick={() => router.push("/admin/job")}
          className="bg-blue-500 hover:bg-gray-300 text-gray-900 font-semibold px-4 py-2 rounded-lg"
        >
          Close
        </button>
      </div>

      <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6">
        Create Job Role
      </h1>

      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>

        {/* Job Title */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Job Title</label>
          <input
            type="text"
            placeholder="Job title"
            className="border border-gray-300 px-3 py-2 rounded-lg w-full"
            {...register("title", { required: true })}
          />
        </div>

        {/* Required Experience */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Required Experience</label>
          <input
            type="text"
            placeholder="e.g. 2+ years"
            className="border border-gray-300 px-3 py-2 rounded-lg w-full"
            {...register("requiredExperience", { required: true })}
          />
        </div>

        {/* Category */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Category</label>
          <input
            type="text"
            placeholder="Select Category"
            className="border border-gray-300 px-3 py-2 rounded-lg w-full"
            {...register("category", { required: true })}
          />
        </div>

        {/* Education */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Education</label>
          <input
            type="text"
            placeholder="Required education"
            className="border border-gray-300 px-3 py-2 rounded-lg w-full"
            {...register("education", { required: true })}
          />
        </div>

        {/* Description */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Description</label>
          <input
            type="text"
            placeholder="Job description"
            className="border border-gray-300 px-3 py-2 rounded-lg w-full"
            {...register("description", { required: true })}
          />
        </div>

        {/* Skills */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Skills</label>
          <input
            type="text"
            placeholder="skill1, skill2, skill3"
            className="border border-gray-300 px-3 py-2 rounded-lg w-full"
            {...register("skills")}
          />
        </div>

        {/* Expiry */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Expiry Date</label>
          <input
            type="date"
            className="border border-gray-300 px-3 py-2 rounded-lg w-full"
            {...register("expiry", { required: true })}
          />
        </div>

        {(isError || serverError) && (
          <div className="bg-red-50 text-red-700 border border-red-200 p-3 rounded-lg text-sm">
            {serverError || (error as any)?.message || "Something went wrong"}
          </div>
        )}

        {isSuccess && (
          <div className="bg-green-50 text-green-700 border border-green-200 p-3 rounded-lg text-sm">
            Job Role Created Successfully!
          </div>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-[#4C62ED] hover:bg-[#3A4CD1] text-white font-medium rounded-base py-3 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all"
        >
          {isPending ? "Creating Job Role..." : "Create Job Role"}
        </button>
      </form>
    </div>
  );
};

export default JobRoleCreateForm;
