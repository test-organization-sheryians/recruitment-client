"use client"
import ViewProduct from '@/features/products/components/viewProduct'
import { useParams } from 'next/navigation';


const page = () => {
    const { id } = useParams()
  return (
      <ViewProduct id={id} />
  )
}

export default page
