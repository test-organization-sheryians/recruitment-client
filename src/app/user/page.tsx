"use client";

import { useState } from "react";
import PiyushUserForm from "@/features/user/components/PiyushUserForm";
import PiyushUserList from "@/features/user/components/PiyushUserList";
import { PiyushUser } from "@/types/piyushUser";

const Page = () => {
  const [editUser, setEditUser] = useState<PiyushUser | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 flex justify-center items-start p-6">
      
      <div className="w-full max-w-3xl bg-white shadow-lg rounded-xl p-6">
        
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
            Piyush Users CRUD
        </h1>

        {/* Form */}
        <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
          <PiyushUserForm
            editUser={editUser}
            clearEdit={() => setEditUser(null)}
          />
        </div>

        {/* Divider */}
        <div className="my-6 border-t" />

        {/* List */}
        <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
          <PiyushUserList onEdit={setEditUser} />
        </div>
      </div>
    </div>
  );
};

export default Page;