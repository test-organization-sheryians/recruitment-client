"use client";

import React, { useState } from "react";
import { FiEdit, FiTrash2, FiExternalLink, FiMapPin, FiUsers, FiInfo } from "react-icons/fi";
import { Company } from "@/types/company";
import Modal from "@/components/ui/Modal";

interface CompanyCardProps {
  company: Company;
  onEdit: (company: Company) => void;
  onDelete: (id: string) => void;
  isDeleting?: boolean;
}

export default function CompanyCard({
  company,
  onEdit,
  onDelete,
  isDeleting = false,
}: CompanyCardProps) {
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);

  // Helper to construct initials if logo doesn't exist
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  const handleDelete = () => {
    onDelete(company._id);
    setIsConfirmDeleteOpen(false);
  };

  return (
    <>
      <div className="bg-white rounded-2xl border border-gray-150 hover:border-blue-200 shadow-sm hover:shadow-xl transition-all duration-300 p-6 flex flex-col justify-between group relative overflow-hidden">
        {/* Subtle top color band to elevate aesthetics */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-500 to-[#3668FF]" />

        <div>
          {/* Header section: Logo & Title */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              {company.logo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={company.logo}
                  alt={`${company.name} logo`}
                  className="w-12 h-12 rounded-xl object-contain border border-gray-100 bg-gray-50 flex-shrink-0"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = ""; // Clear src to trigger fallback
                  }}
                />
              ) : (
                <div className="w-12 h-12 rounded-xl bg-[#EBF1FF] text-[#3668FF] font-bold text-lg flex items-center justify-center flex-shrink-0 border border-blue-50">
                  {getInitials(company.name)}
                </div>
              )}

              <div>
                <h3 className="font-bold text-gray-900 group-hover:text-[#3668FF] transition-colors line-clamp-1">
                  {company.name}
                </h3>
                <span className="inline-block mt-0.5 px-2 py-0.5 text-xs font-semibold bg-[#EBF1FF] text-[#3668FF] rounded-md">
                  {company.industry}
                </span>
              </div>
            </div>

            {/* Status Indicator */}
            <span
              className={`px-2 py-0.5 rounded-full text-2xs font-bold ${
                company.isActive
                  ? "bg-green-50 text-green-600 border border-green-200"
                  : "bg-red-50 text-red-500 border border-red-150"
              }`}
            >
              {company.isActive ? "Active" : "Inactive"}
            </span>
          </div>

          {/* Description */}
          <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">
            {company.description}
          </p>

          {/* Metadata badges */}
          <div className="space-y-2 mb-6 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <FiMapPin className="text-[#3668FF] flex-shrink-0" size={16} />
              <span className="line-clamp-1">{company.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <FiUsers className="text-[#3668FF] flex-shrink-0" size={16} />
              <span>{company.companySize} employees</span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <a
            href={company.website}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs font-semibold text-gray-700 hover:text-[#3668FF] transition-colors"
          >
            Website
            <FiExternalLink size={14} />
          </a>

          <div className="flex gap-2">
            <button
              onClick={() => onEdit(company)}
              className="p-2 text-gray-500 hover:text-[#3668FF] hover:bg-[#EBF1FF] rounded-xl transition duration-200"
              title="Edit Company"
            >
              <FiEdit size={16} />
            </button>
            <button
              onClick={() => setIsConfirmDeleteOpen(true)}
              className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition duration-200"
              title="Delete Company"
            >
              <FiTrash2 size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {isConfirmDeleteOpen && (
        <Modal
          isOpen={isConfirmDeleteOpen}
          onClose={() => setIsConfirmDeleteOpen(false)}
          title="Confirm Delete"
          maxWidth="sm"
        >
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-red-600">
              <FiInfo size={24} className="flex-shrink-0" />
              <p className="font-bold text-gray-800 text-lg">Are you sure?</p>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">
              This action will permanently delete <span className="font-semibold">{company.name}</span>. This cannot be undone.
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setIsConfirmDeleteOpen(false)}
                className="px-4 py-2 text-sm bg-gray-100 text-gray-750 font-medium rounded-xl hover:bg-gray-200 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 text-sm bg-red-600 text-white font-medium rounded-xl hover:bg-red-700 transition"
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}
