"use client";

import { useGetProfile, useCreateProfile, useGetUser } from "../hooks/useProfileApi";

import PersonalInfoSection from "./PersonalInfoSection";
import SkillsSection from "./SkillsSection";
import ExperienceSection from "./ExperienceSection";
import ResumeSection from "./ResumeSection";
import SocialLinksSection from "./SocialLinksSection";
import AvailabilitySection from "./AvailabilitySection";


export default function CandidateProfile() {
  const { data: user, isLoading: userLoading } = useGetUser();

  const { data: profile, isLoading: profileLoading, isError, refetch } = useGetProfile();
  const createProfileMutation = useCreateProfile();

  // If profile error and user exists, create profile
  if (isError && user?.id && !profileLoading) {
    createProfileMutation.mutate(user.id, {
      onSuccess: () => refetch(),
    });
  }

  if (userLoading || profileLoading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-50 px-3 py-2 sm:px-6 sm:py-6 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">


        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">
            Candidate Profile
          </h1>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6">
          <PersonalInfoSection
            user={user}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Skills */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            {/* <h2 className="text-lg font-semibold mb-4">Skills</h2> */}
            <SkillsSection skills={profile?.skills?.map((skill: string | { _id: string; name: string }) => ({
              _id: typeof skill === 'string' ? skill : skill._id,
              name: typeof skill === 'string' ? skill : skill.name
            })) ?? []} />
          </div>

          {/* Resume */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            {/* <h2 className="text-lg font-semibold mb-4">Resume</h2> */}
            <ResumeSection resumefile={profile?.resumeFile} resumeFileNoPI={profile?.resumeFileNoPI} />
          </div>
        </div>

        {/* Experience Full Width */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          {/* <h2 className="text-lg font-semibold mb-4">Experience</h2> */}
          <ExperienceSection
            candidateId={profile?._id || ""}
            experiences={profile?.experiences || []}
            refetchProfile={refetch}
          />
        </div>

        {/* Social & Availability */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <div className="bg-white rounded-2xl shadow-sm p-6">
            {/* <h2 className="text-lg font-semibold mb-4">Social Links</h2> */}
            <SocialLinksSection
              linkedin={profile?.linkedinUrl}
              github={profile?.githubUrl}
              portfolioUrl={profile?.portfolioUrl}
              onUpdate={refetch}
            />
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-6">
            {/* <h2 className="text-lg font-semibold mb-4">Availability</h2> */}
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
