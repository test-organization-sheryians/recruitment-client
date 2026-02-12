"use client";

import {
  ChevronDown,
  ChevronUp,
  UserPlus,
  Users,
  Trash2,
  Loader2,
  Plus,
  UserMinus,
  Pencil,
  PencilLine,
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

export default function GroupsTable() {
  const { data: groups } = useGroups();
  
  const [userSearchQuery, setUserSearchQuery] = useState("");
  const debouncedUserSearch = useDebounce(userSearchQuery, 400);
  const normalizedSearch = debouncedUserSearch.trim().replace(/\s+/g, " ");
  
  const { data: usersData } = useInfiniteUsers(normalizedSearch);

  const [expandedGroupId, setExpandedGroupId] = useState<string | null>(null);
  const [membersCache, setMembersCache] = useState<{ [key: string]: any[] }>({});
  const [fetchingId, setFetchingId] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<{ id: string; name: string } | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const [openGroupId, setOpenGroupId] = useState<string | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<string>("");

  const { success, error } = useToast();
  const queryClient = useQueryClient();

  const { mutate: addUserToGroup } = useAddUserToGroup();
  const { mutate: deleteGroup } = useDeleteGroup();
  const { mutate: removeUser } = useRemoveUserFromGroup();
  const { mutate: updateGroup } = useUpdateGroup();

  const fetchGroupMembers = async (groupId: string) => {
    setFetchingId(groupId);
    try {
      const res = await api.get(`/api/share/${groupId}`);
      setMembersCache((prev) => ({
        ...prev,
        [groupId]: res.data.data || [],
      }));
    } catch {
      error("Could not load members");
    } finally {
      setFetchingId(null);
    }
  };

  const handleOpenEditModal = (e: React.MouseEvent, groupId: string, currentName: string) => {
    e.stopPropagation(); // Card expand/collapse hone se rokne ke liye
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

  const toggleGroup = (id: string) => {
    if (expandedGroupId === id) {
      setExpandedGroupId(null);
    } else {
      setExpandedGroupId(id);
      if (!membersCache[id]) fetchGroupMembers(id);
    }
  };

  const users = usersData?.pages.flatMap((page) => page.data) || [];

  return (
    <div className="space-y-4 p-6 bg-slate-50 min-h-screen">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold text-slate-800">Manage Groups</h1>
      </div>

      {/* GROUP LIST */}
      {groups?.map((group: any) => (
        <div key={group._id} className="bg-white border rounded-xl overflow-hidden shadow-sm mb-3">
          <div
            className={`p-4 flex items-center justify-between cursor-pointer hover:bg-slate-50 ${
              expandedGroupId === group._id ? "bg-slate-50/50" : ""
            }`}
            onClick={() => toggleGroup(group._id)}
          >
            <div className="flex items-center gap-4 flex-1">
              <div className="bg-blue-100 p-2.5 rounded-lg">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-slate-800">{group.groupName}</h3>
                <p className="text-xs text-slate-500">
                  {membersCache[group._id]?.length || group.members?.length || 0} Members
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={(e) => handleOpenEditModal(e, group._id, group.groupName)}
                className="p-2 text-slate-400 hover:text-amber-600 transition-colors"
                title="Edit Group Name"
              >
                <Pencil size={18} />
              </button>

              {/* <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (confirm("Are you sure you want to delete this group?")) {
                    deleteGroup(group._id, {
                      onSuccess: () => success("Group deleted successfully"),
                      onError: () => error("Failed to delete group"),
                    });
                  }
                }}
                className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                title="Delete Group"
              >
                <Trash2 size={18} />
              </button> */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  
                  deleteGroup(group._id, {
                    onSuccess: () => {
                      success("Group deleted successfully");
                      queryClient.invalidateQueries({ queryKey: ["groups"] });
                    },
                    onError: () => error("Failed to delete group"),
                  });
                }}
                className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                title="Delete Group"
              >
                <Trash2 size={18} />
              </button>
              {expandedGroupId === group._id ? <ChevronUp className="text-slate-400" /> : <ChevronDown className="text-slate-400" />}
            </div>
          </div>

          {/* MEMBERS SECTION */}
          {expandedGroupId === group._id && (
            <div className="border-t bg-white">
              <div className="px-6 py-2 bg-slate-50/80 flex justify-between text-[10px] font-bold text-slate-400 uppercase">
                <span>Member Name</span>
                <span>Actions</span>
              </div>

              <div className="divide-y">
                {fetchingId === group._id ? (
                  <div className="py-8 flex justify-center">
                    <Loader2 className="animate-spin text-blue-500" />
                  </div>
                ) : membersCache[group._id]?.length > 0 ? (
                  membersCache[group._id].map((member: any) => {
                    const name = member.firstName || member.lastName ? `${member.firstName} ${member.lastName}` : "Unknown User";
                    return (
                      <div key={member._id} className="px-6 py-4 flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-xs font-bold text-blue-700">
                            {name[0]}
                          </div>
                          <div>
                            <p className="text-sm font-semibold">{name}</p>
                            <p className="text-xs text-slate-400">{member.email || "No email"}</p>
                          </div>
                        </div>

                        <button
                          onClick={() =>
                            removeUser(
                              { groupId: group._id, userId: member._id },
                              {
                                onSuccess: () => {
                                  success("User removed");
                                  fetchGroupMembers(group._id);
                                  queryClient.invalidateQueries({ queryKey: ["groups"] });
                                },
                              }
                            )
                          }
                          className="text-slate-300 hover:text-red-500 transition-colors"
                        >
                          <UserMinus size={18} />
                        </button>
                      </div>
                    );
                  })
                ) : (
                  <div className="py-8 text-center text-xs text-slate-400 italic">This group is empty</div>
                )}
              </div>
          
              {/* ADD USER SECTION */}
              <div className="p-4 border-t bg-slate-50/50 relative">
                {!openGroupId ? (
                  <button
                    onClick={() => setOpenGroupId(group._id)}
                    className="w-full py-2 border-2 border-dashed border-slate-200 rounded-lg text-slate-400 text-xs font-medium hover:border-blue-300 hover:text-blue-500 transition-all flex items-center justify-center gap-2"
                  >
                    <UserPlus size={14} /> Add New Member
                  </button>
                ) : (
                  <div className="space-y-3 animate-in fade-in slide-in-from-top-1">
                    <div className="relative">
                      <input
                        autoFocus
                        type="text"
                        placeholder="Search by name or email..."
                        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                        value={userSearchQuery}
                        onChange={(e) => {
                            setUserSearchQuery(e.target.value);
                            setSelectedUserId("");
                        }}
                      />
                      {userSearchQuery && !selectedUserId && (
                        <div className="absolute left-0 right-0 bottom-full mb-2 z-[50] bg-white border rounded-lg shadow-xl max-h-48 overflow-y-auto">
                          {users
                            .filter(u => (u.firstName + u.lastName + u.email).toLowerCase().includes(userSearchQuery.toLowerCase()))
                            .map(u => (
                              <div 
                                key={u._id} 
                                className="p-2 hover:bg-blue-50 cursor-pointer text-sm"
                                onClick={() => {
                                    setSelectedUserId(u._id);
                                    setUserSearchQuery(`${u.firstName} ${u.lastName}`);
                                }}
                              >
                                {u.firstName} {u.lastName} <span className="text-xs text-slate-400">({u.email})</span>
                              </div>
                            ))}
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button 
                        disabled={!selectedUserId}
                        onClick={() => addUserToGroup({ groupId: group._id, userId: selectedUserId }, { 
                            onSuccess: () => {
                                fetchGroupMembers(group._id);
                                queryClient.invalidateQueries({ queryKey: ["groups"] });
                                setOpenGroupId(null);
                                setUserSearchQuery("");
                            } 
                        })}
                        className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-xs font-bold disabled:opacity-50"
                      >
                        Add Member
                      </button>
                      <button onClick={() => setOpenGroupId(null)} className="px-3 py-2 text-xs text-slate-500">Cancel</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      ))}

      {/* EDIT MODAL - Keep outside the loop for correct Z-index */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="w-[380px] bg-white rounded-2xl p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-amber-100 p-2 rounded-lg text-amber-600">
                <PencilLine size={20} />
              </div>
              <h2 className="text-xl font-bold text-slate-800">Rename Group</h2>
            </div>

            <input
              autoFocus
              className="w-full rounded-xl border-2 border-slate-100 px-4 py-3 focus:border-amber-500 outline-none transition-all"
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
                className="bg-amber-500 text-white px-6 py-2 rounded-xl text-sm font-bold hover:bg-amber-600 disabled:opacity-50 flex items-center gap-2 transition-all shadow-md shadow-amber-100"
              >
                {isUpdating ? <Loader2 className="animate-spin h-4 w-4" /> : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}