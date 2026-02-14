"use client";

import {
  ChevronDown,
  ChevronUp,
  Users,
  Trash2,
  Loader2,
  UserMinus,
  Pencil,
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

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const [deletingGroupId, setDeletingGroupId] = useState<string | null>(null);

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
      const res = await api.get<BackendResponse<any>>(`/api/share/${groupId}`);

      if (!res.data.success) {
        throw new Error(res.data.message);
      }

      setMembersCache((prev) => ({
        ...prev,
        [groupId]: res.data.data.selectedUsers ?? [],
      }));
    } catch (err) {
      console.error(err);
      error("Failed to load members");
    } finally {
      setFetchingId(null);
    }
  };

  const handleShareGroup = (group: Group) => {
    router.push(`/selected-candidates?shareId=${group._id}`);
  };

  /* ================= EDIT ================= */

  const handleOpenEditModal = (
    e: React.MouseEvent,
    groupId: string,
    currentName: string
  ) => {
    e.stopPropagation();
    setEditingGroup({ id: groupId, name: currentName });
    setIsEditModalOpen(true);
  };

  const handleUpdateNameSubmit = () => {
    if (!editingGroup || !editingGroup.name.trim()) return;

    setIsUpdating(true);

    updateGroup(
      {
        groupId: editingGroup.id,
        newName: editingGroup.name.trim(),
      },
      {
        onSuccess: () => {
          success("Group name updated");
          setIsEditModalOpen(false);
          queryClient.invalidateQueries({ queryKey: ["groups"] });
        },
        onError: () => error("Update failed"),
        onSettled: () => setIsUpdating(false),
      }
    );
  };

  /* ================= DELETE ================= */

  const handleDeleteSubmit = () => {
    if (!deletingGroupId) return;

    deleteGroup(deletingGroupId, {
      onSuccess: () => {
        success("Group deleted");
        setDeletingGroupId(null);
        queryClient.invalidateQueries({ queryKey: ["groups"] });
      },
      onError: () => error("Delete failed"),
    });
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

  /* ================= UI ================= */

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
                  <p className="text-xs text-slate-600">
                    {group.memberCount ?? 0} Members
                  </p>
                </div>
              </div>

              <div className="flex gap-3 items-center">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleShareGroup(group);
                  }}
                  className="p-2 hover:text-blue-600 cursor-pointer"
                >
                  <Share size={18} />
                </button>

                <button
                  onClick={(e) =>
                    handleOpenEditModal(e, group._id, group.groupName)
                  }
                  className="p-2 hover:text-blue-600 cursor-pointer"
                >
                  <Pencil size={18} />
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setDeletingGroupId(group._id);
                  }}
                  className="p-2 hover:text-red-600 cursor-pointer"
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
                          className="cursor-pointer hover:text-red-600"
                          onClick={() =>
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
                                onError: () => error("Remove failed"),
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
                          onClick={() => setOpenAddForGroup(group._id)}
                          className="w-full border-dashed border border-slate-300 py-2 rounded text-sm hover:bg-white cursor-pointer"
                        >
                          + Add Member
                        </button>
                      ) : (
                        <div className="space-y-3">
                          <input
                            value={userSearchQuery}
                            onChange={(e) =>
                              setUserSearchQuery(e.target.value)
                            }
                            placeholder="Search user..."
                            className="w-full border px-3 py-2 rounded text-sm"
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
                                className="cursor-pointer text-sm hover:bg-blue-50 p-2 rounded"
                              >
                                {u.firstName} {u.lastName} ({u.email})
                              </div>
                            ))}

                          <div className="flex gap-2">
                            <button
                              disabled={!selectedUserId}
                              className={`flex-1 bg-blue-600 text-white py-2 rounded text-sm 
                              ${
                                !selectedUserId
                                  ? "cursor-not-allowed opacity-50"
                                  : "cursor-pointer"
                              }`}
                              onClick={() =>
                                addUserToGroup(
                                  {
                                    groupId: group._id,
                                    userId: selectedUserId,
                                  },
                                  {
                                    onSuccess: async () => {
                                      success("Member added");
                                      await fetchGroupMembers(group._id);
                                      queryClient.invalidateQueries({
                                        queryKey: ["groups"],
                                      });
                                      setOpenAddForGroup(null);
                                      setSelectedUserId("");
                                      setUserSearchQuery("");
                                    },
                                    onError: () => error("Add failed"),
                                  }
                                )
                              }
                            >
                              Add
                            </button>

                            <button
                              onClick={() => {
                                setOpenAddForGroup(null);
                                setSelectedUserId("");
                                setUserSearchQuery("");
                              }}
                              className="px-3 py-2 text-sm cursor-pointer"
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

      {/* EDIT MODAL */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40">
          <div className="w-[380px] bg-white rounded-2xl p-6 shadow-2xl">
            <h2 className="text-xl font-bold mb-4">Update Group Name</h2>

            <input
              autoFocus
              className="w-full border px-4 py-3 rounded"
              value={editingGroup?.name || ""}
              onChange={(e) =>
                setEditingGroup((prev) =>
                  prev ? { ...prev, name: e.target.value } : null
                )
              }
            />

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="cursor-pointer"
              >
                Cancel
              </button>

              <button
                onClick={handleUpdateNameSubmit}
                disabled={isUpdating}
                className={`bg-blue-600 text-white px-6 py-2 rounded 
                ${
                  isUpdating
                    ? "cursor-not-allowed opacity-50"
                    : "cursor-pointer"
                }`}
              >
                {isUpdating ? (
                  <Loader2 className="animate-spin h-4 w-4" />
                ) : (
                  "Save"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE MODAL */}
      {deletingGroupId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40">
          <div className="w-[380px] bg-white rounded-2xl p-6 shadow-2xl">
            <h2 className="text-xl font-bold mb-4 text-red-600">
              Are you sure?
            </h2>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeletingGroupId(null)}
                className="cursor-pointer"
              >
                Cancel
              </button>

              <button
                onClick={handleDeleteSubmit}
                className="bg-red-600 text-white px-6 py-2 rounded cursor-pointer"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
