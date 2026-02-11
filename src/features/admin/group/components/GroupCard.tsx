"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import MemberRow from "./MemberRow";
import { User } from "@/types/shareInterfaceCandidate";

interface Group {
  _id: string;
  groupName: string;
  users: User[];
}

interface Props {
  group: Group;
}

export default function GroupCard({ group }: Props) {
  const [open, setOpen] = useState(true);

  return (
    <div className="bg-white rounded-xl shadow-sm border">
      {/* Header */}
      <div
        onClick={() => setOpen(!open)}
        className="flex justify-between items-center p-5 cursor-pointer"
      >
        <div>
          <h2 className="font-semibold text-lg">
            {group.groupName}
          </h2>
          <p className="text-sm text-gray-500">
            {group.users?.length ?? 0} Members
          </p>
        </div>

        {open ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </div>

      {/* Members Table */}
      {open && (
        <div className="border-t">
          {/* Table Header */}
          <div className="grid grid-cols-3 px-6 py-3 bg-gray-50 text-sm font-medium text-gray-500">
            <span>User Name</span>
            <span>Email</span>
            <span className="text-right">Actions</span>
          </div>

          {/* Members List */}
          {Array.isArray(group.users) &&
            group.users.map((user) => (
              <MemberRow
                key={user._id}
                user={user}
                groupId={group._id}  
              />
            ))}

          {/* Add User Button */}
          <div className="p-4 text-center">
            <button className="text-blue-600 font-medium hover:underline">
              + Add User to Group
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
