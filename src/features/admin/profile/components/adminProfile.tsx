"use client";

import { useEffect, useState } from "react";
import { useGetProfile } from "../hooks/useGetProfile";
import PersonalInfoSection from "./personalInfoSection";
import EditProfileInfoModal from "./EditProfileInfoModal";

export default function AdminProfile() {
  const { data: profile, isLoading, isError, refetch } = useGetProfile();

  const [isEditOpen, setIsEditOpen] = useState(false);

  const toggleEdit = () => setIsEditOpen((v) => !v);

  if (isLoading) return <p className="text-center mt-10">Loading profile...</p>;

  return (
    <div className="rounded-2xl h-screen bg-gray-50 px-3 py-2 sm:px-6 sm:py-6 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Admin Profile</h1>
        </div>

        {/* PERSONAL INFO */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-center justify-between pb-3">
            <h2 className="text-lg font-medium text-gray-800">
              Personal Information
            </h2>
            <button
              onClick={toggleEdit}
              className="px-3 py-1 rounded-md bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
            >
              Edit
            </button>
          </div>

          <PersonalInfoSection
            firstName={profile?.firstName ?? ""}
            lastName={profile?.lastName ?? ""}
            email={profile?.email ?? ""}
            phone={profile?.phoneNumber ?? ""}
          />

          <EditProfileInfoModal
            profile={profile}
            isOpen={isEditOpen}
            onClose={toggleEdit}
            onUpdated={async () => {
              await refetch();
            }}
          />
        </div>
      </div>
    </div>
  );
}
