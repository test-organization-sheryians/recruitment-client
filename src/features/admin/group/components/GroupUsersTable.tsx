export default function GroupUsersTable({ group }: any) {
  return (
    <table className="w-full border mt-6">
      <thead>
        <tr className="bg-gray-100">
          <th className="p-2">Name</th>
          <th className="p-2">Email</th>
        </tr>
      </thead>
      <tbody>
        {group.selectedUsers?.map((u: any) => (
          <tr key={u._id} className="border-t">
            <td className="p-2">
              {u.firstName} {u.lastName}
            </td>
            <td className="p-2">{u.email}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
