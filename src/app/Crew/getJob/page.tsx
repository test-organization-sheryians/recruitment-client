import Jobs from '@/features/job-management/components/GetJob'
import ScreeningQuestions from "@/features/job-management/components/ScreeningQuestion"
import React from 'react'

const page = () => {
  return (
    <div>
      <Jobs />
      <ScreeningQuestions />
    </div>
  )
}
export default page
