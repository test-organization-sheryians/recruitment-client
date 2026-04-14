"use client";

import UsersTable from "@/features/admin/users/components/UsersTable";

export default function UsersPage() {
  return (
    <div className="py-6 px-4 h-full w-full bg-white rounded-xl">
      <UsersTable />
    </div>
  );
}
