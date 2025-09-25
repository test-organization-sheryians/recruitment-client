import PasswordReset from '@/features/auth/components/PasswordReset';
import React from 'react'
import PasswordResetOTP from '../../../features/auth/components/PasswordResetOtpInput';

const page = () => {
  return (
    <div>
      <div className="h-screen w-full bg-[#DCDCDC] overflow-hidden flex gap-3.5 p-5 font-[satoshi]">
        <div className="bg-white w-1/3 rounded-base overflow-hidden">
          {/* <PasswordReset />  */}
          <PasswordResetOTP />
        </div>
        <div className=" w-2/3 rounded-base bg-[url('/images/forgotpass.png')] bg-center bg-cover overflow-hidden"></div>
      </div>
    </div>
  );
}

export default page
