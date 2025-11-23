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

export default function CandidateProfile() {
  const user = useSelector((state: RootState) => state.auth.user);

  const { data: profile, isLoading, isError, refetch } = useGetProfile();
  const createProfileMutation = useCreateProfile();

  useEffect(() => {
    if (isError && user?.id) {
      createProfileMutation.mutate(user.id, {
        onSuccess: () => refetch(),
      });
    }
  }, [isError, user?.id, refetch, createProfileMutation]);

  if (isLoading) return <p className="text-center mt-10">Loading profile...</p>;
  if (!user) return <p className="text-center mt-10 text-red-500">User not found</p>;

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      <h1 className="text-2xl font-semibold">Candidate Profile</h1>

      <PersonalInfoSection
        firstName={user.firstName || ""}
        lastName={user.lastName || ""}
        email={user.email || ""}
        phone={profile?.phone || ""}
      />

      <SkillsSection skills={profile?.skills ?? []} />

      {/* Fixed safe props */}
      <ExperienceSection candidateId={user?.id} />


      <ResumeSection resumeUrl={profile?.resumeUrl} />

      <SocialLinksSection
        linkedin={profile?.linkedinUrl}
        github={profile?.githubUrl}
        portfolioUrl={profile?.portfolioUrl}
        onUpdate={refetch}
      />

      <AvailabilitySection availability={profile?.availability} />
    </div>
  );
}
