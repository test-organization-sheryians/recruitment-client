"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

export default function CandidateProfile() {
  const [skills, setSkills] = useState(["React", "Node.js"]);

  const addSkill = () => {
    setSkills([...skills, ""]);
  };

  return (
    <div className="w-full min-h-screen bg-gray-100 flex justify-center p-6">
      <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* LEFT SECTION */}
        <div className="lg:col-span-2 space-y-6">

          {/* Profile Header */}
          <div className="bg-white rounded-xl border shadow-sm p-6 flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-blue-500 text-white font-bold flex items-center justify-center text-2xl">
              C
            </div>

            <div>
              <h2 className="text-lg font-semibold">Candidate Name</h2>
              <p className="text-sm text-gray-500">Fresher</p>
            </div>
          </div>

          {/* Personal Information */}
          <div className="bg-white rounded-xl border shadow-sm p-6 space-y-4">
            <h3 className="font-semibold text-gray-700">Personal Information</h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500">First Name</p>
                <p className="font-medium">Candidate</p>
              </div>

              <div>
                <p className="text-xs text-gray-500">Last Name</p>
                <p className="font-medium">Name</p>
              </div>

              <div>
                <p className="text-xs text-gray-500">Phone Number</p>
                <p className="font-medium">867643885</p>
              </div>

              <div>
                <p className="text-xs text-gray-500">Email Address</p>
                <p className="font-medium">xyz@mail.com</p>
              </div>
            </div>
          </div>

          {/* Skills */}
          <div className="bg-white rounded-xl border shadow-sm p-6 space-y-4">
            <h3 className="font-semibold text-gray-700">Skills</h3>

            <div className="flex flex-wrap gap-3">
              {skills.map((skill, i) => (
                <div
                  key={i}
                  className="px-4 py-2 bg-gray-100 border rounded-full text-sm"
                >
                  {skill || "New Skill"}
                </div>
              ))}

              <button
                onClick={addSkill}
                className="w-8 h-8 rounded-full border flex items-center justify-center bg-gray-50 hover:bg-gray-100"
              >
                <Plus size={18} />
              </button>
            </div>
          </div>

        </div>

        {/* RIGHT SECTION */}
        <div className="space-y-6">

          {/* Experience */}
          <div className="bg-white rounded-xl border shadow-sm p-6">
            <h3 className="font-semibold text-gray-700 mb-3">Experience</h3>
            <div className="h-28 bg-gray-100 rounded-lg" />
          </div>

          {/* Resume */}
          <div className="bg-white rounded-xl border shadow-sm p-6">
            <h3 className="font-semibold text-gray-700 mb-3">Resume</h3>
            <div className="h-20 border rounded-lg flex items-center justify-center text-gray-400">
              📝 Upload Resume
            </div>
          </div>

          {/* Socials */}
          <div className="bg-white rounded-xl border shadow-sm p-6 space-y-4">
            <h3 className="font-semibold text-gray-700">Socials</h3>

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <p className="w-20 text-sm">LinkedIn</p>
                <input
                  type="text"
                  className="border rounded-lg px-3 py-2 flex-1"
                  placeholder="LinkedIn URL"
                />
              </div>

              <div className="flex items-center gap-3">
                <p className="w-20 text-sm">GitHub</p>
                <input
                  type="text"
                  className="border rounded-lg px-3 py-2 flex-1"
                  placeholder="GitHub URL"
                />
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
