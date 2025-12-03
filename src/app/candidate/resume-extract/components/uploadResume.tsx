"use client";

import { useState } from "react";
import { useExtractResume } from "../features/hooks/resumeExtract";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UploadCloud, Loader2 } from "lucide-react";
import { ResumeDownloadButtons } from "./ResumeDownloadButtons";
import { Result } from "../types/resume";
import { uploadFileToS3 } from "@/lib/uploadFile";
import { generatePDF } from "./generatePdf";


export const UploadResume = () => {
    const [file, setFile] = useState<File | null>(null);
    const [result, setResult] = useState<Result>({});
    const [s3Url, setS3Url] = useState<string>("");

    const { mutate: extract, isPending, error } = useExtractResume();

    const handleFileChange = (file: File) => {
        if (file.type !== "application/pdf") {
            alert("Please upload a PDF file");
            return;
        }
        setFile(file);
        setResult({});
    };

    const handleExtract = async () => {
        if (!file) return;
        extract(file, {
            onSuccess: async (data) => {
                try {
                    const pdfBytes = await generatePDF(data);
                    if (!pdfBytes) return;

                    const pdfFile = new File([pdfBytes], `resume-${Date.now()}.pdf`, {
                        type: "application/pdf",
                    });
                    const url = await uploadFileToS3(pdfFile);
                    setS3Url(url);
                    setResult(data);
                    console.log("PDF generated and uploaded successfully:", url);
                    
                } catch (err) {
                    console.error("Error generating PDF:", err);
                }
            },
        });
    };

    return (
        <div className="max-w-4xl mx-auto p-8 bg-white rounded-xl shadow border">
            <h1 className="text-3xl font-bold text-center mb-4">Resume Parser</h1>

            {/* Upload area */}
            <div
                className="border-2 border-dashed rounded-xl p-8 text-center border-gray-300 bg-gray-50"
            >
                <UploadCloud className="h-10 w-10 text-gray-500 mx-auto" />

                <p className="mt-2 text-gray-600 text-sm">
                    Drag & drop your PDF here, or{" "}
                    <label className="text-blue-600 cursor-pointer font-medium">
                        browse
                        <Input
                            type="file"
                            accept="application/pdf"
                            className="hidden"
                            onChange={(e) => {
                                const f = e.target.files?.[0];
                                if (f) handleFileChange(f);
                            }}
                        />
                    </label>
                </p>
            </div>

            {/* File preview */}
            {file && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md flex justify-between">
                    <div>
                        <p className="text-sm font-medium">{file.name}</p>
                    </div>
                    <button className="text-red-600" onClick={() => setFile(null)}>
                        Remove
                    </button>
                </div>
            )}

            <Button
                onClick={handleExtract}
                disabled={!file || isPending}
                className="w-full mt-4"
            >
                {isPending ? (
                    <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" /> Extracting...
                    </>
                ) : (
                    "Extract Information"
                )}
            </Button>

            {/* Error */}
            {error && (
                <p className="mt-4 text-red-600 text-sm">{error.message}</p>
            )}

            {/* Results */}
            {s3Url && (
                <div className="mt-6 bg-gray-50 p-4 rounded-lg border">
                    <h3 className="text-lg font-semibold mb-2">Uploaded Resume PDF</h3>
                    <a href={s3Url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline break-all">
                        {s3Url}
                    </a>
                </div>
            )}
        </div>
    );
};
