"use client";

import { useState } from "react";
import { useExtractResume } from "../features/hooks/resumeExtract";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const UploadResume = () => {
    const [file, setFile] = useState<File | null>(null);
    const [result, setResult] = useState<any>(null);

    const { mutate: extract, isPending, error } = useExtractResume();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile && selectedFile.type === "application/pdf") {
            setFile(selectedFile);
        } else {
            alert("Please select a PDF file");
        }
    };

    const handleExtract = () => {
        if (!file) return;
        extract(file, {
            onSuccess: (data) => {
                setResult(data);
            },
        });
    };

    const handleDownload = () => {
        if (!result) return;
        const dataStr = JSON.stringify(result.data, null, 2);
        const dataBlob = new Blob([dataStr], { type: "application/pdf" });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "extracted_resume.pdf";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Upload and Extract Resume</h2>
            <div className="mb-4">
                <Input
                    type="file"
                    accept=".pdf"
                    onChange={handleFileChange}
                    className="mb-2"
                />
                <Button
                    onClick={handleExtract}
                    disabled={!file || isPending}
                    className="w-full"
                >
                    {isPending ? "Extracting..." : "Extract Resume"}
                </Button>
            </div>
            {error && <p className="text-red-500">{error.message}</p>}
            {result && (
                <div className="mt-4">
                    <h3 className="text-lg font-semibold">Extracted Data:</h3>
                    <pre className="bg-gray-100 p-2 rounded mt-2">
                        {JSON.stringify(result, null, 2)}
                    </pre>
                    <Button
                        onClick={handleDownload}
                        className="mt-4 bg-amber-700 text-white hover:bg-amber-800 z-[]"
                    >
                        Download Extracted Resume
                    </Button>
                </div>
            )}
        </div>
    );
};