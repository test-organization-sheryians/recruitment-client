"use client";
import { useEffect, useState } from "react";
import { FileUp } from "lucide-react";
import dynamic from 'next/dynamic';
import axios from '@/config/axios'

// Dynamically import the ResumeChat component with SSR disabled
const ResumeChat = dynamic(
  () => import('@/features/AITest/components/ResumeChat'),
  { ssr: false }
);

interface Question {
  id: string;
  question: string;
  topics: string[];
  constraints: string;
  testCases: Array<{
    input: string;
    output: string;
  }>;
  explanation: string;
}

const ResumeUpload = () => {
  const [resume, setResume] = useState<File | null>(null);
  const [fileUploaded, setFileUploaded] = useState(0);
  const [resumeUploaded, setResumeUploaded] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      if (resumeUploaded && resume) {
        try {
          setLoading(true);
          setError(null);

          const formData = new FormData();
          formData.append('pdf', resume);

          const response = await axios.post('/api/ai/questionset', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            }
          });

          console.log('Full response:', response.data);

          if (!response.data.success) {
            throw new Error('Failed to fetch questions');
          }

          let questionsData;

          if (Array.isArray(response.data.questions)) {
            questionsData = response.data.questions;
          } else if (response.data.questions?.questionsData) {
            questionsData = response.data.questions.questionsData;
          } else {
            console.warn('No questions data available:', response.data.questions);
            setError('No questions generated. Please try uploading a different resume.');
            return;
          }

          if (!Array.isArray(questionsData) || questionsData.length === 0) {
            setError('No questions were generated from your resume. Please try again.');
            return;
          }

          setQuestions(questionsData);
        } catch (err) {
          console.error('Error fetching questions:', err);
          setError('Failed to fetch questions');
        } finally {
          setLoading(false);
        }
      }
    }
    fetchQuestions();
  }, [resumeUploaded, resume])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setResume(file);
      // Simulate file upload progress
      let progress = 0;
      const interval = setInterval(() => {
        progress += 5;
        setFileUploaded(progress);
        if (progress >= 100) {
          clearInterval(interval);
          setTimeout(() => setResumeUploaded(true), 500);
        }
      }, 100);
    }
  };

  if (!resumeUploaded) {
    return (
      <div className="w-full h-full flex items-center justify-center p-4">
        <div className="max-w-2xl w-full">
          <h2 className="text-4xl font-medium text-center mb-8">Resume Upload</h2>

          <div className="w-full">
            <label htmlFor="resume" className="w-full">
              <div className="bg-[#E9EFF7] border-dashed border-3 border-[#1270B0] w-full aspect-5/2 rounded-lg flex flex-col gap-2 items-center justify-center cursor-pointer hover:bg-[#E0E8F0] transition-colors">
                <div>
                  <FileUp size={80} className="text-zinc-500" />
                </div>
                <p className="text-zinc-600">
                  Drag and drop or <span className="text-[#1270B0] font-medium">browse</span> your files
                </p>
                <p className="text-sm text-zinc-500 mt-2">PDF, DOCX, or TXT (max 5MB)</p>
              </div>
            </label>
            <input
              type="file"
              id="resume"
              className="hidden"
              onChange={handleFileChange}
              accept=".pdf,.docx,.txt"
            />
          </div>

          {resume && (
            <div className="mt-6 border-2 border-[#1270B0] p-4 rounded-lg bg-white shadow-sm">
              <div className="flex justify-between items-center mb-2">
                <p className="font-medium">{resume.name}</p>
                <span className="text-sm text-gray-500">{fileUploaded}%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2.5">
                <div
                  className="bg-[#4C62ED] h-2.5 rounded-full transition-all duration-300"
                  style={{ width: `${fileUploaded}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col">
      <div className="sticky top-0 z-10 bg-white border-b p-6">
        <h2 className="text-2xl font-semibold">AI Assistant</h2>
      </div>
      <div className="flex-1 overflow-auto p-6">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <ResumeChat questions={questions} resumeFile={resume} error={error} />
        )}
      </div>
    </div>
  );
}
export default ResumeUpload;
