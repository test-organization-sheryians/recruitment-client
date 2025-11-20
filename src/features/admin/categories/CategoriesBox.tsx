"use client";
import React, { useState } from 'react'
import { FiEdit, FiTrash2 } from 'react-icons/fi'
import { useQuery,useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/config/axios'
import AddCategory from './AddCategory';


const fetchCategories = async () => {
  const res = await api.get('/api/job-categories/')
  return res.data?.data || []

}


const CategoriesBox = () => {
  const [open, setOpen] = useState(false);


  const queryClient = useQueryClient();
  
  // DELETE
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return await api.delete(`/api/job-categories/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobCategories"] });
    },
  });
  
  const updateMutation = useMutation({
    mutationFn: async ({ id, name }: { id: string; name: string }) => {
      return await api.put(`/api/job-categories/${id}`, { name });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobCategories"] });
    },
  });

  const { data: categories = [], isLoading, isError, error } = useQuery<any[], Error>({
    queryKey: ['jobCategories'],
    queryFn: fetchCategories,
  })

  const handleEdit = async (cat: any) => {
  if (!cat?._id) return alert("Category id missing");

  const newName = prompt("Enter new category name", cat.name);
  if (!newName || newName.trim() === "") return;

  updateMutation.mutate({ id: cat._id, name: newName.trim() });
  };


  const handleDelete = (cat: any) => {
  if (!cat?._id) return alert("Category id missing");

  const confirmDelete = confirm(`Delete category "${cat.name}"?`);
  if (!confirmDelete) return;

  deleteMutation.mutate(cat._id);
};


  return (

    <div className='h-auto w-full p-4 bg-white border border-gray300 rounded-md shadow-sm'>
      <div className='border rounded-md p-4'>
        <div className='flex items-center justify-between border-b pb-4 mb-4'>
          <h1 className='font-bold text-2xl'>Job Category</h1>
          <button onClick={()=>setOpen(true)} className='py-2 px-4 bg-blue-600 border rounded-md text-white font-semibold' > + Add New Category</button>
        </div>

        
        {isLoading && (
          <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 p-2'>
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className='h-12 bg-gray-100 animate-pulse rounded-md' />
            ))}
          </div>
        )}

        
        {isError && (
          <div className='p-4 text-sm text-red-600'>
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
                    className='p-1 rounded text-gray-600 hover:text-blue-600'
                    onClick={() => handleEdit(cat)}
                  >
                    <FiEdit className='w-4 h-4' />
                  </button>

                  <button
                    title={`Delete ${cat.name || cat}`}
                    aria-label={`Delete ${cat.name || cat}`}
                    className='p-1 rounded text-gray-600 hover:text-red-600'
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
  )
}

export default CategoriesBox