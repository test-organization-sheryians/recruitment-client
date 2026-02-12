"use client";

import { useMemo, useRef, useState } from "react";
import { useInfiniteUsers } from "@/features/admin/users/hooks/useUser";

type Props = {
	groupId?: string;
};

export default function SelectMember({ groupId }: Props) {
	const { data, isLoading, isError } = useInfiniteUsers("");
	const users = useMemo(() => data?.pages.flatMap((p: any) => p.data) ?? [], [data]);

	const [selected, setSelected] = useState<string[]>([]);

	const toggle = (id: string) =>
		setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

	const handleAdd = () => {
		if (!groupId) {
			// fallback: just log
			console.log("Selected users to add:", selected);
			alert(`Selected users: ${selected.join(", ")}`);
			return;
		}

		// TODO: call your API to add users to group using groupId + selected
		console.log("Add to group", groupId, selected);
		alert(`Add to group ${groupId}: ${selected.join(", ")}`);
	};

	if (isLoading) return <p>Loading users…</p>;
	if (isError) return <p className="text-red-500">Failed to load users</p>;

	return (
		<div className="p-4">
			<h2 className="text-lg font-semibold mb-4">Select Members</h2>

			<div className="space-y-2">
				{users.map((u: any) => (
					<div
						key={u._id}
						className="flex items-center justify-between rounded-md border px-3 py-2"
					>
						<div>
							<div className="font-medium">{u.firstName} {u.lastName}</div>
							<div className="text-sm text-gray-500">{u.email}</div>
						</div>
						<div>
							<input
								type="checkbox"
								checked={selected.includes(u._id)}
								onChange={() => toggle(u._id)}
							/>
						</div>
					</div>
				))}
			</div>

			<div className="mt-4 flex justify-end">
				<button
					onClick={handleAdd}
					disabled={selected.length === 0}
					className="rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
				>
					Add Selected ({selected.length})
				</button>
			</div>
		</div>
	);
}

