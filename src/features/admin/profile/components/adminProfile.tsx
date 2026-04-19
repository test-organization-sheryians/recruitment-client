"use client";

import { useEffect, useState } from "react";
import { useGetProfile } from "../hooks/useGetProfile";
import PersonalInfoSection from "./personalInfoSection";
import EditProfileInfoModal from "./EditProfileInfoModal";
import { useNotification } from "@/hooks/useNotification";
import { useToast } from "@/components/ui/Toast";
import SettingsSection from "./settingsSection";

export default function AdminProfile() {
  const { data: profile, isLoading, isError, refetch } = useGetProfile();

  // --------------------------------------------------------------------------------

  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [canInstall, setCanInstall] = useState(false);

  // --------------------------------------------------------------------------------

  const {
    subscribe,
    unsubscribe,
    isSubscribed,
    setIsSubscribed,
    isLoading: notifLoading,
  } = useNotification();
  const toast = useToast();

  const [isEditOpen, setIsEditOpen] = useState(false);

  const toggleEdit = () => setIsEditOpen((v) => !v);

  // --------------------------------------------------------------------------------

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setCanInstall(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  // --------------------------------------------------------------------------------

  if (isLoading) return <p className="text-center mt-10">Loading profile...</p>;
  // -----------------------------------------------------------------------

  // ----------------------------------------------------------------------------------
  const handleInstall = async () => {
    if (!deferredPrompt) {
      toast.error("Install option not available on this device");
      return;
    }

    try {
      deferredPrompt.prompt();

      const choice = await deferredPrompt.userChoice;

      if (choice.outcome === "accepted") {
        toast.success("App installed successfully");
      } else {
        toast.error("Installation cancelled");
      }
    } catch (err) {
      console.error("Install error:", err);
      toast.error("Something went wrong while installing");
    } finally {
      setDeferredPrompt(null);
      setCanInstall(false);
    }
  };
  // -------------------------------------------------------------

  const handleToggle = async () => {
    const prevState = isSubscribed;

    setIsSubscribed(!prevState);

    try {
      if (prevState) {
        await unsubscribe();
        toast.success("Notifications turned OFF");
      } else {
        await subscribe();
        toast.success("Notifications turned ON");
      }
    } catch (err) {
      setIsSubscribed(prevState);

      toast.error(
        prevState
          ? "Failed to turn OFF notifications"
          : "Permission denied or failed to turn ON",
      );
    }
  };

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

        <SettingsSection
          isSubscribed={isSubscribed}
          isLoading={notifLoading}
          onToggle={handleToggle}
          onInstall={handleInstall}
          canInstall={canInstall}
        />
      </div>
    </div>
  );
}
