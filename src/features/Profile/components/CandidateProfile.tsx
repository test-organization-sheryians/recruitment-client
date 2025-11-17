"use client";

import { useState } from "react";
import EditSection from "./EditSection"; // ← using the new component
import { Button } from "@/components/ui/button";

export default function CandidateProfile() {
  // Personal info
  const [firstName, setFirstName] = useState("Candidate");
  const [lastName, setLastName] = useState("Name");
  const [phone, setPhone] = useState("867643885");
  const [email] = useState("xyz@mail.com"); // email not editable

  // Skills
  const [skills, setSkills] = useState(["React", "Node.js"]);

  // Experience
  const [experience, setExperience] = useState([
    "Frontend Intern – ABC Company (2023)",
  ]);

  // Socials
  const [linkedin, setLinkedin] = useState("");
  const [github, setGithub] = useState("");

  const [resume, setResume] = useState<File | null>(null);

  return (
    <div className="w-full min-h-screen bg-gray-100 flex justify-center p-6">
      <div className="max-w-3xl w-full space-y-6">
        
        {/* Profile Header */}
        <div className="bg-white rounded-xl border shadow-sm p-6 flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-blue-500 text-white font-bold flex items-center justify-center text-2xl">
            {firstName.charAt(0)}
          </div>
          <div>
            <h2 className="text-lg font-semibold">
              {firstName} {lastName}
            </h2>
            <p className="text-sm text-gray-500">Fresher</p>
          </div>
        </div>

        {/* PERSONAL INFO */}
        <div className="bg-white rounded-xl border shadow-sm p-6 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-gray-700">Personal Information</h3>

            <EditSection
              title="Personal Information"
              fields={[
                { key: "firstName", label: "First Name", value: firstName },
                { key: "lastName", label: "Last Name", value: lastName },
                { key: "phone", label: "Phone Number", value: phone },
                { key: "email", label: "Email Address", value: email, disabled: true },
              ]}
              onSave={(updated) => {
                setFirstName(updated.firstName);
                setLastName(updated.lastName);
                setPhone(updated.phone);
              }}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <p><span className="text-xs text-gray-500">First Name:</span> {firstName}</p>
            <p><span className="text-xs text-gray-500">Last Name:</span> {lastName}</p>
            <p><span className="text-xs text-gray-500">Phone:</span> {phone}</p>
            <p><span className="text-xs text-gray-500">Email:</span> {email}</p>
          </div>
        </div>

        {/* SKILLS */}
        <div className="bg-white rounded-xl border shadow-sm p-6 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-gray-700">Skills</h3>

            <EditSection
              title="Skills"
              fields={skills.map((s, i) => ({
                key: String(i),
                label: `Skill ${i + 1}`,
                value: s,
              }))}
              onSave={(updated) => {
                const arr = Object.values(updated);
                setSkills(arr);
              }}
            />
          </div>

          <ul className="list-disc pl-5">
            {skills.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </div>

        {/* EXPERIENCE */}
        <div className="bg-white rounded-xl border shadow-sm p-6 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-gray-700">Experience</h3>

            <EditSection
              title="Experience"
              fields={experience.map((exp, i) => ({
                key: String(i),
                label: `Experience ${i + 1}`,
                value: exp,
              }))}
              onSave={(updated) => {
                const arr = Object.values(updated);
                setExperience(arr);
              }}
            />
          </div>

          <ul className="list-disc pl-5">
            {experience.map((exp) => (
              <li key={exp}>{exp}</li>
            ))}
          </ul>
        </div>

        {/* RESUME */}
        <div className="bg-white rounded-xl border shadow-sm p-6 space-y-4">
          <h3 className="font-semibold text-gray-700">Resume</h3>

          <label className="border rounded-lg h-20 flex items-center justify-center text-gray-500 cursor-pointer">
            <input
              type="file"
              className="hidden"
              onChange={(e) => setResume(e.target.files?.[0] || null)}
            />
            {resume ? resume.name : "📝 Upload Resume"}
          </label>
        </div>

        {/* SOCIALS */}
        <div className="bg-white rounded-xl border shadow-sm p-6 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-gray-700">Socials</h3>

            <EditSection
              title="Social Links"
              fields={[
                { key: "linkedin", label: "LinkedIn", value: linkedin },
                { key: "github", label: "GitHub", value: github },
              ]}
              onSave={(updated) => {
                setLinkedin(updated.linkedin);
                setGithub(updated.github);
              }}
            />
          </div>

          <p>LinkedIn: {linkedin}</p>
          <p>GitHub: {github}</p>
        </div>

      </div>
    </div>
  );
}
