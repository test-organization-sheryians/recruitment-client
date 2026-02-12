"use client";

import { Group } from "@/types/shareInterfaceCandidate";

interface Props {
  group: Group;
}

export default function GroupUsersTable({ group }: Props) {
  const users = group.selectedUsers ?? [];

  return (
    <div className="mt-6">
      <h2 className="text-lg font-semibold mb-4">Users</h2>

      {users.length === 0 ? (
        <p>No users in this group</p>
      ) : (
        <ul className="space-y-2">
          {users.map((user) => (
            <li key={user._id} className="border p-2 rounded">
              {user.firstName} {user.lastName} - {user.email}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
