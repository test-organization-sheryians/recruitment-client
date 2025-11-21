"use client";
import React, { useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import AddCategory from './components/AddCategory';
import CategoryCard from './components/CategoryCard';
import {
  useGetJobCategories,
  useDeleteJobCategory,
  useUpdateJobCategory
} from './hooks/useJobCategoryApi';
import { JobCategory, CategoryError } from '../../../types/JobCategeory';
import { useToast } from '../../../components/ui/Toast';

const CategoriesBox = () => {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const { success, error: showError } = useToast();

  const { data: categories = [], isLoading, isError, error } = useGetJobCategories();

  const {
    mutate: deleteCategory,
    isPending: isDeleting,
    error: deleteError
  } = useDeleteJobCategory();

  const {
    mutate: updateCategory,
    isPending: isUpdating,
    error: updateError
  } = useUpdateJobCategory();

  // Show error toasts when mutations fail
  useEffect(() => {
    if (deleteError) {
      showError((deleteError as CategoryError)?.response?.data?.message || "Failed to delete category");
    }
    if (updateError) {
      showError((updateError as CategoryError)?.response?.data?.message || "Failed to update category");
    }
  }, [deleteError, updateError, showError]);

  const handleUpdate = (data: { id: string; name: string }) => {
    updateCategory(
      data,
      {
        onSuccess: () => {
          success("Category updated successfully!");
          queryClient.invalidateQueries({ queryKey: ["jobCategories"] });
        },
      }
    );
  };

  const handleDelete = (id: string) => {
    deleteCategory(id, {
      onSuccess: () => {
        success("Category deleted successfully!");
        queryClient.invalidateQueries({ queryKey: ["jobCategories"] });
      },
    });
  };

  return (
    <div className='h-auto w-full p-4 bg-white border border-gray300 rounded-md shadow-sm'>
      <div className='border rounded-md p-4'>
        <div className='flex items-center justify-between border-b pb-4 mb-4'>
          <h1 className='font-bold text-2xl'>Job Category</h1>
          <button
            onClick={() => setOpen(true)}
            className='py-2 px-4 bg-blue-600 border rounded-md text-white font-semibold hover:bg-blue-700 transition-colors'
          >
            + Add New Category
          </button>
        </div>

        {isLoading && (
          <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 p-2'>
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className='h-12 bg-gray-100 animate-pulse rounded-md' />
            ))}
          </div>
        )}

        {isError && (
          <div className='p-4 text-sm text-red-600 bg-red-50 rounded-md'>
            Failed to load categories: {(error as CategoryError)?.message || 'Unknown error'}
          </div>
        )}

        {!isLoading && !isError && (
          <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 p-2'>
            {categories.length === 0 && (
              <div className='col-span-full text-sm text-gray-500'>No categories found.</div>
            )}

            {categories.map((cat: JobCategory) => (
              <CategoryCard
                key={cat._id || cat.name}
                category={cat}
                onDelete={handleDelete}
                onUpdate={handleUpdate}
                isDeleting={isDeleting}
              />
            ))}
          </div>
        )}
      </div>
      {open && <AddCategory close={() => setOpen(false)} />}
    </div>
  );
};

export default CategoriesBox;