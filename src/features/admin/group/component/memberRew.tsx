"use client";

import { Trash2 } from "lucide-react";
import { useRemoveUser } from "../hooks/useGroups";
import { User } from "@/types/shareInterfaceCandidate";

interface Props {
  user: User;
  groupId: string;
}

export default function MemberRow({ user, groupId }: Props) {
  const removeUser = useRemoveUser(groupId);

  const handleRemove = () => {
    if (!user?._id) return;
    removeUser.mutate(user._id);
  };

  return (
    <div className="grid grid-cols-3 px-6 py-4 border-t items-center hover:bg-gray-50 transition">
      <div>
        <p className="font-medium">
          {user.firstName} {user.lastName}
        </p>
      </div>

      <div className="text-gray-500 text-sm">
        {user.email}
      </div>

      <div className="text-right">
        <button
          onClick={handleRemove}
          disabled={removeUser.isPending}
          className="text-gray-400 hover:text-red-600 transition disabled:opacity-50"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
}
