"use client";

import ApplicantsList from "@/features/admin/jobApplicant/component/ApplicationLists";
import { useParams } from "next/navigation";

export default function ApplicantsPage() {
    const params = useParams();

    return (
        <div style={{ }}>
            {/* <h1>Applicants Page</h1> */}
            {/* <p>Job ID: {id}</p> */}
            <ApplicantsList />
        </div>
    );
}

