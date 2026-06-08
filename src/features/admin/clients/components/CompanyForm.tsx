"use client";

import React, { useState, useEffect } from "react";
import { FiSave, FiLoader } from "react-icons/fi";
import { Company } from "@/types/company";
import { CreateCompanyInput } from "@/api/company/createCompany";

interface CompanyFormProps {
  initialData?: Company;
  onSubmit: (data: CreateCompanyInput) => void;
  isSubmitting?: boolean;
  submitText?: string;
}

export default function CompanyForm({
  initialData,
  onSubmit,
  isSubmitting = false,
  submitText,
}: CompanyFormProps) {
  const [formData, setFormData] = useState<CreateCompanyInput>({
    name: "",
    description: "",
    website: "",
    industry: "",
    companySize: "1-10",
    location: "",
    logo: "",
    isActive: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        description: initialData.description || "",
        website: initialData.website || "",
        industry: initialData.industry || "",
        companySize: initialData.companySize || "1-10",
        location: initialData.location || "",
        logo: initialData.logo || "",
        isActive: initialData.isActive !== undefined ? initialData.isActive : true,
      });
    }
  }, [initialData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    let finalValue: string | boolean = value;
    if (type === "checkbox") {
      finalValue = (e.target as HTMLInputElement).checked;
    }
    setFormData((prev) => ({
      ...prev,
      [name]: finalValue,
    }));
    // Clear error
    if (errors[name]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[name];
        return copy;
      });
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Company name is required";
    } else if (formData.name.trim().length < 3) {
      newErrors.name = "Company name must be at least 3 characters";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    } else if (formData.description.trim().length < 10) {
      newErrors.description = "Description must be at least 10 characters";
    }

    if (!formData.website.trim()) {
      newErrors.website = "Website URL is required";
    } else {
      try {
        new URL(formData.website);
      } catch {
        newErrors.website = "Please enter a valid website URL (including http:// or https://)";
      }
    }

    if (!formData.industry.trim()) {
      newErrors.industry = "Industry type is required";
    }

    if (!formData.location.trim()) {
      newErrors.location = "Location is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit(formData);
  };

  const defaultSubmitText = initialData ? "Save Changes" : "Create Company";

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-h-[80vh] overflow-y-auto pr-2">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          Company Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="e.g. Acme Corporation"
          disabled={isSubmitting}
          className={`w-full px-4 py-2.5 text-gray-800 text-sm border ${
            errors.name ? "border-red-500" : "border-[#BBCFFF]"
          } rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#3668FF]/50 focus:border-[#3668FF] disabled:bg-gray-50 transition-all`}
        />
        {errors.name && <span className="text-xs text-red-500 mt-1 block">{errors.name}</span>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Industry <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="industry"
            value={formData.industry}
            onChange={handleChange}
            placeholder="e.g. Technology, Healthcare"
            disabled={isSubmitting}
            className={`w-full px-4 py-2.5 text-gray-800 text-sm border ${
              errors.industry ? "border-red-500" : "border-[#BBCFFF]"
            } rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#3668FF]/50 focus:border-[#3668FF] disabled:bg-gray-50 transition-all`}
          />
          {errors.industry && (
            <span className="text-xs text-red-500 mt-1 block">{errors.industry}</span>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Company Size <span className="text-red-500">*</span>
          </label>
          <select
            name="companySize"
            value={formData.companySize}
            onChange={handleChange}
            disabled={isSubmitting}
            className="w-full px-4 py-2.5 text-gray-800 text-sm border border-[#BBCFFF] rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#3668FF]/50 focus:border-[#3668FF] bg-white disabled:bg-gray-50 transition-all"
          >
            <option value="1-10">1-10 employees</option>
            <option value="11-50">11-50 employees</option>
            <option value="51-200">51-200 employees</option>
            <option value="201-500">201-500 employees</option>
            <option value="501-1000">501-1000 employees</option>
            <option value="1000+">1000+ employees</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Website URL <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="website"
            value={formData.website}
            onChange={handleChange}
            placeholder="e.g. https://acme.com"
            disabled={isSubmitting}
            className={`w-full px-4 py-2.5 text-gray-800 text-sm border ${
              errors.website ? "border-red-500" : "border-[#BBCFFF]"
            } rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#3668FF]/50 focus:border-[#3668FF] disabled:bg-gray-50 transition-all`}
          />
          {errors.website && (
            <span className="text-xs text-red-500 mt-1 block">{errors.website}</span>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Location <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="e.g. San Francisco, CA"
            disabled={isSubmitting}
            className={`w-full px-4 py-2.5 text-gray-800 text-sm border ${
              errors.location ? "border-red-500" : "border-[#BBCFFF]"
            } rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#3668FF]/50 focus:border-[#3668FF] disabled:bg-gray-50 transition-all`}
          />
          {errors.location && (
            <span className="text-xs text-red-500 mt-1 block">{errors.location}</span>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          Logo URL <span className="text-gray-400 font-normal">(Optional)</span>
        </label>
        <input
          type="text"
          name="logo"
          value={formData.logo}
          onChange={handleChange}
          placeholder="e.g. https://acme.com/logo.png"
          disabled={isSubmitting}
          className="w-full px-4 py-2.5 text-gray-800 text-sm border border-[#BBCFFF] rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#3668FF]/50 focus:border-[#3668FF] disabled:bg-gray-50 transition-all"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          Description <span className="text-red-500">*</span>
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Describe the company's business model, team, culture, and goals..."
          rows={4}
          disabled={isSubmitting}
          className={`w-full px-4 py-2.5 text-gray-800 text-sm border ${
            errors.description ? "border-red-500" : "border-[#BBCFFF]"
          } rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#3668FF]/50 focus:border-[#3668FF] disabled:bg-gray-50 transition-all resize-none`}
        />
        {errors.description && (
          <span className="text-xs text-red-500 mt-1 block">{errors.description}</span>
        )}
      </div>

      <div className="flex items-center gap-2 pt-2">
        <input
          type="checkbox"
          name="isActive"
          id="isActive"
          checked={formData.isActive}
          onChange={handleChange}
          disabled={isSubmitting}
          className="h-4 w-4 rounded border-gray-300 text-[#3668FF] focus:ring-[#3668FF]"
        />
        <label htmlFor="isActive" className="text-sm font-medium text-gray-700 select-none cursor-pointer">
          Active (visible for listing and job applications)
        </label>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full mt-4 py-3 bg-[#3668FF] text-white font-semibold rounded-xl shadow-md hover:bg-[#254BAA] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all"
      >
        {isSubmitting ? (
          <>
            <FiLoader className="animate-spin" size={18} />
            Saving...
          </>
        ) : (
          <>
            <FiSave size={18} />
            {submitText || defaultSubmitText}
          </>
        )}
      </button>
    </form>
  );
}
