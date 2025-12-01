"use client";

import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { generatePDF } from "./generatePdf";

interface Education {
  degree: string;
  institution: string;
  start_date: string;
  end_date: string;
}
interface Experience {
  job_title: string;
  company: string;
  start_date: string;
  end_date: string;
  responsibilities?: string[];
}
interface Skills {
  technical_skills?: string[];
  programming_languages?: string[];
  tools?: string[];
}
interface Certification {
  name: string;
  issuer: string;
  date_issued: string;
}
interface Project {
  name: string;
  description: string;
  technologies?: string[];
}
interface ResumeData {
  education?: Education[];
  experience?: Experience[];
  skills?: Skills;
  certifications?: Certification[];
  projects?: Project[];
}
interface Result {
  data?: ResumeData;
}

export const ResumeDownloadButtons = ({ result }: { result: Result }) => {
    return (
        <div className="flex justify-end gap-3 mt-4">
            <Button
                variant="outline"
                onClick={() =>
                    navigator.clipboard.writeText(JSON.stringify(result.data, null, 2))
                }>     
                Copy JSON
            </Button>

            <Button
                variant="outline"
                onClick={() => {
                    const blob = new Blob(
                        [JSON.stringify(result.data, null, 2)],
                        { type: "application/json" }
                    );
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = "resume-data.json";
                    a.click();
                }}
            >
                <Download className="mr-2 h-4 w-4" />
                Download JSON
            </Button>

            <Button className="bg-green-600 text-white" onClick={() => generatePDF(result)}>
                <Download className="mr-2 h-4 w-4" />
                Download PDF
            </Button>
        </div>
    );
};
