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
  Share,
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
  BackendResponse,
} from "@/types/shareInterfaceCandidate";

export default function GroupsTable() {
  const { data: groups = [] } = useGroups();
  const queryClient = useQueryClient();
  const { success, error } = useToast();
  const router = useRouter();

  /* ================= STATE ================= */

  const [expandedGroupId, setExpandedGroupId] = useState<string | null>(null);
  const [membersCache, setMembersCache] = useState<
    Record<string, GroupUser[]>
  >({});
  const [fetchingId, setFetchingId] = useState<string | null>(null);

  const [openAddForGroup, setOpenAddForGroup] = useState<string | null>(null);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [userSearchQuery, setUserSearchQuery] = useState("");

  const debouncedSearch = useDebounce(userSearchQuery, 400);
  const { data: usersData } = useInfiniteUsers(debouncedSearch);

  const users: GroupUser[] =
    usersData?.pages.flatMap((p: any) => p.data) ?? [];

  /* ================= MUTATIONS ================= */

  const { mutate: deleteGroup } = useDeleteGroup();
  const { mutate: updateGroup } = useUpdateGroup();
  const { mutate: addUserToGroup } = useAddUserToGroup();
  const { mutate: removeUser } = useRemoveUserFromGroup();

  /* ================= FETCH MEMBERS ================= */

  const fetchGroupMembers = async (groupId: string) => {
    try {
      setFetchingId(groupId);

      const res = await api.get<BackendResponse<any>>(
        `/api/share/${groupId}`
      );

      if (!res.data.success) {
        throw new Error(res.data.message);
      }

      setMembersCache((prev) => ({
        ...prev,
        [groupId]: res.data.data.selectedUsers ?? [],
      }));
    } catch (err) {
      console.error("Fetch members error:", err);
      error("Failed to load members");
    } finally {
      setFetchingId(null);
    }
  };

  /* ================= TOGGLE ================= */

  const toggleGroup = (id: string) => {
    if (expandedGroupId === id) {
      setExpandedGroupId(null);
      return;
    }

    setExpandedGroupId(id);

    if (!membersCache[id]) {
      fetchGroupMembers(id);
    }
  };

  /* ================= RENDER ================= */

  return (
    <div className="space-y-4 p-6 bg-slate-50 min-h-screen">
      {groups.map((group: Group) => {
        const members = membersCache[group._id] ?? [];

        return (
          <div
            key={group._id}
            className="bg-white border rounded-xl shadow-sm"
          >
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
                    {group.memberCount ?? 0} Members
                  </p>
                </div>
              </div>

              <div className="flex gap-3 items-center">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(
                      `/selected-candidates?shareId=${group._id}`
                    );
                  }}
                >
                  <Share size={18} />
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteGroup(group._id, {
                      onSuccess: () =>
                        success("Group deleted successfully"),
                      onError: () => error("Delete failed"),
                    });
                  }}
                >
                  <Trash2 size={16} />
                </button>

                {expandedGroupId === group._id ? (
                  <ChevronUp />
                ) : (
                  <ChevronDown />
                )}
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
                    {/* MEMBER LIST */}
                    {members.map((user: GroupUser) => (
                      <div
                        key={user._id}
                        className="flex justify-between items-center px-4 py-3 border-b"
                      >
                        <div>
                          <p className="text-sm font-medium">
                            {user.firstName} {user.lastName}
                          </p>
                          <p className="text-xs text-gray-500">
                            {user.email}
                          </p>
                        </div>

                        <button
                          onClick={() =>
                            removeUser(
                              {
                                groupId: group._id,
                                userId: user._id,
                              },
                              {
                                onSuccess: async () => {
                                  success("User removed");
                                  await fetchGroupMembers(group._id);
                                  queryClient.invalidateQueries({
                                    queryKey: ["groups"],
                                  });
                                },
                                onError: () =>
                                  error("Remove failed"),
                              }
                            )
                          }
                        >
                          <UserMinus size={16} />
                        </button>
                      </div>
                    ))}

                    {/* ADD MEMBER */}
                    <div className="p-4 bg-slate-50">
                      {openAddForGroup !== group._id ? (
                        <button
                          onClick={() =>
                            setOpenAddForGroup(group._id)
                          }
                          className="w-full border-dashed border py-2 rounded"
                        >
                          <UserPlus size={14} /> Add Member
                        </button>
                      ) : (
                        <div className="space-y-3">
                          <input
                            value={userSearchQuery}
                            onChange={(e) =>
                              setUserSearchQuery(
                                e.target.value
                              )
                            }
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
                                {u.firstName} {u.lastName} (
                                {u.email})
                              </div>
                            ))}

                          <div className="flex gap-2">
                            <button
                              disabled={!selectedUserId}
                              onClick={() =>
                                addUserToGroup(
                                  {
                                    groupId: group._id,
                                    userId: selectedUserId,
                                  },
                                  {
                                    onSuccess: async () => {
                                      success("Member added");
                                      await fetchGroupMembers(
                                        group._id
                                      );
                                      queryClient.invalidateQueries(
                                        {
                                          queryKey: ["groups"],
                                        }
                                      );
                                      setOpenAddForGroup(null);
                                      setSelectedUserId("");
                                      setUserSearchQuery("");
                                    },
                                    onError: () =>
                                      error("Add failed"),
                                  }
                                )
                              }
                              className="flex-1 bg-blue-600 text-white py-2 rounded disabled:opacity-50"
                            >
                              Add
                            </button>

                            <button
                              onClick={() => {
                                setOpenAddForGroup(null);
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
        );
      })}
    </div>
  );
}
