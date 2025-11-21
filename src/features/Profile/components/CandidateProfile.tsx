"use client";

import {
  useGetProfile,
} from "../hooks/useProfileApi";

import PersonalInfoSection from "./PersonalInfoSection";
import SkillsSection from "./SkillsSection";
import ExperienceSection from "./ExperienceSection";
import ResumeSection from "./ResumeSection";
import SocialLinksSection from "./SocialLinksSection";
import AvailabilitySection from "./AvailabilitySection";

export default function CandidateProfile() {
  const { data, isLoading, isError } = useGetProfile();

  if (isLoading) {
    return <p className="text-center mt-10">Loading profile...</p>;
  }

  if (isError) {
    return <p className="text-center mt-10 text-red-500">Failed to load profile</p>;
  }

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      <h1 className="text-2xl font-semibold">Candidate Profile</h1>

      <PersonalInfoSection profile={data} />

      <SkillsSection skills={data?.skills || []} />

      <ExperienceSection experience={data?.experience || []} />

      <ResumeSection resume={data?.resume} />

      <SocialLinksSection
        linkedin={data?.linkedin}
        github={data?.github}
      />

      <AvailabilitySection availability={data?.availability} />
    </div>
  );
}
