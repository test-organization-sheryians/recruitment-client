export default function GroupUsersTable({ group }: any) {
  return (
    <table className="w-full border mt-6 rounded-lg overflow-hidden">
      <thead className="bg-gray-100">
        <tr>
          <th className="p-3 text-left">Name</th>
          <th className="p-3 text-left">Email</th>
        </tr>
      </thead>
      <tbody>
        {group.users?.map((u: any) => (
          <tr key={u._id} className="border-t">
            <td className="p-3">
              {u.firstName} {u.lastName}
            </td>
            <td className="p-3">{u.email}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
