import React from 'react'
import { useForm } from 'react-hook-form';
import { useUpdateProduct } from '../hooks/useUpdateProduct';
import { useQueryClient } from '@tanstack/react-query';

// Define all your props in one interface
interface EditProductProps {
  setEditData: (value: string) => void;
  editData: any; 
}

const EditProduct = ({ setEditData, editData }: EditProductProps) => {
    const queryClient = useQueryClient()
    const { mutate, isPending } = useUpdateProduct();
    const { register, handleSubmit, reset } = useForm()
    console.log(editData);
    const onSubmit = async (data: any) => {
        mutate({
            id: editData._id,
            data
        }, {
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ["products"] });
                setEditData("")
            }
        },) 
    }
  return (
    <div className='h-[30vw] w-[25vw] bg-black/90 text-white p-2 rounded-xl border-gray-400 border'>
     <h1 className="font-bold text-center text-red-500">Editing Product</h1>
     
          <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-2'>
              <label htmlFor="title">Title</label>
              <input type="text" className='border outline-0 px-4 py-1' value={editData.title} {...register("title")} />
              <label htmlFor="description">Description</label>
              <input type="text" className='border outline-0 px-4 py-1' placeholder={editData.description} {...register("description")} />
              <label htmlFor="price">Price</label>
              <input type="text" className='border outline-0 px-4 py-1' placeholder={editData.price} {...register("price")} />
            <input type="submit" className=' bg-gray-800 text-white px-3 py-1 rounded mt-5 bg-green-400' />
          </form>
     <button 
       onClick={() => setEditData("")} 
       className="mt-4 bg-gray-800 text-white px-3 py-1 rounded w-full bg-red-400"
     >
       Close
          </button>
          
    </div>
  )
}

export default EditProduct