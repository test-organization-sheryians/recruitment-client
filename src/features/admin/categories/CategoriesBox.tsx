import React from 'react'
import { FiEdit,FiTrash2 } from 'react-icons/fi'

const CategoriesBox = () => {
  const categories = [
    'Finance',
    'Marketing',
    'Engineering',
    'Human Resources',
    'Sales',
    'Product',
    'Customer Support',
    'Design',
    'Data Science',
    'Operations',
    'Legal',
    'IT & Security',
  ]

  return (
    <div className='h-auto w-full p-4 bg-white border border-gray300 rounded-md shadow-sm'>
      <div className='border rounded-md p-4'>
        <div className='flex items-center justify-between border-b pb-4 mb-4'>
          <h1 className='font-bold text-2xl'>Job Category</h1>
          <button className='py-2 px-4 bg-blue-600 border rounded-md text-white font-semibold'> + Add New Category</button>
        </div>

        {/* Categories grid */}
        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 p-2'>
          {categories.map((cat) => (
            <div
              key={cat}
              className='flex items-center justify-between bg-gray-50 border rounded-md p-3 hover:shadow-sm transition-shadow'
            >
              <div className='text-sm font-medium'>{cat}</div>
              <div className='flex gap-2'>
                <button className='text-xs text-gray-500 hover:text-gray-700'>Edit</button>
                <div className='text-xs text-gray-500 hover:text-gray-700'>Del</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default CategoriesBox