import React from 'react'
import SignupForm from '@/features/auth/components/SignupForm'

const page = () => {
  return (
    <div className="h-screen w-full bg-[#DCDCDC] overflow-hidden flex gap-3.5 p-5 font-[satoshi]">
      <div className="bg-white w-1/3 rounded-base overflow-hidden">
        <SignupForm />
      </div>
      <div className=" w-2/3 rounded-base bg-[url('/images/signimg2.webp')] bg-center bg-cover overflow-hidden"></div>
    </div>
  )
}

export default page
