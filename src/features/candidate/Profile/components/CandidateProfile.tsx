"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/config/store";

import { useGetProfile, useCreateProfile, useUpdateMe } from "../hooks/useProfileApi";
import Modal from "@/components/ui/Modal";
import { LoaderCircleIcon } from "lucide-react";

import PersonalInfoSection from "./PersonalInfoSection";
import SkillsSection from "./SkillsSection";
import ExperienceSection from "./ExperienceSection";
import ResumeSection from "./ResumeSection";
import SocialLinksSection from "./SocialLinksSection";
import AvailabilitySection from "./AvailabilitySection";
import ProfileCompletion from "./ProfileCompletion";

export default function CandidateProfile() {
  const authUser = useSelector((state: RootState) => state.auth.user);

  const { data: profile, isLoading, isError, refetch } = useGetProfile();
  const createProfileMutation = useCreateProfile();

  const completion = profile?.completion ?? 0;
  const [isEditOpen, setIsEditOpen] = useState(false);

  const toggleEdit = () => setIsEditOpen((v) => !v);

  useEffect(() => {
    if (isError && authUser?.id) {
      createProfileMutation.mutate(authUser.id, {
        onSuccess: () => refetch(),
      });
    }
  }, [isError, authUser?.id, refetch, createProfileMutation]);

  if (isLoading)
    return <p className="text-center mt-10">Loading profile...</p>;

  return (
    <div className="min-h-screen bg-gray-50 px-3 py-2 sm:px-6 sm:py-6 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">
            Candidate Profile
          </h1>
        </div>

        {completion < 100 && (
          <ProfileCompletion completion={completion} />
        )}

        {/* PERSONAL INFO */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-center justify-between pb-3">
            <h2 className="text-lg font-medium text-gray-800">Personal Information</h2>
            <button
              onClick={toggleEdit}
              className="px-3 py-1 rounded-md bg-blue-600 text-white hover:bg-blue-700"
            >
              Edit
            </button>
          </div>

          <PersonalInfoSection
            firstName={profile?.user?.firstName ?? ""}
            lastName={profile?.user?.lastName ?? ""}
            email={profile?.user?.email ?? ""}
            phone={profile?.user?.phoneNumber ?? ""}
          />

          <EditPersonalInfoModal
            profile={profile}
            isOpen={isEditOpen}
            onClose={toggleEdit}
            onUpdated={refetch}
          />
        </div>

        {/* SKILLS & RESUME */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <SkillsSection
              skills={
                profile?.skills?.map(
                  (
                    skill:
                      | string
                      | { _id: string; name: string }
                  ) => ({
                    _id:
                      typeof skill === "string"
                        ? skill
                        : skill._id,
                    name:
                      typeof skill === "string"
                        ? skill
                        : skill.name,
                  })
                ) ?? []
              }
            />
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-6">
            <ResumeSection resumefile={profile?.resumeFile} />
          </div>
        </div>

        {/* EXPERIENCE */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <ExperienceSection
            candidateId={profile?._id || ""}
            experiences={profile?.experiences || []}
            refetchProfile={refetch}
          />
        </div>

        {/* SOCIAL & AVAILABILITY */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <SocialLinksSection
              linkedin={profile?.linkedinUrl}
              github={profile?.githubUrl}
              portfolioUrl={profile?.portfolioUrl}
              onUpdate={refetch}
            />
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-6">
            <AvailabilitySection
              availability={profile?.availability}
              onUpdate={refetch}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// @ts-expect-error -- props are untyped here
function EditPersonalInfoModal(props) {
  const { profile, isOpen, onClose, onUpdated } = props;

  const [firstName, setFirstName] = useState(profile?.user?.firstName ?? "");
  const [lastName, setLastName] = useState(profile?.user?.lastName ?? "");
  const [phone, setPhone] = useState(profile?.user?.phoneNumber ?? "");

  const { mutate: updateMe, isPending } = useUpdateMe();

  // sync when modal opens or profile changes
  useEffect(() => {
    if (isOpen) {
      setFirstName(profile?.user?.firstName ?? "");
      setLastName(profile?.user?.lastName ?? "");
      setPhone(profile?.user?.phoneNumber ?? "");
    }
  }, [isOpen, profile?.user?.firstName, profile?.user?.lastName, profile?.user?.phoneNumber]);

  const handleSave = () => {
    // JWT handles identity, no need for userId
    updateMe(
      {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phoneNumber: phone.trim(),
      },
      {
        onSuccess: () => {
          onClose();
          onUpdated?.();
        },
        onError: (err) => {
          console.error("Update error:", err);
          alert("Failed to update personal info. Please try again.");
        },
      }
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Personal Information">
      <div className="space-y-4">
        <div>
          <label className="block text-sm text-gray-700 mb-1">First Name</label>
          <input
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-700 mb-1">Last Name</label>
          <input
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-700 mb-1">Email (readonly)</label>
          <input
            value={profile?.user?.email ?? ""}
            readOnly
            className="w-full px-4 py-2 border border-gray-200 bg-gray-100 rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-700 mb-1">Phone</label>
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          />
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <button
            onClick={onClose}
            className="px-5 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isPending}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
          >
            {isPending ? (
              <>
                <LoaderCircleIcon className="animate-spin w-5 h-5" />
                Saving...
              </>
            ) : (
              "Save"
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
}