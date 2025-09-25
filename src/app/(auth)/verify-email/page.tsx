import VerifyEmail from '@/features/auth/components/VerifyEmail'
import React from 'react'

const page = () => {
  return (
    <div className="h-screen w-full bg-[#DCDCDC] overflow-hidden flex gap-3.5 p-5 font-[satoshi]">
      <div className="bg-white w-1/3 rounded-base overflow-hidden">
        <VerifyEmail />
      </div>
      <div className=" w-2/3 rounded-base bg-[url('/images/verify_email.webp')] bg-center bg-cover overflow-hidden"></div>
    </div>
  )
}

export default page
