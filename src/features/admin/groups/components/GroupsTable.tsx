"use client";

import {
  ChevronDown,
  ChevronUp,
  Users,
  Trash2,
  Loader2,
  UserMinus,
  Pencil,
  UserPlus,
  Share, // <-- added share icon
} from "lucide-react";
import { useState } from "react";
import {
  useDeleteGroup,
  useAddUserToGroup,
  useGroups,
  useUpdateGroup,
  useRemoveUserFromGroup,
} from "../hooks/useGroups";
import { useInfiniteUsers } from "../../users/hooks/useUser";
import { useDebounce } from "../../users/hooks/useDebounce";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/Toast";
import api from "@/config/axios";
import { useRouter } from "next/navigation";
import {
  Group,
  GroupUser,
  UpdateGroupPayload,
  BackendResponse,
} from "@/types/shareInterfaceCandidate";

export default function GroupsTable() {
  const { data: groups } = useGroups();
  const queryClient = useQueryClient();
  const { success, error } = useToast();
  const router = useRouter();

  /* ================= STATE ================= */
  const [expandedGroupId, setExpandedGroupId] = useState<string | null>(null);
  const [membersCache, setMembersCache] = useState<Record<string, GroupUser[]>>(
    {}
  );
  const [fetchingId, setFetchingId] = useState<string | null>(null);

  const [openGroupId, setOpenGroupId] = useState<string | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [userSearchQuery, setUserSearchQuery] = useState<string>("");

  const debouncedSearch = useDebounce(userSearchQuery, 400);
  const { data: usersData } = useInfiniteUsers(debouncedSearch);

  const users: GroupUser[] =
    usersData?.pages.flatMap((page: { data: GroupUser[] }) => page.data) ?? [];

  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [editingGroup, setEditingGroup] = useState<{
    id: string;
    name: string;
  } | null>(null);

  /* ================= MUTATIONS ================= */
  const { mutate: deleteGroup } = useDeleteGroup();
  const { mutate: updateGroup } = useUpdateGroup();
  const { mutate: addUserToGroup } = useAddUserToGroup();
  const { mutate: removeUser } = useRemoveUserFromGroup();

  /* ================= FETCH MEMBERS ================= */
  const fetchGroupMembers = async (groupId: string) => {
    if (!groupId) return;

    setFetchingId(groupId);

    try {
      const res = await api.get<BackendResponse<Group>>(
        `/api/share/group/${groupId}`
      );

      if (!res.data.success) throw new Error(res.data.message);

      const members = res.data.data.selectedUsers || [];

      setMembersCache((prev) => ({
        ...prev,
        [groupId]: members,
      }));
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error("Fetch member error:", err.message);
      } else if (typeof err === "object" && err !== null && "response" in err) {
        // @ts-expect-error
        console.error("Fetch member error:", err.response?.data);
      } else {
        console.error("Fetch member error:", err);
      }
      error("Failed to load members");
    } finally {
      setFetchingId(null);
    }
  };
  
  const handleShareGroup = (group: any) => {
  router.push(`/selected-candidates?shareId=${group._id}`);
};

  /* ================= TOGGLE ================= */
  const toggleGroup = (id: string) => {
    if (expandedGroupId === id) {
      setExpandedGroupId(null);
    } else {
      setExpandedGroupId(id);
      if (!membersCache[id]) fetchGroupMembers(id);
    }
  };

  /* ================= RENAME ================= */
  const handleRename = () => {
    if (!editingGroup?.name.trim()) return;

    const payload: UpdateGroupPayload = {
      groupId: editingGroup.id,
      newName: editingGroup.name.trim(),
    };

    updateGroup(payload, {
      onSuccess: () => {
        success("Group renamed successfully");
        setIsEditModalOpen(false);
        queryClient.invalidateQueries({ queryKey: ["groups"] });
      },
      onError: () => error("Rename failed"),
    });
  };

  /* ================= RENDER ================= */
  return (
    <div className="space-y-4 p-6 bg-slate-50 min-h-screen">
      {groups?.map((group: Group) => (
        <div key={group._id} className="bg-white border rounded-xl shadow-sm">
          {/* HEADER */}
          <div
            onClick={() => toggleGroup(group._id)}
            className="p-4 flex justify-between items-center cursor-pointer hover:bg-slate-50"
          >
            <div className="flex items-center gap-3">
              <Users className="text-blue-600" />
              <div>
                <h3 className="font-semibold">{group.groupName}</h3>
                <p className="text-xs text-slate-400">
                  {membersCache[group._id]?.length ??
                    group.selectedUsers?.length ??
                    0}{" "}
                  Members
                </p>
              </div>
            </div>

            <div className="flex gap-3 items-center">
             <button onClick={(e) => { e.stopPropagation(); handleShareGroup(group); }} className="p-2 text-slate-400 hover:text-blue-600 transition-colors" title="Share Group" > <Share size={18} /> </button>

              {/* EDIT BUTTON */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setEditingGroup({
                    id: group._id,
                    name: group.groupName,
                  });
                  setIsEditModalOpen(true);
                }}
              >
                <Pencil size={16} />
              </button>

             
           

              {/* DELETE BUTTON */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteGroup(group._id, {
                    onSuccess: () => success("Group deleted successfully"),
                    onError: () => error("Failed to delete group"),
                  });
                }}
              >
                <Trash2 size={16} />
              </button>

              {expandedGroupId === group._id ? <ChevronUp /> : <ChevronDown />}
            </div>
          </div>

          {/* MEMBERS */}
          {expandedGroupId === group._id && (
            <div className="border-t">
              {fetchingId === group._id ? (
                <div className="py-6 flex justify-center">
                  <Loader2 className="animate-spin text-blue-500" />
                </div>
              ) : (
                <>
                  {(membersCache[group._id] ?? group.selectedUsers ?? []).map(
                    (user: GroupUser) => (
                      <div
                        key={user._id}
                        className="flex items-center justify-between px-4 py-3 border-b"
                      >
                        <div>
                          <p className="text-sm font-medium">
                            {user.firstName} {user.lastName}
                          </p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>

                        <button
                          onClick={() => {
                            removeUser(
                              { groupId: group._id, userId: user._id },
                              {
                                onSuccess: async () => {
                                  success("User removed");
                                  await fetchGroupMembers(group._id);
                                  queryClient.invalidateQueries({
                                    queryKey: ["groups"],
                                  });
                                },
                              }
                            );
                          }}
                        >
                          <UserMinus size={16} />
                        </button>
                      </div>
                    )
                  )}

                  {/* ADD MEMBER */}
                  <div className="p-4 bg-slate-50">
                    {!openGroupId ? (
                      <button
                        onClick={() => setOpenGroupId(group._id)}
                        className="w-full border-dashed border py-2 rounded"
                      >
                        <UserPlus size={14} /> Add Member
                      </button>
                    ) : (
                      <div className="space-y-3">
                        <input
                          value={userSearchQuery}
                          onChange={(e) => setUserSearchQuery(e.target.value)}
                          placeholder="Search user..."
                          className="w-full border px-3 py-2 rounded"
                        />

                        {userSearchQuery &&
                          users.map((u: GroupUser) => (
                            <div
                              key={u._id}
                              onClick={() => {
                                setSelectedUserId(u._id);
                                setUserSearchQuery(
                                  `${u.firstName} ${u.lastName}`
                                );
                              }}
                              className="cursor-pointer text-sm hover:bg-blue-50 p-2"
                            >
                              {u.firstName} {u.lastName} ({u.email})
                            </div>
                          ))}

                        <div className="flex gap-2">
                          <button
                            disabled={!selectedUserId}
                            onClick={() =>
                              addUserToGroup(
                                { groupId: group._id, userId: selectedUserId },
                                {
                                  onSuccess: async () => {
                                    success("Member added successfully");
                                    await fetchGroupMembers(group._id);
                                    queryClient.invalidateQueries({
                                      queryKey: ["groups"],
                                    });
                                    setOpenGroupId(null);
                                    setSelectedUserId("");
                                    setUserSearchQuery("");
                                  },
                                  onError: () => error("Failed to add member"),
                                }
                              )
                            }
                            className="flex-1 bg-blue-600 text-white py-2 rounded disabled:opacity-50"
                          >
                            Add
                          </button>

                          <button
                            onClick={() => {
                              setOpenGroupId(null);
                              setSelectedUserId("");
                              setUserSearchQuery("");
                            }}
                            className="px-3 py-2 text-sm"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      ))}

      {/* RENAME MODAL */}
      {isEditModalOpen && editingGroup && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl w-[350px]">
            <h2 className="font-bold mb-4">Rename Group</h2>
            <input
              value={editingGroup.name}
              onChange={(e) =>
                setEditingGroup((prev) =>
                  prev ? { ...prev, name: e.target.value } : null
                )
              }
              className="w-full border px-3 py-2 rounded"
            />

            <div className="flex justify-end gap-3 mt-4">
              <button onClick={() => setIsEditModalOpen(false)}>Cancel</button>

              <button
                onClick={handleRename}
                className="bg-amber-500 text-white px-4 py-2 rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
