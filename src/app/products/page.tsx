"use client"
import FetchProducts from '@/features/products/components/fetchProducts'
import { useRouter } from 'next/navigation'

const Page = () => {
  const router = useRouter()

  return (
    <main className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header Section */}
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8 pb-6 border-b border-gray-200">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
              Product Inventory
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage and view all your current stock items.
            </p>
          </div>

          <button 
            onClick={() => router.push("/products/create")}
            className="inline-flex items-center justify-center px-5 py-2.5 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            <span className="mr-2">+</span> Create Product
          </button>
        </header>

        {/* Content Section */}
        <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <FetchProducts />
        </section>
      </div>
    </main>
  )
}

export default Page