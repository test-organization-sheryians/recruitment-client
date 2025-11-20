"use client";
import React, { useState } from 'react';
import { FiEdit, FiTrash2 } from 'react-icons/fi';
import { useQueryClient } from '@tanstack/react-query';
import AddCategory from './component/AddCategory';
import {
  useGetJobCategories,
  useDeleteJobCategory,
  useUpdateJobCategory
} from './hooks/useJobCategoryApi';

const CategoriesBox = () => {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: categories = [], isLoading, isError, error } = useGetJobCategories();

  const { mutate: deleteCategory } = useDeleteJobCategory();

  
  const { mutate: updateCategory } = useUpdateJobCategory();

  const handleEdit = async (cat: any) => {
    if (!cat?._id) return alert("Category id missing");

    const newName = prompt("Enter new category name", cat.name);
    if (!newName || newName.trim() === "") return;

    updateCategory(
      { id: cat._id, name: newName.trim() },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["jobCategories"] });
        },
        onError: (err: any) => {
          alert(err?.response?.data?.message || "Error updating category");
        },
      }
    );
  };

  const handleDelete = (cat: any) => {
    if (!cat?._id) return alert("Category id missing");

    const confirmDelete = confirm(`Delete category "${cat.name}"?`);
    if (!confirmDelete) return;

    deleteCategory(cat._id, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["jobCategories"] });
      },
      onError: (err: any) => {
        alert(err?.response?.data?.message || "Error deleting category");
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
            Failed to load categories: {(error as any)?.message || 'Unknown error'}
          </div>
        )}

       
        {!isLoading && !isError && (
          <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 p-2'>
            {categories.length === 0 && (
              <div className='col-span-full text-sm text-gray-500'>No categories found.</div>
            )}

            {categories.map((cat: any) => (
              <div
                key={cat._id || cat.name}
                className='flex items-center justify-between bg-gray-50 border rounded-md p-3 hover:shadow-sm transition-shadow'
              >
                <div className='text-sm font-medium'>{cat.name || cat}</div>
                <div className='flex items-center gap-2'>
                  <button
                    title={`Edit ${cat.name || cat}`}
                    aria-label={`Edit ${cat.name || cat}`}
                    className='p-1 rounded text-gray-600 hover:text-blue-600 transition-colors'
                    onClick={() => handleEdit(cat)}
                  >
                    <FiEdit className='w-4 h-4' />
                  </button>

                  <button
                    title={`Delete ${cat.name || cat}`}
                    aria-label={`Delete ${cat.name || cat}`}
                    className='p-1 rounded text-gray-600 hover:text-red-600 transition-colors'
                    onClick={() => handleDelete(cat)}
                  >
                    <FiTrash2 className='w-4 h-4' />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {open && <AddCategory close={() => setOpen(false)} />}
    </div>
  );
};

export default CategoriesBox;