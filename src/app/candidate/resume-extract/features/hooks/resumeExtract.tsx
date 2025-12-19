import { useMutation } from "@tanstack/react-query";
import { extractResume } from "@/api/resumeExtract";

export const parseResume = async (file: File) => {
    const res = await fetch("/api/parse-resume", {
        method: "POST",
        body: file
    })

    const data = await res.json();
    if (!data.text) {
        throw new Error(data.error || "Failed to parse resume");
    }

    return data.text;
}

export const extractResumeData = async (file: File) => {
    // First parse the PDF
    const parsedText = await parseResume(file);

    // Then extract structured data via AI
    const extractedData = await extractResume(parsedText);

    return extractedData;
}

export const useParseResume = () => {
    return useMutation({
        mutationFn: parseResume,
    });
};

export const useExtractResume = () => {
    return useMutation({
        mutationFn: extractResumeData,
    });
};