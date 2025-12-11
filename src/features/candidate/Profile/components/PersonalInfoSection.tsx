"use client";

import { useState } from "react";
import { User } from "@/lib/auth";
import { useUpdateUser } from "../hooks/useProfileApi";
import { useDispatch } from "react-redux";
import { setUser } from "@/features/auth/slice";

type Props = {
  user?: User;
};

export default function PersonalInfoSection({ user }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phoneNumber: user?.phoneNumber || "",
  });
  console.log("formData", formData);

  const updateUserMutation = useUpdateUser();
  const dispatch = useDispatch();

  const handleSave = () => {
    updateUserMutation.mutate(formData, {
      onSuccess: (data) => {
        dispatch(setUser(data.user));
        setIsEditing(false);
      },
    });
  };

  const handleCancel = () => {
    setFormData({
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
      phoneNumber: user?.phoneNumber || "",
    });
    setIsEditing(false);
  };

  return (
    <div className="bg-white p-4 rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium">Personal Information</h2>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="text-blue-600 hover:text-blue-800 text-sm"
          >
            Edit
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm text-gray-500">First Name</label>
          {isEditing ? (
            <input
              placeholder="First Name"
              type="text"
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              className="w-full border rounded px-2 py-1 mt-1"
              disabled={true}
            />
          ) : (
            <p className="font-medium">{user?.firstName || "-"}</p>
          )}
        </div>

        <div>
          <label className="text-sm text-gray-500">Last Name</label>
          {isEditing ? (
            <input
              placeholder="Last Name"
              type="text"
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              className="w-full border rounded px-2 py-1 mt-1"
              disabled={true}
            />
          ) : (
            <p className="font-medium">{user?.lastName || "-"}</p>
          )}
        </div>

        <div>
          <label className="text-sm text-gray-500">Email</label>
          {isEditing ? (
            <input
              placeholder="Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full border rounded px-2 py-1 mt-1"
              disabled={true}
            />
          ) : (
            <p className="font-medium">{user?.email || "-"}</p>
          )}
        </div>

        <div>
          <label className="text-sm text-gray-500">Phone Number</label>
          {isEditing ? (
            <input
              placeholder="Phone Number"
              type="text"
              value={formData.phoneNumber}
              onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
              className="w-full border rounded px-2 py-1 mt-1"
            />
          ) : (
            <p className="font-medium">{user?.phoneNumber || "-"}</p>
          )}
        </div>
      </div>

      {isEditing && (
        <div className="flex gap-2 mt-4">
          <button
            onClick={handleSave}
            disabled={updateUserMutation.isPending}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {updateUserMutation.isPending ? "Saving..." : "Save"}
          </button>
          <button
            onClick={handleCancel}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}
