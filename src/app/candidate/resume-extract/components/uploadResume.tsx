"use client";

import { useState } from "react";
import { useExtractResume } from "../features/hooks/resumeExtract";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UploadCloud, Loader2 } from "lucide-react";
import { ResumeDownloadButtons } from "./ResumeDownloadButtons";

export const UploadResume = () => {
    const [file, setFile] = useState<File | null>(null);
    const [result, setResult] = useState<any>(null);

    const { mutate: extract, isPending, error } = useExtractResume();

    const handleFileChange = (file: File) => {
        if (file.type !== "application/pdf") {
            alert("Please upload a PDF file");
            return;
        }
        setFile(file);
        setResult(null);
    };

    const handleExtract = () => {
        if (!file) return;
        extract(file, {
            onSuccess: (data) => setResult(data),
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
            {result?.data && (
                <div className="mt-6 bg-gray-50 p-4 rounded-lg border">
                    <h3 className="text-lg font-semibold mb-2">Extracted JSON</h3>

                    <pre className="bg-black text-white p-3 rounded-md text-sm overflow-x-auto">
                        {JSON.stringify(result.data, null, 2)}
                    </pre>

                    <ResumeDownloadButtons result={result} />
                </div>
            )}
        </div>
    );
};
