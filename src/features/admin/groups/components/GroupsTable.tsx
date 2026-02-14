
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

  // Edit states
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<{ id: string; name: string } | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  // Delete state
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
      console.error("Fetch members error:", err);
      error("Failed to load members");
    } finally {
      setFetchingId(null);
    }
  };

  const handleShareGroup = (group: any) => {
    router.push(`/selected-candidates?shareId=${group._id}`);
  };

  /* ================= EDIT GROUP LOGIC ================= */

  const handleOpenEditModal = (e: React.MouseEvent, groupId: string, currentName: string) => {
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
          success("Group name updated successfully!");
          setIsEditModalOpen(false);
          queryClient.invalidateQueries({ queryKey: ["groups"] });
        },
        onError: () => error("Failed to update group name"),
        onSettled: () => setIsUpdating(false),
      }
    );
  };

  /* ================= DELETE GROUP LOGIC ================= */

  const handleDeleteSubmit = () => {
    if (!deletingGroupId) return;

    deleteGroup(deletingGroupId, {
      onSuccess: () => {
        success("Group deleted successfully");
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
                  <p className="text-xs text-slate-600">
                    {group.memberCount ?? 0} Members
                  </p>
                </div>
              </div>

              <div className="flex gap-3 items-center">
                <button 
                  onClick={(e) => { e.stopPropagation(); handleShareGroup(group); }} 
                  className="p-2 text-slate-800 hover:text-blue-600 transition-colors" 
                  title="Share Group" 
                > 
                  <Share size={18} /> 
                </button>

                <button
                  onClick={(e) => handleOpenEditModal(e, group._id, group.groupName)}
                  className="p-2 text-slate-800 hover:text-blue-600 transition-colors"
                  title="Edit Group Name"
                >
                  <Pencil size={18} />
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setDeletingGroupId(group._id);
                  }}
                  className="p-2 text-slate-800 hover:text-red-600 transition-colors"
                  title="Delete Group"
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

            {/* MEMBERS SECTION */}
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
                          onClick={() =>
                            removeUser(
                              { groupId: group._id, userId: user._id },
                              {
                                onSuccess: async () => {
                                  success("User removed");
                                  await fetchGroupMembers(group._id);
                                  queryClient.invalidateQueries({ queryKey: ["groups"] });
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

                    <div className="p-4 bg-slate-50">
                      {openAddForGroup !== group._id ? (
                        <button
                          onClick={() => setOpenAddForGroup(group._id)}
                          className="w-full border-dashed border border-slate-300 py-2 rounded text-sm text-slate-600 hover:bg-white transition-all"
                        > 
                          + Add Member 
                        </button>
                      ) : (
                        <div className="space-y-3">
                          <input
                            value={userSearchQuery}
                            onChange={(e) => setUserSearchQuery(e.target.value)}
                            placeholder="Search user..."
                            className="w-full border px-3 py-2 rounded text-sm outline-none focus:ring-1 focus:ring-blue-500"
                          />

                          {userSearchQuery &&
                            users.map((u: GroupUser) => (
                              <div
                                key={u._id}
                                onClick={() => {
                                  setSelectedUserId(u._id);
                                  setUserSearchQuery(`${u.firstName} ${u.lastName}`);
                                }}
                                className="cursor-pointer text-sm hover:bg-blue-50 p-2 rounded"
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
                                      success("Member added");
                                      await fetchGroupMembers(group._id);
                                      queryClient.invalidateQueries({ queryKey: ["groups"] });
                                      setOpenAddForGroup(null);
                                      setSelectedUserId("");
                                      setUserSearchQuery("");
                                    },
                                    onError: () => error("Add failed"),
                                  }
                                )
                              }
                              className="flex-1 bg-blue-600 text-white py-2 rounded text-sm disabled:opacity-50"
                            >
                              Add
                            </button>
                            <button
                              onClick={() => {
                                setOpenAddForGroup(null);
                                setSelectedUserId("");
                                setUserSearchQuery("");
                              }}
                              className="px-3 py-2 text-sm text-slate-600"
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

      {/* ================= EDIT MODAL ================= */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="w-[380px] bg-white rounded-2xl p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-blue-50 p-2 rounded-lg text-blue-600">
                <Pencil size={20} />
              </div>
              <h2 className="text-xl font-bold text-slate-800">Update Group Name</h2>
            </div>

            <input
              autoFocus
              className="w-full rounded-xl border-2 border-slate-100 px-4 py-3 focus:border-blue-500 outline-none transition-all"
              placeholder="New group name"
              value={editingGroup?.name || ""}
              onChange={(e) => setEditingGroup((prev) => (prev ? { ...prev, name: e.target.value } : null))}
              onKeyDown={(e) => e.key === "Enter" && handleUpdateNameSubmit()}
            />

            <div className="flex justify-end gap-3 mt-8">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="px-4 py-2 text-sm font-semibold text-slate-500 hover:bg-slate-50 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateNameSubmit}
                disabled={isUpdating || !editingGroup?.name.trim()}
                className="bg-blue-600 text-white px-6 py-2 rounded-xl text-sm font-bold hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2 transition-all shadow-md shadow-blue-100"
              >
                {isUpdating ? <Loader2 className="animate-spin h-4 w-4" /> : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= DELETE CONFIRMATION MODAL ================= */}
      {deletingGroupId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="w-[380px] bg-white rounded-2xl p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center gap-3 mb-4 text-red-600">
              <div className="bg-red-50 p-2 rounded-lg">
                <Trash2 size={24} />
              </div>
              <h2 className="text-xl font-bold">Are you sure?</h2>
            </div>
            <p className="text-slate-600 mb-6">
              
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeletingGroupId(null)}
                className="px-4 py-2 text-sm font-semibold text-slate-500 hover:bg-slate-50 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteSubmit}
                className="bg-red-600 text-white px-6 py-2 rounded-xl text-sm font-bold hover:bg-red-700 transition-all shadow-md shadow-red-100"
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