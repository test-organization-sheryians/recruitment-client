
import { useGroupDetail } from "@/features/admin/group/hooks/useGroupDetails";
import GroupUsersTable from "@/features/admin/group/components/GroupUsersTable";
import { useParams } from "next/navigation";

export default function GroupDetailPage() {
  const params = useParams();
  const rawId = (params as { id?: string | string[] })?.id;
  const id = Array.isArray(rawId) ? rawId[0] : rawId ?? "";

  const { data: group, isLoading } = useGroupDetail(id);

  if (!id) return <p>Invalid group id</p>;
  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">{group?.groupName}</h1>
      <GroupUsersTable group={group} />
    </div>
  );
}
