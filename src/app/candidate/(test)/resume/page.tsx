"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Upload, Loader2 } from "lucide-react";

export default function ResumeUploadPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError("");

    if (file.type !== "application/pdf") {
      setError("Only PDF files allowed");
      return;
    }

    const formData = new FormData();
    formData.append("resume", file);

    try {
      setLoading(true);

      const res = await fetch("/api/ai/questionset", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Upload failed");

      // 🔥 DIRECT REDIRECT TO INTERVIEW PAGE AFTER SUCCESS
      router.push(`/interview/${data.setId}`);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-20 bg-white p-8 shadow-xl rounded-2xl border">
      <h1 className="text-2xl font-bold text-center mb-6">
        Upload Your Resume
      </h1>

      <label className="border-2 border-dashed p-8 rounded-xl flex flex-col items-center gap-3 hover:border-blue-500 cursor-pointer bg-gray-50">
        <Upload className="text-blue-600" size={36} />
        <span className="font-medium text-gray-700">
          Click to upload PDF
        </span>
        <input
          type="file"
          accept="application/pdf"
          className="hidden"
          onChange={handleFile}
        />
      </label>

      {loading && (
        <div className="flex items-center justify-center mt-4 gap-2 text-blue-600">
          <Loader2 className="animate-spin" /> Processing…
        </div>
      )}

      {error && <p className="mt-4 text-red-600 text-center">{error}</p>}
    </div>
  );
}
