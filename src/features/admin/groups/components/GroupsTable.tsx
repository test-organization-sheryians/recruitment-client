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

interface UsersPage {
  data: GroupUser[];
}

export default function GroupsTable() {
  const { data: groups = [], isLoading, isError, error: fetchError } = useGroups();
  const queryClient = useQueryClient();
  const { success, error } = useToast();
  const router = useRouter();

  /* ================= STATE ================= */
  const [expandedGroupId, setExpandedGroupId] = useState<string | null>(null);
  const [membersCache, setMembersCache] = useState<Record<string, GroupUser[]>>({});
  const [fetchingId, setFetchingId] = useState<string | null>(null);
  const [openAddForGroup, setOpenAddForGroup] = useState<string | null>(null);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [userSearchQuery, setUserSearchQuery] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<{ id: string; name: string } | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [deletingGroupId, setDeletingGroupId] = useState<string | null>(null);

  const debouncedSearch = useDebounce(userSearchQuery, 400);
  const { data: usersData } = useInfiniteUsers(debouncedSearch);

  const users: GroupUser[] = usersData?.pages.flatMap((p: UsersPage) => p.data) ?? [];

  /* ================= HANDLERS ================= */
  const fetchGroupMembers = async (groupId: string) => {
    try {
      setFetchingId(groupId);
      const res = await api.get<BackendResponse<{ selectedUsers: GroupUser[] }>>(`/api/share/${groupId}`);
      if (!res.data.success) throw new Error(res.data.message);

      setMembersCache((prev) => ({
        ...prev,
        [groupId]: res.data.data.selectedUsers ?? [],
      }));
    } catch (err) {
      error("Failed to load members");
    } finally {
      setFetchingId(null);
    }
  };

  const toggleGroup = (id: string) => {
    // Common reset logic for both opening and closing
    setOpenAddForGroup(null);
    setSelectedUserId("");
    setUserSearchQuery("");

    if (expandedGroupId === id) {
      setExpandedGroupId(null);
      return; // Collapsing the group
    }
   // Opening a new group
    setExpandedGroupId(id);
    if (!membersCache[id]) fetchGroupMembers(id);
  };

  const handleUpdateNameSubmit = () => {
    if (!editingGroup || !editingGroup.name.trim()) return;
    setIsUpdating(true);
    updateGroup(
      { groupId: editingGroup.id, newName: editingGroup.name.trim() },
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

  /* ================= MUTATIONS ================= */
  const { mutate: deleteGroup,isPending: isDeleting } = useDeleteGroup();
  const { mutate: updateGroup } = useUpdateGroup();
  const { mutate: addUserToGroup,isPending: isAddingUser } = useAddUserToGroup();
  const { mutate: removeUser } = useRemoveUserFromGroup();

  /* ================= CONDITIONAL UI ================= */
  if (isLoading) return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
      <Loader2 className="animate-spin text-blue-600 h-10 w-10" />
      <p className="text-slate-600 animate-pulse font-medium">Loading your groups...</p>
    </div>
  );

  if (isError) return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-4 p-6">
       <p className="text-red-600 font-semibold">{fetchError?.message || "Failed to fetch groups"}</p>
       <button onClick={() => window.location.reload()} className="bg-red-600 text-white px-4 py-2 rounded">Try Again</button>
    </div>
  );

  if (groups.length === 0) return (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-slate-500 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 m-6">
      <Users size={48} className="mb-4 opacity-20" />
      <p className="text-lg font-medium">No groups found</p>
    </div>
  );

  return (
    <div className="space-y-4 p-6 bg-slate-50 rounded-xl min-h-screen">
      {groups.map((group: Group) => {
        const members = membersCache[group._id] ?? [];
        return (
          <div key={group._id} className="bg-white border rounded-xl shadow-sm overflow-hidden">
            {/* GROUP HEADER */}
            <div 
              onClick={() => toggleGroup(group._id)}
              className="p-4 flex justify-between items-center cursor-pointer hover:bg-slate-50"
            >
              <div className="flex items-center gap-3">
                <Users className="text-blue-600" />
                <div>
                  <h3 className="font-semibold">{group.groupName}</h3>
                  <p className="text-xs text-slate-600">{group.memberCount ?? 0} Members</p>
                </div>
              </div>
              <div className="flex gap-3 items-center">
                <Share size={18} className="hover:text-blue-600" onClick={(e) => { e.stopPropagation(); router.push(`/admin/groups/selected-candidates?shareId=${group._id}`); }} />
                <Pencil size={18} className="hover:text-blue-600" onClick={(e) => { e.stopPropagation(); setEditingGroup({ id: group._id, name: group.groupName }); setIsEditModalOpen(true); }} />
                <Trash2 size={16} className="hover:text-red-600" onClick={(e) => { e.stopPropagation(); setDeletingGroupId(group._id); }} />
                {expandedGroupId === group._id ? <ChevronUp /> : <ChevronDown />}
              </div>
            </div>

            {/* EXPANDED MEMBERS LIST */}
            {expandedGroupId === group._id && (
              <div className="border-t bg-white">
                {fetchingId === group._id ? (
                  <div className="py-6 flex justify-center"><Loader2 className="animate-spin text-blue-500" /></div>
                ) : (
                  <>
                    {members.map((user) => (
                      <div key={user._id} className="flex justify-between items-center px-4 py-3 border-b">
                        <div>
                          <p className="text-sm font-medium">{user.firstName} {user.lastName}</p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                        <button 
                          onClick={() => removeUser({ groupId: group._id, userId: user._id }, { onSuccess: () => { success("User removed"); fetchGroupMembers(group._id); queryClient.invalidateQueries({ queryKey: ["groups"] }); }})}
                          className="text-gray-400 hover:text-red-600"
                        >
                          <UserMinus size={16} />
                        </button>
                      </div>
                    ))}
                    
                    {/* ADD MEMBER SECTION */}
                    <div className="p-4 bg-slate-50">
                      {openAddForGroup !== group._id ? (
                          <button
                            onClick={() => setOpenAddForGroup(group._id)} className="w-full border-dashed border border-slate-300 py-2 rounded text-sm hover:bg-white">+ Add Member</button>
                      ) : (
                        <div className="space-y-3">
                          <input 
                            value={userSearchQuery} 
                            onChange={(e) => setUserSearchQuery(e.target.value)} 
                            placeholder="Search user..." 
                            className="w-full border px-3 py-2 rounded text-sm"
                          />
                              {userSearchQuery && !selectedUserId && 
                              
                           users.map((u) => (
                                  <div key={u._id} onClick={() => { setSelectedUserId(u._id); setUserSearchQuery(`${u.firstName} ${u.lastName}`); }} className="cursor-pointer text-sm hover:bg-blue-50 p-2 rounded">
                                    {u.firstName} {u.lastName} ({u.email})
                                  </div>
                          ))}
                          <div className="flex gap-2">
                            <button 
                              disabled={!selectedUserId || isAddingUser} 
                                  onClick={() => addUserToGroup({ groupId: group._id, userId: selectedUserId }, {
                                    onSuccess: () => {
                                      success("Member added");
                                      // Refresh local cache
                                      fetchGroupMembers(group._id); setOpenAddForGroup(null); setSelectedUserId(""); setUserSearchQuery(""); 

                                    }
                                  })}
                                  className="flex-1 bg-blue-600 text-white py-2 rounded text-sm disabled:opacity-50"
                                  
                            >{isAddingUser ? <Loader2 className="animate-spin " /> : "Add"}</button>
                            <button onClick={() => setOpenAddForGroup(null)} className="px-3 py-2 text-sm">Cancel</button>
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
              className="w-full border px-4 py-3 rounded mb-6" 
              value={editingGroup?.name || ""} 
              onChange={(e) => setEditingGroup(prev => prev ? {...prev, name: e.target.value} : null)} 
            />
            <div className="flex justify-end gap-3">
              <button onClick={() => setIsEditModalOpen(false)}>Cancel</button>
              <button onClick={handleUpdateNameSubmit} disabled={isUpdating} className="bg-blue-600 text-white px-6 py-2 rounded disabled:opacity-50">
                {isUpdating ? <Loader2 className="animate-spin h-4 w-4" /> : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE MODAL */}
      {deletingGroupId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40">
          <div className="w-[380px] bg-white rounded-2xl p-6 shadow-2xl text-center">
            <h2 className="text-xl font-bold mb-4 text-red-600">Are you sure?</h2>
            <div className="flex justify-center gap-3">
              <button onClick={() => setDeletingGroupId(null)} className="px-4 py-2">Cancel</button>
              <button onClick={handleDeleteSubmit}
                disabled={isDeleting}
                className="bg-red-600 text-white px-6 py-2 rounded">{isDeleting ? "Deleting..." : "Delete Group"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}