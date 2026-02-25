import NotFound from '@/app/not-found'
import Jobs from '@/features/job-management/components/GetJob'
import ScreeningQuestions from "@/features/job-management/components/ScreeningQuestion"
import React from 'react'

const page = () => {
  return (
    <div>
      {/* <Jobs /> */}
      {/* <ScreeningQuestions /> */}
      <NotFound/>
    </div>
  )
}
export default page
