"use client";
import React, { useState } from "react";
import { FileUp } from "lucide-react";

const ResumeUpload = () => {
  const [resume, setResume] = useState<File | null>(null);
  const fileUploaded = 60;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setResume(file);
    }
  };

  return (
    <div className=" w-full h-full grid place-items-center p-4">
      <div className="flex flex-col gap-4 ">
        <h2 className="text-4xl font-medium text-center mb-5">Resume Upload</h2>

        <div className="w-lg">
          <label htmlFor="resume" className="w-full">
            <div className=" bg-[#E9EFF7] border-dashed border-3 border-[#1270B0] w-full aspect-5/2 rounded-lg flex flex-col gap-2 items-center justify-center">
              <div>
                <FileUp size={80} className="text-zinc-500" />
              </div>
              <p className="text-zinc-500">
                Drag and drop or <span className="text-[#1270B0]">browse</span>{" "}
                your files
              </p>
            </div>
          </label>
          <input
            type="file"
            id="resume"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>

        <div className="border-3 border-[#1270B0] px-4 py-2 rounded-lg">
          <p>tarunResume.pdf</p>
          <div className="flex items-center justify-between gap-5 rounded-full">
            <div className="w-full bg-zinc-100 rounded-full">
              <div
                className={` h-2 bg-[#4C62ED] rounded-full`}
                style={{ width: `${fileUploaded}%` }}
              ></div>
            </div>
            <p>{fileUploaded}%</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeUpload;
