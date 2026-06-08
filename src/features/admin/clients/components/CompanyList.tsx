"use client";

import React, { useState, useMemo } from "react";
import { FiSearch, FiFilter, FiBriefcase, FiXCircle } from "react-icons/fi";
import { Company } from "@/types/company";
import CompanyCard from "./CompanyCard";

interface CompanyListProps {
  companies: Company[];
  loading: boolean;
  onEdit: (company: Company) => void;
  onDelete: (id: string) => void;
  isDeleting?: boolean;
}

export default function CompanyList({
  companies,
  loading,
  onEdit,
  onDelete,
  isDeleting = false,
}: CompanyListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSize, setSelectedSize] = useState<string>("All");
  const [selectedStatus, setSelectedStatus] = useState<string>("All");

  const uniqueSizes = ["All", "1-10", "11-50", "51-200", "201-500", "501-1000", "1000+"];

  // Filter companies based on search term, size and status
  const filteredCompanies = useMemo(() => {
    return companies.filter((company) => {
      const matchesSearch =
        company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.industry.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.description.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesSize = selectedSize === "All" || company.companySize === selectedSize;

      const matchesStatus =
        selectedStatus === "All" ||
        (selectedStatus === "Active" && company.isActive) ||
        (selectedStatus === "Inactive" && !company.isActive);

      return matchesSearch && matchesSize && matchesStatus;
    });
  }, [companies, searchTerm, selectedSize, selectedStatus]);

  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedSize("All");
    setSelectedStatus("All");
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-12">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="bg-white rounded-2xl border border-gray-100 p-6 flex flex-col space-y-4 animate-pulse"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gray-200" />
              <div className="space-y-2 flex-grow">
                <div className="h-4 bg-gray-200 rounded w-2/3" />
                <div className="h-3 bg-gray-100 rounded w-1/3" />
              </div>
            </div>
            <div className="h-16 bg-gray-100 rounded w-full" />
            <div className="space-y-2">
              <div className="h-3 bg-gray-100 rounded w-1/2" />
              <div className="h-3 bg-gray-100 rounded w-1/3" />
            </div>
            <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
              <div className="h-4 bg-gray-200 rounded w-1/4" />
              <div className="flex gap-2">
                <div className="w-8 h-8 rounded-lg bg-gray-100" />
                <div className="w-8 h-8 rounded-lg bg-gray-100" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search and Filters Header */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
        <div className="relative flex-grow max-w-md">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, industry, location..."
            className="w-full pl-11 pr-4 py-2.5 bg-white border border-[#DDE6F5] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#3668FF]/30 focus:border-[#3668FF] transition-all"
          />
        </div>

        <div className="flex flex-wrap gap-3 items-center">
          <div className="flex items-center gap-2">
            <FiFilter className="text-gray-500" size={16} />
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Filters:
            </span>
          </div>

          {/* Size Filter */}
          <select
            value={selectedSize}
            onChange={(e) => setSelectedSize(e.target.value)}
            className="px-3 py-2 bg-white border border-[#DDE6F5] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#3668FF]/30 text-gray-750"
          >
            <option value="All">All Sizes</option>
            {uniqueSizes.filter(s => s !== "All").map((size) => (
              <option key={size} value={size}>
                {size} employees
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 bg-white border border-[#DDE6F5] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#3668FF]/30 text-gray-750"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>

          {/* Reset Filters Button */}
          {(searchTerm || selectedSize !== "All" || selectedStatus !== "All") && (
            <button
              onClick={handleClearFilters}
              className="px-3 py-2 text-sm text-[#3668FF] hover:bg-[#EBF1FF] font-medium rounded-xl transition flex items-center gap-1.5"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Empty State */}
      {filteredCompanies.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-150 p-8 shadow-sm flex flex-col items-center justify-center">
          {searchTerm || selectedSize !== "All" || selectedStatus !== "All" ? (
            <>
              <FiXCircle className="text-gray-400 mb-4" size={48} />
              <h4 className="text-lg font-bold text-gray-800 mb-1">No matches found</h4>
              <p className="text-gray-500 text-sm max-w-sm">
                We couldn&apos;t find any companies matching your search filters. Try adjusting your search term or filters.
              </p>
              <button
                onClick={handleClearFilters}
                className="mt-4 px-4 py-2 bg-[#3668FF] text-white text-sm font-semibold rounded-xl hover:bg-[#254BAA] transition"
              >
                Clear All Filters
              </button>
            </>
          ) : (
            <>
              <FiBriefcase className="text-[#3668FF]/30 mb-4" size={56} />
              <h4 className="text-lg font-bold text-gray-800 mb-1">No companies registered yet</h4>
              <p className="text-gray-500 text-sm max-w-sm">
                Get started by adding your first client/company profile to link job openings.
              </p>
            </>
          )}
        </div>
      ) : (
        /* Companies Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCompanies.map((company) => (
            <CompanyCard
              key={company._id}
              company={company}
              onEdit={onEdit}
              onDelete={onDelete}
              isDeleting={isDeleting}
            />
          ))}
        </div>
      )}
    </div>
  );
}
