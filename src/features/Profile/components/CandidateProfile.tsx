// src/features/Profile/components/CandidateProfile.tsx
"use client";

import { useEffect, useState } from "react";
import EditSection from "./EditSection";
import { getCurrentUser } from "@/lib/auth";
import { useQueryClient } from "@tanstack/react-query";
import { Experience as ProfileExperience } from "@/types/profile";

interface Skill {
  _id?: string;
  id?: string;
  name: string;
}
// Types
type Experience = Omit<ProfileExperience, '_id' | 'startDate' | 'endDate' | 'role'> & {
  title: string;
  start: string;
  end: string;
};

interface User {
  _id?: string;
  id?: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
}

// Hooks
import {
  useGetProfile,
  usePatchProfile,
  useRemoveSkill,
} from "@/features/Profile/hooks/useProfileApi";

const handlePersonalSave=() => {console.log("Personal Save")}

export default function CandidateProfile() {
  // load current user (from your server-side JWT util)
  const [currentUser, setCurrentUser] = useState<User>();
  useEffect(() => {
    getCurrentUser()
      .then((u) => setCurrentUser(u || undefined))
      .catch(() => setCurrentUser(undefined));
  }, []);

  // Derive userId when possible (defensive)
  // backend responses you've shown include user._id or userId
  const qc = useQueryClient();

  // Fetch profile only when we have a user id (useGetProfile has enabled: !!userId)
  const derivedUserId =
    currentUser?.id ?? // getCurrentUser server util may return `id`
    currentUser?._id ?? // or `_id`
    undefined;

  const {
    data: profile,
    isLoading,
    error: profileError,
  } = useGetProfile();

  // Extract user data from profile
  const profileUser = profile?.user ?? null;
  const userIdFromProfile = profile?.userId ?? profileUser?._id ?? profileUser?.id;

  const userId = derivedUserId ?? userIdFromProfile;

  // Local state (controlled by server values once loaded)
  const [firstName, setFirstName] = useState<string>("Candidate");
  const [lastName, setLastName] = useState<string>("Name");
  const [phone, setPhone] = useState<string>("867643885");
  const [email, setEmail] = useState<string>("xyz@mail.com"); // readonly
  const [skills, setSkills] = useState<string[]>(["React", "Node.js"]); // elements may be string or object
  const [experience, setExperience] = useState<Experience[]>(
    [
      {
        title: "Frontend Intern",
        company: "Tech Corp",
        description: "Worked on UI components and dashboards.",
        start: "Jan 2023",
        end: "Jun 2023",
      },
    ]
  );
  const [linkedin, setLinkedin] = useState<string>("");
  const [github, setGithub] = useState<string>("");
  const [resume, setResume] = useState<File | null>(null);

  // Mutations
  const patchProfile = usePatchProfile();
  const removeSkill = useRemoveSkill();

  // When profile loads, populate local state from server (one-time sync)
  useEffect(() => {
    if (!profile) return;

    // defensive extraction
    const p = profile;
    const userObj = p.user ?? {
      email: '',
      firstName: "",
      lastName: "",
      phone: "",
      _id: "",
      id: ""
    };
    setFirstName(p.firstName ?? userObj.firstName ?? firstName);
    setLastName(p.lastName ?? userObj.lastName ?? lastName);
    setPhone(p.phone ?? userObj.phone ?? phone);
    setEmail(userObj.email ?? p.email ?? email);

    // skills may be strings, ids, or objects with { _id, name }
    setSkills(Array.isArray(p.skills) ? p.skills : []);
    setExperience(Array.isArray(p.experience) ? p.experience : []);
    setLinkedin(p.linkedin ?? "");
    setGithub(p.github ?? "");
  }, [profile]);

  // Helpers to get display name for skill items (handles strings or Skill objects)
  const skillDisplay = (s: string | Skill | User) => {
    if (!s) return "";
    if (typeof s === "string") return s;
    if ('name' in s) return s.name;  // For Skill objects
    if (typeof s === "object") return s.firstName ?? s.lastName ?? String(s._id ?? s.id ?? "");
    return String(s);
  };

  // Helper to get an id for deletion (if skill is object with _id or id)
  const skillIdFor = (s: Skill) => {
    if (!s) return null;
    if (typeof s === "string") return s; // may be an id already or a name — backend expects id usually
    if (typeof s === "object") return s._id ?? s.id ?? null;
    return null;
  };

  // -------------------------
  // Skills: Save handler (called by EditSection onSave)
  // -------------------------
  const handleSkillsSave = (updated: Record<string, unknown>) => {
    // Convert updated values to an array of skill names
    const skillNames = Object.values(updated)
      .filter((skill): skill is string => {
        return typeof skill === 'string' && skill.trim().length > 0;
      })
      .map(skill => skill.trim());

    // Update local UI first (non-optimistic server assumption)
    setSkills(skillNames);

    if (!userId) {
      console.error("No userId available — cannot save skills to server.");
      return;
    }

    // Convert skills array to FormData
    const formData = new FormData();
    skillNames.forEach((skillName, index) => {
      formData.append(`skills[${index}][name]`, skillName);
      // Add other skill properties if needed
      // formData.append(`skills[${index}][level]`, '');
    });

    patchProfile.mutate(
      { userId, data: formData },
      {
        onSuccess: () => {
          qc.invalidateQueries({
            queryKey: ["profile", userId],
          });
        },
        onError: (error) => {
          console.error("Failed to save skills:", error);
          qc.invalidateQueries({ queryKey: ["profile", userId] });
          alert("Failed to save skills. See console for details.");
        },
      }
    );
  };

  // -------------------------
  // Delete single skill (uses removeSkill hook)
  // -------------------------
  const handleDeleteSkill = (skillItem: string | Skill) => {
    const skillName = typeof skillItem === 'string' ? skillItem : skillItem.name;
    const id = typeof skillItem === 'object' ? (skillItem._id || skillItem.id) : undefined;

    if (!userId) return;

    setSkills((prev) => prev.filter(s => s !== skillName));

    if (id) {
      removeSkill.mutate(
        { skill: id },
        {
          onSuccess: () => {
            qc.invalidateQueries({
              queryKey: ["profile", userId],
            });
          },
          onError: (err) => {
            console.error("Failed to remove skill:", err);
            qc.invalidateQueries({
              queryKey: ["profile", userId],
            });
            alert("Failed to remove skill. See console.");
          },
        }
      );
      return; // Exit early if we're using the removeSkill mutation
    }

    // Fallback (fixed)
    const newSkills = skills.filter(
      (s) => skillDisplay(s) !== skillDisplay(skillItem)
    );
    setSkills(newSkills);

    const formData = new FormData();
    formData.append('skills', JSON.stringify(newSkills));
    
    patchProfile.mutate(
      {
        userId: userId,
        data: formData
      },
      {
        onSuccess: () => {
          qc.invalidateQueries({
            queryKey: ["profile", userId],
          });
        },
        onError: (error) => {
          console.error("Error updating skills:", error);
          qc.invalidateQueries({ 
            queryKey: ["profile", userId],
          });
          alert("Failed to update skills. Please try again.");
        },
      }
    );
  };

  // Socials save handler
  const handleSocialsSave = (updated: { linkedin?: string; github?: string }) => {
    const payload: { linkedin?: string; github?: string } = {};

    if (updated.linkedin !== undefined) {
      const linkedinValue = updated.linkedin.trim();
      payload.linkedin = linkedinValue;
      setLinkedin(linkedinValue);
    }

    if (updated.github !== undefined) {
      const githubValue = updated.github.trim();
      payload.github = githubValue;
      setGithub(githubValue);
    }

    if (!userId || Object.keys(payload).length === 0) return;

    const formData = new FormData();
    formData.append('linkedin', payload.linkedin || '');
    formData.append('github', payload.github || '');
    
    patchProfile.mutate(
      { userId, data: formData },
      {
        onSuccess: () => {
          qc.invalidateQueries({
            queryKey: ["profile", userId],
          });
        },
        onError: (err: unknown) => {
          console.error("Failed to save socials:", err);
          qc.invalidateQueries({
            queryKey: ["profile", userId],
          });
          alert("Failed to save socials. See console.");
        },
      }
    );
  };

  // Experience save handler
  const handleExperienceSave = (updatedValues: Record<string, unknown>) => {
    // Convert the unknown values to Experience objects
    const updated = Object.entries(updatedValues).reduce<Record<string, Experience>>((acc, [key, value]) => {
      if (value && typeof value === 'object') {
        acc[key] = value as Experience;
      } else if (typeof value === 'string') {
        try {
          const parsed = JSON.parse(value);
          if (parsed && typeof parsed === 'object') {
            acc[key] = parsed as Experience;
          }
        } catch (e) {
          console.warn(`Could not parse experience value for key ${key}`, value);
        }
      }
      return acc;
    }, {});
    try {
      const arrRaw = Object.values(updated);
      const newExperience = arrRaw
        .map((v): Experience | null => {
          if (!v) return null;

          let exp: Experience;
          if (typeof v === "string") {
            try {
              exp = JSON.parse(v);
            } catch {
              return null;
            }
          } else {
            exp = v;
          }

          return {
            title: exp.title || "",
            company: exp.company || "",
            description: exp.description || "",
            start: exp.start || "",
            end: exp.end || "",
          };
        })
        .filter((exp): exp is Experience => exp !== null);

      setExperience(newExperience);

      if (!userId) return;

      // Convert to the format expected by the API
      const apiExperience = newExperience.map((exp) => ({
        company: exp.company,
        title: exp.title,
        description: exp.description,
        startDate: exp.start,
        endDate: exp.end || undefined,
      }));

      const formData = new FormData();
      formData.append('experience', JSON.stringify(apiExperience));
      
      patchProfile.mutate(
        { userId, data: formData },
        {
          onSuccess: () => {
            qc.invalidateQueries({
              queryKey: ["profile", userId],
            });
          },
          onError: (err: unknown) => {
            console.error("Failed to save experience:", err);
            qc.invalidateQueries({
              queryKey: ["profile", userId],
            });
            alert("Failed to save experience. See console.");
          },
        }
      );
    } catch (error) {
      console.error("Error in handleExperienceSave:", error);
      alert("An error occurred while saving experience. See console for details.");
    }
  };

  // Resume upload handler
  const handleResumeUpload = (file: File | null) => {
    if (!file || !userId) return;

    setResume(file);
    const fd = new FormData();
    fd.append("resume", file);

    patchProfile.mutate(
      { userId, data: fd },
      {
        onSuccess: () => {
          qc.invalidateQueries({
            queryKey: ["profile", userId],
          });
        },
        onError: (err: unknown) => {
          console.error("Resume upload failed:", err);
          qc.invalidateQueries({
            queryKey: ["profile", userId],
          });
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
              fields={(experience || []).map((exp: Experience, i: number) => ({ key: String(i), label: `Experience ${i+1}`, value: JSON.stringify(exp) }))}
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
