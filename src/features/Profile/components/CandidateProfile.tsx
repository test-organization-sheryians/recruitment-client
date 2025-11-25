// src/features/Profile/components/CandidateProfile.tsx
"use client";

import { useEffect, useState } from "react";
import EditSection from "./EditSection";
import { getCurrentUser, User } from "@/lib/auth";
import { useQueryClient } from "@tanstack/react-query";
import { Profile, Experience } from "@/types/profile";



/* hooks (single-file export) */
import {
  useGetProfile,
  usePatchProfile,
  useRemoveSkill,
} from "@/features/Profile/hooks/useProfileApi";
import { AxiosError } from "axios";

export default function CandidateProfile() {
  // load current user (from your server-side JWT util)
const [currentUser, setCurrentUser] = useState<User | null>(null);

useEffect(() => {
  let isMounted = true;

  getCurrentUser()
    .then((u) => {
      if (isMounted) setCurrentUser(u);
    })
    .catch(() => {
      if (isMounted) setCurrentUser(null);
    });

  return () => {
    isMounted = false;
  };
}, []);


  // Derive userId when possible (defensive)
  // backend responses you've shown include user._id or userId
  const qc = useQueryClient();

  // Fetch profile only when we have a user id (useGetProfile has enabled: !!userId)
// STEP 1 — from auth
const derivedUserId = currentUser?.id || null;

// STEP 2 — get profile (no params)
const {
  data: rawProfile,
  isLoading,
  error: profileError,
} = useGetProfile();

// STEP 3 — normalize profile
const profile: Profile | null = rawProfile && "data" in rawProfile ? rawProfile.data : rawProfile ?? null;

// STEP 4 — extract userId
const userIdFromProfile = profile?._id ?? null;

// STEP 5 — final userId
const userId = derivedUserId ?? userIdFromProfile;


// Local state (controlled by server values once loaded)
const [firstName, setFirstName] = useState<string>("");
const [lastName, setLastName] = useState<string>("");
const [phone, setPhone] = useState<string>("");
const [email, setEmail] = useState<string>(""); // readonly
const [skills, setSkills] = useState<string[]>([]); // elements may be string or object
const [experience, setExperience] = useState<Experience[]>([]);
const [linkedin, setLinkedin] = useState<string>("");
const [github, setGithub] = useState<string>("");
const [resume, setResume] = useState<File | null>(null);

// Mutations
const patchProfile = usePatchProfile();
const removeSkill = useRemoveSkill();

// When profile loads, populate local state from server (one-time sync)
useEffect(() => {
  if (!profile) return;

  // profile is typed as Profile
  const p = profile;
  const userObj = profile.user as Partial<Profile> ?? {}; 

  setFirstName(p.firstName ?? userObj.firstName ?? "");
  setLastName(p.lastName ?? userObj.lastName ?? "");
  setPhone(p.phone ?? userObj.phone ?? "");
  setEmail(userObj.email ?? p.email ?? "");

  setSkills(Array.isArray(p.skills) ? p.skills : []);
  setExperience(Array.isArray(p.experience) ? p.experience : []);

  //setLinkedin(p.linkedin ?? "");
  //setGithub(p.github ?? "");
}, [profile]);



  // Helpers to get display name for skill items (handles strings or objects)
const skillDisplay = (s: string | Record<string, unknown>): string => {
  if (!s) return "";
  if (typeof s === "string") return s;
  if (typeof s === "object" && s !== null) {
    // safely access possible string properties
    return (s.name ?? s.label ?? s._id ?? s.id ?? "") as string;
  }
  return "";
};


  // Helper to get an id for deletion (if skill is object with _id or id)
  const skillIdFor =(s: string | Record<string, object>) => {
    if (!s) return null;
    if (typeof s === "string") return s; // may be an id already or a name — backend expects id usually
    if (typeof s === "object") return s._id ?? s.id ?? null;
    return null;
  };

  // -------------------------
  // Skills: Save handler (called by EditSection onSave)
  // -------------------------
  const handleSkillsSave = (updated: Record<string, object>) => {
    // Updated is an object { "0": "React", "1": "Node" ... } or numeric keys with JSON strings
    const arrRaw = Object.values(updated);
    const newArr = arrRaw
      .map((v) => {
        // if it's a JSON string for complex object, try parse
        if (typeof v === "string") {
          try {
            const parsed = JSON.parse(v);
            return parsed;
          } catch {
            return (v as string).trim();
          }
        }
        return v;
      })
      .filter((v) => {
        if (typeof v === "string") return v.trim().length > 0;
        return v != null;
      });

    // Update local UI first (non-optimistic server assumption)
    setSkills(newArr);
  

    if (!userId) {
      console.error("No userId available — cannot save skills to server.");
      return;
    }

    // Prefer specialized addSkills API if you want to POST new skills endpoint,
    // but many backends accept patch profile with skills array.
    // We'll use PATCH profile to update whole skills array (safer).
    patchProfile.mutate(
      { userId, 
        data: { skills: newArr } },
      {
        onSuccess: () => {
          // invalidate profile to refetch canonical values
          qc.invalidateQueries({ queryKey: ["profile", userId] })
        },
        onError: (err: unknown) => {
    const error = err as AxiosError; // cast to AxiosError for safety
      console.error("Failed to save skills:", error);
      // rollback by refetching server copy
      qc.invalidateQueries({ queryKey: ["profile", userId] });
      // optional: show user-visible error
      alert("Failed to save skills. See console for details.");
        },
      }
    );
  };

  // -------------------------
  // Delete single skill (uses removeSkill hook)
  // -------------------------
const handleDeleteSkill = (skillItem: string) => {
  const id = skillIdFor(skillItem); // should return _id now

  if (!userId) return;
  if (!id) return;    // exit if skill id is null
  if (id) {
    // Optimistic UI update using _id (fix)
    setSkills((prev) => prev.filter((s) => skillIdFor(s) !== id));

    removeSkill.mutate(
     { skill: id as string }, 
      {
        onSuccess: () => qc.invalidateQueries({ queryKey: ["profile", userId] }),
        onError: (err: unknown) => {
          console.error("Failed to remove skill:", err);
          qc.invalidateQueries({ queryKey: ["profile", userId] });
          alert("Failed to remove skill. See console.");
        },
      }
    );
    return;
  }

  // Fallback (unchanged)
  const newSkills = skills.filter((s) => skillDisplay(s) !== skillDisplay(skillItem));
  setSkills(newSkills);

  patchProfile.mutate(
    { userId, data: { skills: newSkills } },
    {
      onSuccess: () => qc.invalidateQueries({ queryKey: ["profile", userId] }),
      onError: (err: unknown) => {
        console.error("Failed to remove skill (fallback):", err);
        qc.invalidateQueries({ queryKey: ["profile", userId] });
        alert("Failed to remove skill. See console.");
      },
    }
  );
};


  // -------------------------
  // Personal info save handler (patched)
  // -------------------------
  const handlePersonalSave = (updated: Record<string, object>) => {
const payload: Partial<Pick<Profile, "firstName" | "lastName" | "phone">> = {};

if (typeof updated.firstName === "string") payload.firstName = updated.firstName;
if (typeof updated.lastName === "string") payload.lastName = updated.lastName;
if (typeof updated.phone === "string") payload.phone = updated.phone;

// update UI
if (payload.firstName !== undefined) setFirstName(payload.firstName);
if (payload.lastName !== undefined) setLastName(payload.lastName);
if (payload.phone !== undefined) setPhone(payload.phone);

    if (!userId) return;
    patchProfile.mutate(
      { userId, data: payload },
      {
        onSuccess: () => qc.invalidateQueries({ queryKey: ["profile", userId] }),
        onError: (err) => {
          console.error("Failed to save personal info:", err);
          qc.invalidateQueries({ queryKey: ["profile", userId] });
          alert("Failed to save personal info. See console.");
        },
      }
    );
  };

  // -------------------------
  // Experience save handler
  // -------------------------
  const handleExperienceSave = (updated: Record<string, object>) => {
    // try parse same way as skills: accept JSON strings or objects
    const arrRaw = Object.values(updated);
    const newExperience = arrRaw
      .map((v) => {
        if (typeof v === "string") {
          try {
            return JSON.parse(v);
          } catch {
            return v;
          }
        }
        return v;
      })
      .filter(Boolean);

    setExperience(newExperience);

    if (!userId) return;
    patchProfile.mutate(
      { userId, data: { experience: newExperience } },
      {
        onSuccess: () => qc.invalidateQueries({ queryKey: ["profile", userId] }),
        onError: (err) => {
          console.error("Failed to save experience:", err);
          qc.invalidateQueries({ queryKey: ["profile", userId] });
          alert("Failed to save experience. See console.");
        },
      }
    );
  };

  // -------------------------
  // Socials save handler
  // -------------------------
  const handleSocialsSave = (updated: Record<string, object>) => {
  const payload: Partial<Pick<Profile, "linkedin" | "github">> = {};

 if (typeof updated.linkedin === "string") {
  payload.linkedin = updated.linkedin;
  setLinkedin(payload.linkedin);
}

if (typeof updated.github === "string") {
  payload.github = updated.github;
  setGithub(payload.github);
}


    if (!userId) return;
    patchProfile.mutate(
      { userId, data: payload },
      {
        onSuccess: () => qc.invalidateQueries({ queryKey: ["profile", userId] }),
        onError: (err) => {
          console.error("Failed to save socials:", err);
          qc.invalidateQueries({ queryKey: ["profile", userId] });
          alert("Failed to save socials. See console.");
        },
      }
    );
  };


  // resume upload
  const handleResumeUpload = (file: File | null) => {
    setResume(file);
    if (!file || !userId) return;

    const fd = new FormData();
    fd.append("resume", file);
    patchProfile.mutate(
      { userId, data: fd },
      {
        onSuccess: () => qc.invalidateQueries({ queryKey: ["profile", userId] }),
        onError: (err) => {
          console.error("Resume upload failed:", err);
          qc.invalidateQueries({ queryKey: ["profile", userId] });
          alert("Resume upload failed. See console.");
        },
      }
    );
  };

  // Loading & error states
  if (!currentUser || isLoading) {
    return (
      <div className="w-full min-h-screen bg-gray-100 flex items-center justify-center p-6">
        <div className="max-w-3xl w-full text-center text-gray-600">Loading profile…</div>
      </div>
    );
  }

  if (profileError) {
    return (
      <div className="w-full min-h-screen bg-gray-100 flex items-center justify-center p-6">
        <div className="max-w-3xl w-full text-center text-red-600">Failed to load profile.</div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gray-100 flex justify-center p-6">
      <div className="max-w-3xl w-full space-y-6">
        {/* Profile Header */}
        <div className="bg-blue-200 rounded-xl border shadow-sm p-6 flex items-center gap-4">
          <div className="h-18 w-18 rounded-full bg-blue-500 text-white font-bold grid place-items-center text-4xl leading-none">
            {(firstName && firstName[0]) || "C"}
          </div>
          <div>
            <h2 className="text-2xl font-bold">{firstName} {lastName}</h2>
            <p className="text-m text-semibold text-gray-500">Fresher</p>
          </div>
        </div>

        {/* Personal */}
        <div className="bg-white rounded-xl border shadow-sm p-6 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-gray-700 text-lg">Personal Information</h3>

            <EditSection
              title="Personal Information"
              fields={[
                { key: "firstName", label: "First Name", value: firstName },
                { key: "lastName", label: "Last Name", value: lastName },
                { key: "phone", label: "Phone Number", value: phone },
                { key: "email", label: "Email Address", value: email, disabled: true },
              ]}
              onSave={handlePersonalSave}
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
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
              fields={skills.map((s, i) => ({ key: String(i), label: `Skill ${i+1}`, value: skillDisplay(s) }))}
              allowAddMore={true}
              onSave={handleSkillsSave}
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {skills.map((s, index) => (
              <div key={index} className="px-3 py-1 bg-gray-100 border rounded-lg text-sm flex items-center gap-2">
                <span>{skillDisplay(s)}</span>
                <button
                  onClick={() => handleDeleteSkill(s)}
                  className="text-red-500 hover:text-red-700 text-xs ml-2"
                  aria-label={`Remove ${skillDisplay(s)}`}
                >
                  ✖
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Experience */}
        <div className="bg-white rounded-xl border shadow-sm p-6 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-lg text-gray-700">Experience</h3>

            <EditSection
              title="Experience"
              fields={(experience || []).map((exp: object, i: number) => ({ key: String(i), label: `Experience ${i+1}`, value: JSON.stringify(exp) }))}
              allowAddMore={true}
              onSave={handleExperienceSave}
            />
          </div>

          <div className="space-y-4">
            {(experience || []).map((exp: Experience, i: number) => (
              <div key={i} className="p-4 border rounded-md bg-gray-50">
                <h4 className="font-semibold">{exp.title}</h4>
                <p className="text-sm">{exp.company}</p>
                <p className="text-sm text-gray-500">{exp.start} - {exp.end}</p>
                <p className="text-gray-700">{exp.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Resume */}
        <div className="bg-white rounded-xl border shadow-sm p-6 space-y-4">
          <h3 className="font-semibold text-lg text-gray-700">Resume</h3>

          <label className="border rounded-lg h-20 flex items-center justify-center text-gray-500 cursor-pointer">
            <input type="file" className="hidden" onChange={(e) => handleResumeUpload(e.target.files?.[0] || null)} />
            {resume ? resume.name : "📝 Upload Resume"}
          </label>
        </div>

       {/* Socials */}
        <div className="bg-white rounded-xl border shadow-sm p-6 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-lg text-gray-700">Socials</h3>

            <EditSection
              title="Social Links"
              fields={[
                { key: "linkedin", label: "LinkedIn", value: linkedin },
                { key: "github", label: "GitHub", value: github },
              ]}
              onSave={handleSocialsSave}
            />
          </div>

          <p>LinkedIn: {linkedin}</p>
          <p>GitHub: {github}</p>
        </div>
        
      </div>
    </div>
  );
}
