import CreateProductForm from '@/features/product/components/ProductForm'

const page = () => {
  return (
    <div className='min-h-screen w-full flex items-center justify-center px-5'>
        <div className='max-w-md mx-auto p-6'>
        <CreateProductForm />
        </div>
    </div>
  )
}

export default page