"use client";

import { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/config/store";

import { useGetProfile, useCreateProfile } from "../hooks/useProfileApi";

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
          <PersonalInfoSection
            firstName={profile?.user?.firstName ?? ""}
            lastName={profile?.user?.lastName ?? ""}
            email={profile?.user?.email ?? ""}
            phone={profile?.user?.phoneNumber ?? ""}
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