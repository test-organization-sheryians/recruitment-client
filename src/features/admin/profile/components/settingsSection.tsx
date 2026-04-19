"use client";

import React from "react";

interface SettingsSectionProps {
  isSubscribed: boolean;
  isLoading?: boolean;
  onToggle: () => void;
  onInstall?: () => void;
  canInstall?: boolean;
}

const SettingsSection = ({
  isSubscribed,
  isLoading,
  onToggle,
  onInstall,
  canInstall,
}: SettingsSectionProps) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <h2 className="text-lg font-medium text-gray-800 mb-4">Settings</h2>

      <div className="flex items-center justify-between py-3 border-b">
        <div>
          <p className="text-sm font-medium text-gray-700">
            Push Notifications
          </p>
          <p className="text-xs text-gray-500">
            Get notified when new jobs are posted
          </p>
        </div>

        <button
          onClick={onToggle}
          disabled={isLoading}
          className={`w-12 h-6 flex items-center rounded-full p-1 transition ${
            isSubscribed ? "bg-green-500" : "bg-gray-300"
          }`}
        >
          <div
            className={`w-4 h-4 bg-white rounded-full shadow-md transform transition ${
              isSubscribed ? "translate-x-6" : "translate-x-0"
            }`}
          />
        </button>
      </div>

      <div className="flex items-center justify-between py-3">
        <div>
          <p className="text-sm font-medium text-gray-700">Install App</p>
          <p className="text-xs text-gray-500">
            Add this app to your home screen
          </p>
        </div>

        {canInstall ? (
          <button
            onClick={onInstall}
            className="px-3 py-1.5 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-700"
          >
            Download
          </button>
        ) : (
          <span className="text-xs text-gray-400">Already Installed</span>
        )}
      </div>
    </div>
  );
};

export default SettingsSection;
