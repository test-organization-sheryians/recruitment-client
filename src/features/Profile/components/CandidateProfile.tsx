"use client";

import { useEffect, useState } from "react";
import EditSection from "./EditSection";
import { Button } from "@/components/ui/button";
import { jwtDecode } from "jwt-decode";
import { useQueryClient } from "@tanstack/react-query";

import {
  useGetProfile,
  useUpdateProfile,
  usePatchProfile,
} from "../hooks/useProfileApi";

export default function CandidateProfile() {
  const [userId, setUserId] = useState<string>("");

  const queryClient = useQueryClient();

  // -------------------------------
  // LOAD USER ID FROM JWT
  // -------------------------------
  useEffect(() => {
    const token = document.cookie
      .split("; ")
      .find((r) => r.startsWith("access="))
      ?.split("=")[1];

    if (token) {
      const decoded: any = jwtDecode(token);
      setUserId(decoded.userId || decoded.id || decoded._id);
    }
  }, []);

  // -------------------------------
  // FETCH PROFILE
  // -------------------------------
  const { data, isLoading, isError } = useGetProfile(userId, {
    enabled: !!userId,
  });

  const updateProfile = useUpdateProfile();
  const patchProfile = usePatchProfile();

  // -------------------------------
  // LOCAL STATE
  // -------------------------------
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [experience, setExperience] = useState<any[]>([]);
  const [linkedin, setLinkedin] = useState("");
  const [github, setGithub] = useState("");
  const [resume, setResume] = useState<File | null>(null);

  // -------------------------------
  // LOAD DATA INTO STATE
  // -------------------------------
  useEffect(() => {
    if (!data) return;

    const profile = data.data;
    setFirstName(profile.user.firstName || "");
    setLastName(profile.user.lastName || "");
    setPhone(profile.user.phone || "");
    setEmail(profile.user.email || "");
    setSkills(profile.skills || []);
    setExperience(profile.experience || []);
    setLinkedin(profile.linkedin || "");
    setGithub(profile.github || "");
  }, [data]);

  // -------------------------------
  // LOADING / ERROR
  // -------------------------------
  if (!userId || isLoading)
    return (
      <div className="w-full h-screen grid place-items-center text-xl">
        Loading...
      </div>
    );

  if (isError)
    return (
      <div className="w-full h-screen grid place-items-center text-xl text-red-500">
        Error loading profile. Try again.
      </div>
    );

  // ===========================================================
  // ======================== UI START ========================
  // ===========================================================
  return (
    <div className="w-full min-h-screen bg-gray-100 flex justify-center p-6">
      <div className="max-w-3xl w-full space-y-6">

        {/* HEADER */}
        <div className="bg-blue-200 rounded-xl border shadow-sm p-6 flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-blue-500 text-white font-bold grid place-items-center text-4xl">
            {firstName.charAt(0) || "C"}
          </div>
          <div>
            <h2 className="text-2xl font-bold">{firstName} {lastName}</h2>
            <p className="text-m font-semibold text-gray-500">Fresher</p>
          </div>
        </div>

        {/* PERSONAL INFO */}
        <div className="bg-white rounded-xl border shadow-sm p-6 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-gray-700 text-lg">Personal Information</h3>

            <EditSection
              title="Personal Information"
              fields={[
                { key: "firstName", label: "First Name", value: firstName },
                { key: "lastName", label: "Last Name", value: lastName },
                { key: "phone", label: "Phone Number", value: phone },
                { key: "email", label: "Email", value: email, disabled: true },
              ]}
              onSave={(updated) => {
                updateProfile.mutate(
                  { userId, data: updated },
                  {
                    onSuccess: () => {
                      // update local state & cache after successful mutation
                      setFirstName(updated.firstName);
                      setLastName(updated.lastName);
                      setPhone(updated.phone);
                      queryClient.setQueryData(["profile", userId], (oldData: any) => ({
                        ...oldData,
                        data: {
                          ...oldData.data,
                          user: { ...oldData.data.user, ...updated },
                        },
                      }));
                    },
                  }
                );
              }}
            />
          </div>

          <div className="grid grid-cols-2 gap-6 mt-2">
            <div className="flex flex-col"><span className="text-sm text-gray-500">First Name</span><span className="text-m font-medium">{firstName}</span></div>
            <div className="flex flex-col"><span className="text-sm text-gray-500">Last Name</span><span className="text-m font-medium">{lastName}</span></div>
            <div className="flex flex-col"><span className="text-sm text-gray-500">Phone</span><span className="text-m font-medium">{phone}</span></div>
            <div className="flex flex-col"><span className="text-sm text-gray-500">Email</span><span className="text-m font-medium">{email}</span></div>
          </div>
        </div>

     {/* Skills */}
        <div className="bg-white rounded-xl border shadow-sm p-6 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-lg text-gray-700">Skills</h3>

            <EditSection
              title="Skills"
              fields={skills.map((s, i) => ({ key: String(i), label: Skill ${i + 1}, value: s }))}
              onSave={handleSkillsSave}
              allowAddMore={true}
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {skills.map((s, i) => (
              <div key={i} className="px-3 py-1 bg-gray-100 border rounded-lg text-sm">{s}</div>
            ))}
          </div>
        </div>

          <div className="flex flex-wrap gap-2 mt-2">
            {skills.map((s, i) => (
              <div key={i} className="px-3 py-1 bg-gray-100 border rounded-lg text-sm">{s}</div>
            ))}
          </div>
        </div>

        {/* EXPERIENCE */}
        <div className="bg-white rounded-xl border shadow-sm p-6 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-lg text-gray-700">Experience</h3>
            <EditSection
              title="Experience"
              fields={experience.map((exp, i) => ({ key: String(i), label: `Experience ${i+1}`, value: exp }))}
              allowAddMore
              onSave={(updated) => {
                const arr = Object.values(updated);
                patchProfile.mutate(
                  { userId, data: { experience: arr } },
                  {
                    onSuccess: () => {
                      setExperience(arr);
                      queryClient.setQueryData(["profile", userId], (oldData: any) => ({
                        ...oldData,
                        data: { ...oldData.data, experience: arr },
                      }));
                    },
                  }
                );
              }}
            />
          </div>

          <div className="space-y-4 mt-2">
            {experience.map((exp, i) => (
              <div key={i} className="p-4 border rounded-md bg-gray-50">
                <h4 className="font-semibold">{exp.title}</h4>
                <p className="text-sm">{exp.company}</p>
                <p className="text-sm text-gray-500">{exp.start} - {exp.end}</p>
                <p className="text-gray-700">{exp.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* SOCIALS */}
        <div className="bg-white rounded-xl border shadow-sm p-6 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-lg text-gray-700">Social Links</h3>
            <EditSection
              title="Social Links"
              fields={[
                { key: "linkedin", label: "LinkedIn", value: linkedin },
                { key: "github", label: "GitHub", value: github },
              ]}
              onSave={(updated) => {
                patchProfile.mutate(
                  { userId, data: { linkedin: updated.linkedin, github: updated.github } },
                  {
                    onSuccess: () => {
                      setLinkedin(updated.linkedin);
                      setGithub(updated.github);
                      queryClient.setQueryData(["profile", userId], (oldData: any) => ({
                        ...oldData,
                        data: { ...oldData.data, linkedin: updated.linkedin, github: updated.github },
                      }));
                    },
                  }
                );
              }}
            />
          </div>

          <p>LinkedIn: {linkedin}</p>
          <p>GitHub: {github}</p>
        </div>

        {/* RESUME */}
        <div className="bg-white rounded-xl border shadow-sm p-6 space-y-4">
          <h3 className="font-semibold text-lg text-gray-700">Resume</h3>
          <label className="border rounded-lg h-20 flex items-center justify-center text-gray-500 cursor-pointer">
            <input
              type="file"
              className="hidden"
              onChange={(e) => setResume(e.target.files?.[0] || null)}
            />
            {resume ? resume.name : "📄 Upload Resume"}
          </label>
        </div>

      </div>
    </div>
  );
}
