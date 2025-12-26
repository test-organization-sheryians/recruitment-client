<<<<<<< HEAD
import ApplicantsList from '@/features/admin/jobApplicant/component/ApplicationLists'
import React from 'react'

function page() {
  return (
   <ApplicantsList width={1180}/>  )
}

export default page
=======
"use client";

import ApplicantsList from "@/features/admin/jobApplicant/component/ApplicationLists";
import { useParams } from "next/navigation";

export default function ApplicantsPage() {
    const params = useParams();
    const id = params.id as string;

    return (
        <div style={{ padding: 20 }}>
            {/* <h1>Applicants Page</h1> */}
            {/* <p>Job ID: {id}</p> */}
            <ApplicantsList />
        </div>
    );
}

>>>>>>> 052aaa9e5bdfd3cb1cbe6dac7d9c6ea8ec25d984
