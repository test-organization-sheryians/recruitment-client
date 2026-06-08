"use client";

import React, { useState, useEffect } from "react";
import { FiPlus, FiBriefcase } from "react-icons/fi";
import { Company } from "@/types/company";
import {
  useGetAllCompanies,
  useCreateCompany,
  useUpdateCompany,
  useDeleteCompany,
} from "@/features/admin/clients/hooks/useCompanyApi";
import { CreateCompanyInput } from "@/api/company/createCompany";
import CompanyList from "@/features/admin/clients/components/CompanyList";
import CompanyForm from "@/features/admin/clients/components/CompanyForm";
import Modal from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";

export default function ClientsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | undefined>(undefined);
  const { success, error } = useToast();

  const {
    data: companies = [],
    isLoading: isFetching,
    error: fetchError,
  } = useGetAllCompanies();

  const {
    mutate: createCompany,
    isPending: isCreating,
    error: createError,
  } = useCreateCompany();

  const {
    mutate: updateCompany,
    isPending: isUpdating,
    error: updateError,
  } = useUpdateCompany();

  const {
    mutate: deleteCompany,
    isPending: isDeleting,
    error: deleteError,
  } = useDeleteCompany();

  useEffect(() => {
    if (createError) error(createError.message || "Failed to create company");
    if (updateError) error(updateError.message || "Failed to update company");
    if (deleteError) error(deleteError.message || "Failed to delete company");
    if (fetchError) error("Failed to load companies");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createError, updateError, deleteError, fetchError]);

  const handleOpenAddModal = () => {
    setEditingCompany(undefined);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (company: Company) => {
    setEditingCompany(company);
    setIsModalOpen(true);
  };

  const handleFormSubmit = (data: CreateCompanyInput) => {
    if (editingCompany) {
      updateCompany(
        { id: editingCompany._id, data },
        {
          onSuccess: () => {
            success("Company updated successfully!");
            setIsModalOpen(false);
            setEditingCompany(undefined);
          },
        }
      );
    } else {
      createCompany(data, {
        onSuccess: () => {
          success("Company registered successfully!");
          setIsModalOpen(false);
        },
      });
    }
  };

  const handleDelete = (id: string) => {
    deleteCompany(id, {
      onSuccess: () => {
        success("Company profile deleted successfully");
      },
    });
  };

  const companiesCount = companies.length;
  const isAnyLoading = isCreating || isUpdating || isDeleting;

  return (
    <>
      <div className="min-h-screen flex bg-gray-50">
        <div className="flex-grow flex flex-col p-6 space-y-6">
          <div className="p-6 bg-white rounded-2xl border border-gray-200 shadow-sm relative">
            
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6 border-b pb-4 border-[#DDE6F5]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#EBF1FF] text-[#3668FF] flex items-center justify-center">
                  <FiBriefcase size={20} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-[#18253B]">
                    Manage Clients / Companies
                  </h2>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Create and manage parent company profiles for jobs
                  </p>
                </div>
                <span className="ml-2 px-3 py-1 text-sm font-semibold bg-[#EBF1FF] text-[#3668FF] rounded-full">
                  {isFetching ? "..." : companiesCount}
                </span>
              </div>

              <button
                onClick={handleOpenAddModal}
                disabled={isFetching || isAnyLoading}
                className="py-2.5 px-4 bg-[#3668FF] text-white font-semibold rounded-xl shadow-md hover:bg-[#254BAA] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <FiPlus size={20} />
                Add New Company
              </button>
            </div>

            {/* Error Message banner */}
            {fetchError && !isFetching && (
              <div className="text-center py-12 bg-red-50 rounded-2xl border border-red-100 max-w-md mx-auto my-6">
                <p className="text-red-600 font-semibold mb-3">
                  Failed to load companies list
                </p>
                <button
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-xl hover:bg-red-700 transition"
                >
                  Reload Page
                </button>
              </div>
            )}

            {/* Main Content Listing */}
            {!fetchError && (
              <CompanyList
                companies={companies}
                loading={isFetching}
                onEdit={handleOpenEditModal}
                onDelete={handleDelete}
                isDeleting={isDeleting}
              />
            )}
          </div>
        </div>
      </div>

      {/* Create/Edit Form Modal */}
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingCompany(undefined);
          }}
          title={editingCompany ? `Edit Company: ${editingCompany.name}` : "Register New Company"}
          maxWidth="lg"
        >
          <CompanyForm
            initialData={editingCompany}
            onSubmit={handleFormSubmit}
            isSubmitting={isCreating || isUpdating}
          />
        </Modal>
      )}

      {/* Global Action Loader Backdrop */}
      {isAnyLoading && (
        <div className="fixed inset-0 bg-black/10 backdrop-blur-sm z-[110] flex items-center justify-center">
          <div className="bg-white px-8 py-5 rounded-2xl shadow-2xl flex items-center gap-3 border border-gray-100">
            <div className="w-8 h-8 border-4 border-[#3668FF] border-t-transparent rounded-full animate-spin"></div>
            <span className="text-base font-semibold text-gray-700">
              Processing, please wait...
            </span>
          </div>
        </div>
      )}
    </>
  );
}
