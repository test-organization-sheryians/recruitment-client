"use client";
import { useState } from "react";

export default function ResumeUploader() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setText("");
    setError("");

    if (file.type !== "application/pdf") {
      setError("Only PDF files are allowed");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError("File size must be less than 10MB");
      return;
    }

    setLoading(true);
    try {
      const arrayBuffer = await file.arrayBuffer();

      const res = await fetch("/api/parse-resume", {
        method: "POST",
        body: arrayBuffer,
      });

      const data = await res.json();

      // hit API to backend from the below line

      if (!res.ok) {
        throw new Error(data.error || "Failed to parse PDF");
      }

      setText(data.text);
    } catch (err) {
      console.error("Upload error:", err);
      const errorMessage = err instanceof Error ? err.message : "Failed to parse PDF";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setText("");
    setError("");
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput) fileInput.value = "";
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-semibold text-center mb-4">resume dalo</h2>

      <div className="mb-4">
        <label htmlFor="resume-upload" className="sr-only">
          Upload PDF Resume
        </label>
        <input
          id="resume-upload"
          type="file"
          accept=".pdf"
          onChange={handleFile}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          disabled={loading}
          aria-describedby="file-requirements"
        />
        <div id="file-requirements" className="text-xs text-gray-500 mt-1">
          Accepts PDF files only, maximum size 10MB
        </div>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mr-2"></div>
          <p className="text-blue-500">Extracting text from PDF...</p>
        </div>
      )}

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {text && (
        <div className="mt-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold">Extracted Text:</h3>
            <button
              onClick={handleClear}
              className="px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded"
              aria-label="Clear extracted text"
            >
              Clear
            </button>
          </div>
          <pre 
            className="p-4 bg-gray-100 rounded h-64 overflow-y-auto whitespace-pre-wrap text-sm border"
            aria-live="polite"
            aria-atomic="true"
          >
            {text}
          </pre>
        </div>
      )}
    </div>
  );
}