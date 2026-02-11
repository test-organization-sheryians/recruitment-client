"use client";

import { useState } from "react";
import {
  Users,
  Pencil,
  Trash2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useRouter } from "next/navigation";
import MemberRow from "./MemberRow";
import AddUserModal from "./AddUserModal";
import RenameGroupModal from "./RenameGroupModal";
import DeleteGroupModal from "./DeleteGroupModal";

export default function GroupCard({ group }: any) {
  const [open, setOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [renameOpen, setRenameOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const router = useRouter();

  return (
    <div className="bg-white rounded-2xl border shadow-sm">
      {/* HEADER */}
      <div className="p-6 flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold">
            {group.groupName}
          </h2>
          <p className="text-sm text-gray-500">
            {group.users?.length ?? 0} Members
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() =>
              router.push(`/admin/groups/${group._id}`)
            }
            className="text-blue-600 hover:text-blue-800"
          >
            <Users size={18} />
          </button>

          <button
            onClick={() => setRenameOpen(true)}
            className="text-gray-500 hover:text-blue-600"
          >
            <Pencil size={18} />
          </button>

          <button
            onClick={() => setDeleteOpen(true)}
            className="text-gray-500 hover:text-red-600"
          >
            <Trash2 size={18} />
          </button>

          <button onClick={() => setOpen(!open)}>
            {open ? <ChevronUp /> : <ChevronDown />}
          </button>
        </div>
      </div>

      {/* MEMBERS */}
      {open && (
        <div className="border-t">
          {group.users?.map((user: any) => (
            <MemberRow
              key={user._id}
              user={user}
              groupId={group._id}
            />
          ))}

          <div className="p-4 text-center">
            <button
              onClick={() => setAddOpen(true)}
              className="text-blue-600 hover:underline"
            >
              + Add User
            </button>
          </div>
        </div>
      )}

      <AddUserModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        groupId={group._id}
      />

      <RenameGroupModal
        open={renameOpen}
        onClose={() => setRenameOpen(false)}
        groupId={group._id}
        currentName={group.groupName}
      />

      <DeleteGroupModal
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        groupId={group._id}
      />
    </div>
  );
}
