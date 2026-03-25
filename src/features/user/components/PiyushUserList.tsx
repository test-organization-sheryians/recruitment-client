"use client";

import {
  usePiyushGetUsers,
  usePiyushDeleteUser,
} from "../hooks/piyushUseUser";
import { PiyushUser } from "@/types/piyushUser";

const PiyushUserList = ({
  onEdit,
}: {
  onEdit: (user: PiyushUser) => void;
}) => {
  const { data, isLoading } = usePiyushGetUsers();
  const { mutate: deleteUser, isPending } = usePiyushDeleteUser();

  if (isLoading) return <p>Loading users...</p>;

  return (
    <div className="space-y-3">
  {data?.map((user: PiyushUser) => (
    <div
      key={user._id}
      className="flex justify-between items-center bg-white p-3 rounded-md shadow"
    >
      <div>
        <p className="font-semibold text-gray-800">{user.name}</p>
        <p className="text-sm text-gray-500">{user.email}</p>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => onEdit(user)}
          className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
        >
          Update
        </button>

        <button
          onClick={() => deleteUser(user._id)}
          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
        >
          Delete
        </button>
      </div>
    </div>
  ))}
</div>
  );
};

export default PiyushUserList;