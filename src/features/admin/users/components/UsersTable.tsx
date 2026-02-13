// "use client";

// import { useQueryClient } from "@tanstack/react-query";
// import {
//   Check,
//   Copy,
//   LinkIcon,
//   Loader2,
//   MoreVertical,
//   Pencil,
//   Trash2,
//   Upload,
//   ArrowRightLeft,
//   Mail,
//   Search,
//   UserPlus,
//   UsersRound,
// } from "lucide-react";
// import { useRouter } from "next/navigation";
// import { useEffect, useMemo, useRef, useState } from "react";

// import { useToast } from "@/components/ui/Toast";
// import { useDebounce } from "@/features/admin/users/hooks/useDebounce";
// import { useCreateShareCandidate } from "@/features/admin/users/hooks/useShareuser";
// import {
//   useDeleteUser,
//   useInfiniteUsers,
//   User,
//   useUpdateUserRole,
// } from "@/features/admin/users/hooks/useUser";
// import { FiEye } from "react-icons/fi";

// export default function UsersTable() {
//   const nameColors = [
//     "from-pink-500/20 to-rose-500/20 text-rose-700 border-rose-200",
//     "from-purple-500/20 to-indigo-500/20 text-indigo-700 border-indigo-200",
//     "from-blue-500/20 to-cyan-500/20 text-cyan-700 border-cyan-200",
//     "from-green-500/20 to-emerald-500/20 text-emerald-700 border-emerald-200",
//     "from-yellow-500/20 to-orange-500/20 text-orange-700 border-orange-200",
//     "from-fuchsia-500/20 to-pink-500/20 text-pink-700 border-pink-200",
//   ];

//   const avatarColors = [
//     "bg-pink-100 text-pink-700",
//     "bg-purple-100 text-purple-700",
//     "bg-indigo-100 text-indigo-700",
//     "bg-blue-100 text-blue-700",
//     "bg-cyan-100 text-cyan-700",
//     "bg-emerald-100 text-emerald-700",
//     "bg-green-100 text-green-700",
//     "bg-yellow-100 text-yellow-700",
//     "bg-orange-100 text-orange-700",
//     "bg-rose-100 text-rose-700",
//     "bg-fuchsia-100 text-fuchsia-700",
//   ];

//   const getSafeIndex = (name = "A", length: number) => {
//     const safe = name || "A";
//     return safe.charCodeAt(0) % length;
//   };

//   const getNameColor = (name = "A") =>
//     nameColors[getSafeIndex(name, nameColors.length)];

//   const getAvatarColor = (name = "A") =>
//     avatarColors[getSafeIndex(name, avatarColors.length)];

//   /* ---------------- SEARCH ---------------- */
//   const [searchQuery, setSearchQuery] = useState("");
//   const debouncedSearch = useDebounce(searchQuery, 400);
//   const normalizedSearch = debouncedSearch.trim().replace(/\s+/g, " ");

//   /* ---------------- DATA ---------------- */
//   const {
//     data,
//     isLoading,
//     isError,
//     fetchNextPage,
//     hasNextPage,
//     isFetchingNextPage,
//   } = useInfiniteUsers(normalizedSearch);

//   const users = useMemo(() => data?.pages.flatMap((p) => p.data) ?? [], [data]);

//   /* ---------------- SELECTION ---------------- */
//   const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
//   const toggleUserSelection = (id: string) => {
//     setSelectedUserIds((prev) =>
//       prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
//     );
//   };

//   const toggleSelectAll = () => {
//     if (selectedUserIds.length === users.length && users.length > 0) {
//       setSelectedUserIds([]);
//     } else {
//       setSelectedUserIds(users.map((user) => user._id));
//     }
//   };

//   const isAllSelected =
//     users.length > 0 && selectedUserIds.length === users.length;
//   const isSomeSelected =
//     selectedUserIds.length > 0 && selectedUserIds.length < users.length;

//   /* ---------------- SHARE ---------------- */
//   const { mutate: shareCandidates, isPending } = useCreateShareCandidate();

//   // Create Group States
//   const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
//   const [newGroupName, setNewGroupName] = useState("");

//   /* ---------------- ACTION STATE ---------------- */
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
//   const [selectedRole, setSelectedRole] = useState("");
//   const [openDeleteMenu, setOpenDeleteMenu] = useState<string | null>(null);
//   const [isSaving, setIsSaving] = useState(false);
//   const [link, setLink] = useState<string>("");
//   const [showLink, setShowLink] = useState(false);
//   const [copied, setCopied] = useState(false);
//   const loadMoreRef = useRef<HTMLTableRowElement | null>(null);

//   const deleteUser = useDeleteUser();
//   const updateUserRole = useUpdateUserRole();
//   const queryClient = useQueryClient();
//   const { success, error } = useToast();
//   const router = useRouter();
//   const [visibleEmails, setVisibleEmails] = useState<Record<string, boolean>>(
//     {},
//   );
//   const [visiblePhones, setVisiblePhones] = useState<Record<string, boolean>>(
//     {},
//   );

//   /* ---------------- URL SYNC ---------------- */
//   useEffect(() => {
//     const params = new URLSearchParams(window.location.search);
//     searchQuery ? params.set("search", searchQuery) : params.delete("search");
//     window.history.replaceState(null, "", `?${params.toString()}`);
//   }, [searchQuery]);

//   /* ---------------- INFINITE SCROLL ---------------- */
//   useEffect(() => {
//     const el = loadMoreRef.current;
//     if (!el) return;

//     const observer = new IntersectionObserver(
//       ([entry]) => {
//         if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
//           fetchNextPage();
//         }
//       },
//       { threshold: 0.1 },
//     );

//     observer.observe(el);
//     return () => observer.disconnect();
//   }, [hasNextPage, isFetchingNextPage, fetchNextPage]);
//   //   create group
  


//   /* ---------------- EDIT ROLE ---------------- */
//   const openModal = (user: User) => {
//     setSelectedUserId(user._id);
//     setSelectedRole(user.role?._id || "");
//     setIsModalOpen(true);
//   };

//   const handleSaveRole = () => {
//     if (!selectedRole) {
//       error("Please select a role");
//       return;
//     }

//     setIsSaving(true);

//     // 🔥 BULK UPDATE
//     if (!selectedUserId) {
//       Promise.all(
//         selectedUserIds.map((id) =>
//           updateUserRole.mutateAsync({ userId: id, role: selectedRole }),
//         ),
//       )
//         .then(() => {
//           success("Roles updated successfully");
//           setIsModalOpen(false);
//           setSelectedUserIds([]);
//           queryClient.invalidateQueries({ queryKey: ["users"] });
//         })
//         .catch(() => error("Bulk role update failed"))
//         .finally(() => setIsSaving(false));

//       return;
//     }

//     // ✅ SINGLE USER UPDATE
//     updateUserRole.mutate(
//       { userId: selectedUserId, role: selectedRole },
//       {
//         onSuccess: () => {
//           success("Role updated successfully");
//           setIsModalOpen(false);
//           queryClient.invalidateQueries({ queryKey: ["users"] });
//         },
//         onError: () => error("Failed to update role"),
//         onSettled: () => setIsSaving(false),
//       },
//     );
//   };

//   const toggleEmailVisibility = (userId: string) => {
//     setVisibleEmails((prev) => ({
//       ...prev,
//       [userId]: !prev[userId],
//     }));
//     setTimeout(() => {
//       setVisiblePhones((prev) => ({ ...prev, [userId]: false }));
//     }, 10000);
//   };

//   const togglePhoneVisibility = (userId: string) => {
//     setVisiblePhones((prev) => ({
//       ...prev,
//       [userId]: !prev[userId],
//     }));
//     setTimeout(() => {
//       setVisiblePhones((prev) => ({ ...prev, [userId]: false }));
//     }, 10000);
//   };

//   const openBulkRoleModal = () => {
//     if (!selectedUserIds.length) {
//       error("Select at least one user");
//       return;
//     }

//     setSelectedUserId(null); // null means BULK MODE
//     setSelectedRole("");
//     setIsModalOpen(true);
//   };

//   /* ---------------- DELETE ---------------- */
//   const handleDeleteUser = (userId: string) => {
//     if (!confirm("Are you sure you want to delete this user?")) return;

//     deleteUser.mutate(
//       { userId },
//       {
//         onSuccess: () => {
//           setOpenDeleteMenu(null);
//           success("User deleted successfully");
//           queryClient.invalidateQueries({ queryKey: ["users"] });
//         },
//         onError: () => error("Failed to delete user"),
//       },
//     );
//   };

//   const handleBulkDelete = async () => {
//     if (!selectedUserIds.length) {
//       error("Select at least one user");
//       return;
//     }

//     if (!confirm(`Delete ${selectedUserIds.length} users permanently?`)) return;

//     try {
//       await Promise.all(
//         selectedUserIds.map((id) => deleteUser.mutateAsync({ userId: id })),
//       );

//       success("Users deleted successfully");
//       setSelectedUserIds([]);
//       queryClient.invalidateQueries({ queryKey: ["users"] });
//     } catch {
//       error("Bulk delete failed");
//     }
//   };

//   /* ---------------- SHARE ---------------- */
//   const handleViewSelected = () => {
//     if (selectedUserIds.length === 0) {
//       error("Please select at least one user");
//       return;
//     }
//     const payload = selectedUserIds.map((id) => ({ candidateId: id }));
//     shareCandidates(payload, {
//       onSuccess: (res) => {
//         setSelectedUserIds([]);
//         const shareId = res.shareLink.split("/").pop();
//         setLink(
//           `https://hire.sheryians.com/selected-candidates?shareId=${shareId}`,
//         );
//         setShowLink(true);
//       },
//       onError: () => error("Failed to share candidates"),
//     });
//   };

// //   const handleCreateGroup = () => {
// //   if (selectedUserIds.length === 0) {
// //     error("Please select at least one user");
// //     return;
// //   }

// //   const groupName = prompt("Enter group name");
// //   if (!groupName) return;

// //   const payload = {
// //     groupName,
// //     users: selectedUserIds.map((id) => ({
// //       candidateId: id,
// //     })),
// //   };

// //   shareCandidates(payload as any, {
// //     onSuccess: () => {
// //       success("Group created successfully");
// //       setSelectedUserIds([]);
// //       router.push("/admin/groups");
// //     },
// //     onError: () => error("Failed to create group"),
// //   });
// // };

// const handleCreateGroupAction = () => {
//     if (!newGroupName.trim()) {
//       error("Please enter a group name");
//       return;
//     }

//     const payload = {
//       groupName: newGroupName.trim(),
//       users: selectedUserIds.map((id) => id), // Backend expect string[] users
//     };

//     shareCandidates(payload as any, {
//       onSuccess: () => {
//         success("Group created successfully");
//         setIsGroupModalOpen(false);
//         setNewGroupName("");
//         setSelectedUserIds([]);
//         router.push("/admin/groups");
//       },
//       onError: () => error("Failed to create group"),
//     });
//   };
  
//   const handleCopy = async () => {
//     try {
//       await navigator.clipboard.writeText(link);
//       setCopied(true);
//       setTimeout(() => setCopied(false), 2000);
//     } catch (err) {
//       console.error("Failed to copy", err);
//     }
//   };

//   /* ---------------- STATES ---------------- */
//   if (isLoading) return <p className="py-10 text-center">Loading users…</p>;
//   if (isError)
//     return (
//       <p className="py-10 text-center text-red-500">Failed to load users</p>
//     );

//   return (
//     <>
//       {/* HEADER */}
//       <div className="mb-6 flex items-center justify-between">
//         <div className="space-y-3">
//           {showLink && (
//             <div className="relative flex max-w-xl items-center gap-2 rounded-xl border bg-white px-3 py-2 shadow-sm">
//               {/* Link section */}
//               <div className="flex flex-1 items-center gap-2 overflow-hidden">
//                 <LinkIcon className="h-4 w-4 text-gray-400" />
//                 <p className="truncate text-sm font-medium text-gray-700">
//                   {link}
//                 </p>
//               </div>

//               {/* Copy button */}
//               <button
//                 onClick={handleCopy}
//                 className="flex items-center gap-1 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 transition"
//               >
//                 {copied ? (
//                   <>
//                     <Check className="h-3 w-3" />
//                     Copied
//                   </>
//                 ) : (
//                   <>
//                     <Copy className="h-3 w-3" />
//                     Copy
//                   </>
//                 )}
//               </button>

//               {/* Cross button */}
//               <button
//                 onClick={() => setShowLink(false)}
//                 className="ml-1 flex h-6 w-6 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition"
//               >
//                 ✕
//               </button>
//             </div>
//           )}
//         </div>

//         <div className="relative w-full max-w-md ml-auto">
//           <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
//           <input
//             type="text"
//             placeholder="Search by email…"
//             className="w-full rounded-lg bg-white border border-slate-200 px-4 py-3 pl-12 text-sm text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//           />
//         </div>
//       </div>

//       {/* TABLE */}
//       <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
//         <table className="w-full border-collapse">
//           <thead>
//             <tr className="bg-slate-50 border-b">
//               <th className="pl-6 pr-4 py-5 w-12 text-left">
//                 <input
//                   type="checkbox"
//                   checked={isAllSelected}
//                   ref={(el) => {
//                     if (el) el.indeterminate = isSomeSelected;
//                   }}
//                   onChange={toggleSelectAll}
//                   className="h-4 w-4 accent-blue-600 cursor-pointer"
//                 />
//               </th>
//               <th className="px-4 py-5 text-xs font-bold uppercase tracking-wider text-slate-400 text-left">
//                 Name
//               </th>
//               <th className="px-4 py-5 text-xs font-bold uppercase tracking-wider text-slate-400 text-left">
//                 Email
//               </th>
//               <th className="px-4 py-5 text-xs font-bold uppercase tracking-wider text-slate-400 text-left">
//                 Phone
//               </th>
//               <th className="px-4 py-5 text-xs font-bold uppercase tracking-wider text-slate-400 text-left">
//                 Role
//               </th>
//             </tr>
//           </thead>

//           <tbody className="divide-y">
//             {users.map((user) => {
//               const isSelected = selectedUserIds.includes(user._id);
//               const initials =
//                 `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`.toUpperCase();

//               const fullName = `${user.firstName || ""}${user.lastName || ""}`;

//               return (
//                 <tr
//                   key={user._id}
//                   className={`group transition-colors ${
//                     isSelected ? "bg-blue-50/60" : "hover:bg-slate-50"
//                   }`}
//                 >
//                   {/* CHECKBOX */}
//                   <td className="pl-6 pr-4 py-5">
//                     <input
//                       type="checkbox"
//                       checked={isSelected}
//                       onChange={() => toggleUserSelection(user._id)}
//                       className="h-4 w-4 accent-blue-600 cursor-pointer"
//                     />
//                   </td>

//                   {/* NAME */}
//                   <td className="px-4 py-5">
//                     <div className="flex items-center gap-3">
//                       <div
//                         className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shadow-sm ${getAvatarColor(fullName)}`}
//                       >
//                         {initials}
//                       </div>
//                       <div className="inline-flex items-center rounded-xl border bg-gradient-to-r px-3 py-1 text-sm font-semibold">
//                         {user.firstName} {user.lastName}
//                       </div>
//                     </div>
//                   </td>

//                   {/* EMAIL */}
//                   <td className="px-4 py-5">
//                     {visibleEmails[user._id] ? (
//                       <span className="text-sm text-slate-700">
//                         {user.email}
//                       </span>
//                     ) : (
//                       <button
//                         onClick={() => toggleEmailVisibility(user._id)}
//                         className="text-blue-600 text-xs font-semibold hover:text-blue-500 uppercase transition flex items-center gap-2"
//                       >
//                         <FiEye />
//                         <span>Click to view</span>
//                       </button>
//                     )}
//                   </td>

//                   {/* PHONE */}
//                   <td className="px-4 py-5">
//                     {visiblePhones[user._id] ? (
//                       <span className="text-sm text-slate-700 uppercase">
//                         {user.phoneNumber}
//                       </span>
//                     ) : (
//                       <button
//                         onClick={() => togglePhoneVisibility(user._id)}
//                         className="text-blue-600 text-xs uppercase font-semibold hover:text-blue-500 transition flex items-center gap-2"
//                       >
//                         <FiEye />
//                         <span>Click to view</span>
//                       </button>
//                     )}
//                   </td>
//                   {/* ROLE */}
//                   <td className="px-4 py-5">
//                     <span className="text-[11px] font-mono text-slate-500 bg-slate-100 px-2 py-1 rounded">
//                       {user.role?.name || "no-role"}
//                     </span>
//                   </td>

//                   {/* ACTIONS */}
//                   {/* <td className="relative px-4 py-5 text-right">
//               <button
//                 onClick={() =>
//                   setOpenDeleteMenu(prev => (prev === user._id ? null : user._id))
//                 }
//                 className="rounded-lg p-2 hover:bg-slate-100"
//               >
//                 <MoreVertical className="h-4 w-4" />
//               </button>

//               {openDeleteMenu === user._id && (
//                 <div className="absolute right-6 top-12 z-20 w-40 rounded-xl border bg-white shadow-lg overflow-hidden">
//                   <button
//                     onClick={() => openModal(user)}
//                     className="flex w-full items-center gap-2 px-4 py-2 text-sm hover:bg-slate-50"
//                   >
//                     <Pencil className="h-4 w-4" />
//                     Edit Role
//                   </button>

//                   <button
//                     onClick={() => handleDeleteUser(user._id)}
//                     className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
//                   >
//                     <Trash2 className="h-4 w-4" />
//                     Delete
//                   </button>
//                 </div>
//               )}
//             </td> */}
//                 </tr>
//               );
//             })}

//             <tr ref={loadMoreRef}>
//               <td colSpan={5} />
//             </tr>

//             {isFetchingNextPage && (
//               <tr>
//                 <td colSpan={5} className="py-6 text-center text-slate-400">
//                   Loading more users…
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* FLOATING ACTION BAR */}
//       {selectedUserIds.length > 0 && (
//         <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
//           <div className="bg-white border border-slate-200 shadow-2xl px-8 py-4 rounded-full flex items-center gap-10">
//             {/* Selected count */}
//             <div className="flex items-center gap-3">
//               <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
//                 {selectedUserIds.length}
//               </div>
//               <span className="text-sm font-semibold text-slate-700">
//                 Selected
//               </span>
//             </div>

//             {/* Action buttons */}
//             <div className="flex items-center gap-8">
//               <button
//                 onClick={handleViewSelected}
//                 className="flex flex-col items-center gap-1 text-slate-600 hover:text-slate-900 transition"
//                 title="Share selected candidates"
//               >
//                 <Upload className="h-4 w-4" />
//                 <span className="text-xs font-semibold uppercase tracking-wide">
//                   Share
//                 </span>
//               </button>
//                     {/* //create group button  */}
//               {/* <button
//   onClick={handleCreateGroup}
//   className="flex flex-col items-center gap-1 text-blue-600 hover:text-blue-700 transition"
// >
//   <UserPlus className="h-4 w-4" />
//   <span className="text-xs font-semibold uppercase">
//     Create Group
//   </span>
//               </button>  */}
//              {/* CREATE GROUP MODAL */}
//       {/* {isGroupModalOpen && (
//         <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm">
//           <div className="w-[400px] rounded-2xl bg-white p-6 shadow-2xl animate-in zoom-in duration-200">
//             <div className="flex items-center gap-3 mb-6 border-b pb-4">
//               <div className="bg-blue-100 p-2 rounded-lg text-blue-600"><Users size={20} /></div>
//               <h2 className="text-xl font-bold text-slate-800">Create New Group</h2>
//             </div>
//             <div className="space-y-4">
//               <div className="space-y-2">
//                 <label className="text-xs font-bold text-slate-500 uppercase">Group Name</label>
//                 <input
//                   autoFocus
//                   className="w-full rounded-xl border-2 border-slate-100 px-4 py-3 focus:border-blue-500 outline-none transition-all"
//                   placeholder="Enter group name..."
//                   value={newGroupName}
//                   onChange={(e) => setNewGroupName(e.target.value)}
//                   onKeyDown={(e) => e.key === "Enter" && handleCreateGroupAction()}
//                 />
//               </div>
//               <p className="text-xs text-slate-400 italic font-medium">Selected Candidates: {selectedUserIds.length}</p>
//               <div className="flex justify-end gap-3 pt-4">
//                 <button onClick={() => setIsGroupModalOpen(false)} className="px-4 py-2 text-sm font-semibold text-slate-500 hover:bg-slate-50 rounded-xl transition">Cancel</button>
//                 <button
//                   onClick={handleCreateGroupAction}
//                   disabled={isSharing || !newGroupName.trim()}
//                   className="bg-blue-600 text-white px-6 py-2 rounded-xl text-sm font-bold hover:bg-blue-700 disabled:opacity-50 transition shadow-lg shadow-blue-200 flex items-center gap-2"
//                 >
//                   {isSharing ? <Loader2 className="animate-spin h-4 w-4" /> : <Check size={16} />}
//                   Create Group
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//                */}
//               {/* view group button */}

//               <button
//   onClick={() => router.push("/admin/groups")}
//   className="flex flex-col items-center gap-1 text-slate-600 hover:text-slate-900 transition"
// >
//   <UsersRound className="h-4 w-4" />
//   <span className="text-xs font-semibold uppercase">
//     View Groups
//   </span>
// </button>



//               <button
//                 onClick={openBulkRoleModal}
//                 className="flex flex-col items-center gap-1 text-slate-600 hover:text-slate-900 transition"
//                 title="Edit role for selected"
//               >
//                 <ArrowRightLeft className="h-4 w-4" />
//                 <span className="text-xs font-semibold uppercase tracking-wide">
//                   Edit Role
//                 </span>
//               </button>

//               <button
//                 className="flex flex-col items-center gap-1 text-slate-600 hover:text-slate-900 transition"
//                 title="Blast email"
//               >
//                 <Mail className="h-4 w-4" />
//                 <span className="text-xs font-semibold uppercase tracking-wide">
//                   Blast
//                 </span>
//               </button>

//               <button
//                 onClick={handleBulkDelete}
//                 className="flex flex-col items-center gap-1 text-red-500 hover:text-red-600 transition"
//                 title="Delete selected"
//               >
//                 <Trash2 className="h-4 w-4" />
//                 <span className="text-xs font-semibold uppercase tracking-wide">
//                   Delete
//                 </span>
//               </button>
//             </div>

//             {/* Apply actions button */}
//             <button
//               onClick={handleViewSelected}
//               className="ml-6 bg-blue-600 text-white text-xs font-bold uppercase tracking-widest px-8 py-3.5 rounded-full shadow-lg shadow-blue-600/30 hover:shadow-blue-600/40 hover:bg-blue-700 active:scale-95 transition-all whitespace-nowrap"
//             >
//               Apply Actions
//             </button>
//           </div>
//         </div>
//       )}

//       {/* ROLE MODAL */}
//       {isModalOpen && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
//           <div className="w-80 rounded-xl bg-white p-6 shadow-xl">
//             <h2 className="mb-4 text-lg font-semibold">Update Role</h2>

//             <select
//               value={selectedRole}
//               onChange={(e) => setSelectedRole(e.target.value)}
//               className="w-full rounded-lg border px-3 py-2"
//             >
//               <option value="">Select role</option>
//               <option value="6915a17ed8d70e9b7ce70ec7">Admin</option>
//               <option value="692c10094167ed9d874b8f99">Client</option>
//               <option value="6915ab309788ad1e00990866">Candidate</option>
//             </select>

//             <div className="mt-6 flex justify-end gap-3">
//               <button onClick={() => setIsModalOpen(false)}>Cancel</button>
//               <button
//                 onClick={handleSaveRole}
//                 disabled={isSaving}
//                 className="rounded-lg bg-blue-600 px-4 py-2 text-white"
//               >
//                 {isSaving ? (
//                   <Loader2 className="h-4 w-4 animate-spin" />
//                 ) : (
//                   "Save"
//                 )}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// }


"use client";

import { useQueryClient, useMutation } from "@tanstack/react-query";
import api from "@/config/axios";
import {
  Check,
  Copy,
  LinkIcon,
  Loader2,
  Pencil,
  Trash2,
  Upload,
  ArrowRightLeft,
  Mail,
  Search,
  UserPlus,
  UsersRound,
  Users,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

import { useToast } from "@/components/ui/Toast";
import { useDebounce } from "@/features/admin/users/hooks/useDebounce";
import { useCreateShareCandidate } from "@/features/admin/users/hooks/useShareuser";
import {
  useDeleteUser,
  useInfiniteUsers,
  User,
  useUpdateUserRole,
} from "@/features/admin/users/hooks/useUser";
import { FiEye } from "react-icons/fi";

export default function UsersTable() {
  const nameColors = [
    "from-pink-500/20 to-rose-500/20 text-rose-700 border-rose-200",
    "from-purple-500/20 to-indigo-500/20 text-indigo-700 border-indigo-200",
    "from-blue-500/20 to-cyan-500/20 text-cyan-700 border-cyan-200",
    "from-green-500/20 to-emerald-500/20 text-emerald-700 border-emerald-200",
    "from-yellow-500/20 to-orange-500/20 text-orange-700 border-orange-200",
    "from-fuchsia-500/20 to-pink-500/20 text-pink-700 border-pink-200",
  ];

  const avatarColors = [
    "bg-pink-100 text-pink-700",
    "bg-purple-100 text-purple-700",
    "bg-indigo-100 text-indigo-700",
    "bg-blue-100 text-blue-700",
    "bg-cyan-100 text-cyan-700",
    "bg-emerald-100 text-emerald-700",
    "bg-green-100 text-green-700",
    "bg-yellow-100 text-yellow-700",
    "bg-orange-100 text-orange-700",
    "bg-rose-100 text-rose-700",
    "bg-fuchsia-100 text-fuchsia-700",
  ];

  const getSafeIndex = (name = "A", length: number) => {
    const safe = name || "A";
    return safe.charCodeAt(0) % length;
  };

  const getNameColor = (name = "A") =>
    nameColors[getSafeIndex(name, nameColors.length)];

  const getAvatarColor = (name = "A") =>
    avatarColors[getSafeIndex(name, avatarColors.length)];

  /* ---------------- SEARCH ---------------- */
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 400);
  const normalizedSearch = debouncedSearch.trim().replace(/\s+/g, " ");

  /* ---------------- DATA ---------------- */
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteUsers(normalizedSearch);

  const users = useMemo(() => data?.pages.flatMap((p) => p.data) ?? [], [data]);

  /* ---------------- SELECTION ---------------- */
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const toggleUserSelection = (id: string) => {
    setSelectedUserIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const toggleSelectAll = () => {
    if (selectedUserIds.length === users.length && users.length > 0) {
      setSelectedUserIds([]);
    } else {
      setSelectedUserIds(users.map((user) => user._id));
    }
  };

  const isAllSelected =
    users.length > 0 && selectedUserIds.length === users.length;
  const isSomeSelected =
    selectedUserIds.length > 0 && selectedUserIds.length < users.length;

  /* ---------------- SHARE & GROUP MUTATION ---------------- */
  const { mutate: shareCandidates, isPending: isSharing } = useCreateShareCandidate();
  
  // Modal State for Group Creation
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");

  /* ---------------- ACTION STATE ---------------- */
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState("");
  const [openDeleteMenu, setOpenDeleteMenu] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [link, setLink] = useState<string>("");
  const [showLink, setShowLink] = useState(false);
  const [copied, setCopied] = useState(false);
  const loadMoreRef = useRef<HTMLTableRowElement | null>(null);

  const deleteUser = useDeleteUser();
  const updateUserRole = useUpdateUserRole();
  const queryClient = useQueryClient();
  const { success, error } = useToast();
  const router = useRouter();
  const [visibleEmails, setVisibleEmails] = useState<Record<string, boolean>>(
    {},
  );
  const [visiblePhones, setVisiblePhones] = useState<Record<string, boolean>>(
    {},
  );

  /* ---------------- URL SYNC ---------------- */
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    searchQuery ? params.set("search", searchQuery) : params.delete("search");
    window.history.replaceState(null, "", `?${params.toString()}`);
  }, [searchQuery]);

  /* ---------------- INFINITE SCROLL ---------------- */
  useEffect(() => {
    const el = loadMoreRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  /* ---------------- EDIT ROLE ---------------- */
  const openModal = (user: User) => {
    setSelectedUserId(user._id);
    setSelectedRole(user.role?._id || "");
    setIsModalOpen(true);
  };

  const handleSaveRole = () => {
    if (!selectedRole) {
      error("Please select a role");
      return;
    }
    setIsSaving(true);
    if (!selectedUserId) {
      Promise.all(
        selectedUserIds.map((id) =>
          updateUserRole.mutateAsync({ userId: id, role: selectedRole }),
        ),
      )
        .then(() => {
          success("Roles updated successfully");
          setIsModalOpen(false);
          setSelectedUserIds([]);
          queryClient.invalidateQueries({ queryKey: ["users"] });
        })
        .catch(() => error("Bulk role update failed"))
        .finally(() => setIsSaving(false));
      return;
    }

    updateUserRole.mutate(
      { userId: selectedUserId, role: selectedRole },
      {
        onSuccess: () => {
          success("Role updated successfully");
          setIsModalOpen(false);
          queryClient.invalidateQueries({ queryKey: ["users"] });
        },
        onError: () => error("Failed to update role"),
        onSettled: () => setIsSaving(false),
      },
    );
  };

  const toggleEmailVisibility = (userId: string) => {
    setVisibleEmails((prev) => ({ ...prev, [userId]: !prev[userId] }));
  };

  const togglePhoneVisibility = (userId: string) => {
    setVisiblePhones((prev) => ({ ...prev, [userId]: !prev[userId] }));
  };

  const openBulkRoleModal = () => {
    if (!selectedUserIds.length) {
      error("Select at least one user");
      return;
    }
    setSelectedUserId(null);
    setSelectedRole("");
    setIsModalOpen(true);
  };

  /* ---------------- DELETE ---------------- */
  const handleDeleteUser = (userId: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    deleteUser.mutate(
      { userId },
      {
        onSuccess: () => {
          setOpenDeleteMenu(null);
          success("User deleted successfully");
          queryClient.invalidateQueries({ queryKey: ["users"] });
        },
        onError: () => error("Failed to delete user"),
      },
    );
  };

  const handleBulkDelete = async () => {
    if (!selectedUserIds.length) {
      error("Select at least one user");
      return;
    }
    if (!confirm(`Delete ${selectedUserIds.length} users permanently?`)) return;
    try {
      await Promise.all(
        selectedUserIds.map((id) => deleteUser.mutateAsync({ userId: id })),
      );
      success("Users deleted successfully");
      setSelectedUserIds([]);
      queryClient.invalidateQueries({ queryKey: ["users"] });
    } catch {
      error("Bulk delete failed");
    }
  };

  /* ---------------- SHARE & CREATE GROUP LOGIC ---------------- */
  const handleViewSelected = () => {
    if (selectedUserIds.length === 0) {
      error("Please select at least one user");
      return;
    }
    const payload = selectedUserIds.map((id) => ({ candidateId: id }));
    shareCandidates(payload as any, {
      onSuccess: (res) => {
        setSelectedUserIds([]);
        const shareId = res.shareLink.split("/").pop();
        setLink(`https://hire.sheryians.com/selected-candidates?shareId=${shareId}`);
        setShowLink(true);
      },
      onError: () => error("Failed to share candidates"),
    });
  };

  const handleCreateGroupSubmit = () => {
    if (!newGroupName.trim()) {
      error("Please enter a group name");
      return;
    }

    // const payload = {
    //   groupName: newGroupName.trim(),
    //   users: selectedUserIds, // String array expected by backend
    const payload = {
  groupName: newGroupName.trim(),
  users: selectedUserIds.map(id => ({ candidateId: id })), 
};
    

    shareCandidates(payload as any, {
      onSuccess: () => {
        success("Group created successfully");
        setIsGroupModalOpen(false);
        setNewGroupName("");
        setSelectedUserIds([]);
        router.push("/admin/groups");
      },
      onError: () => error("Failed to create group"),
    });
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy", err);
    }
  };

  if (isLoading) return <p className="py-10 text-center">Loading users…</p>;
  if (isError) return <p className="py-10 text-center text-red-500">Failed to load users</p>;

  return (
    <>
      {/* HEADER */}
      <div className="mb-6 flex items-center justify-between">
        <div className="space-y-3">
          {showLink && (
            <div className="relative flex max-w-xl items-center gap-2 rounded-xl border bg-white px-3 py-2 shadow-sm animate-in fade-in slide-in-from-top-2">
              <div className="flex flex-1 items-center gap-2 overflow-hidden">
                <LinkIcon className="h-4 w-4 text-gray-400" />
                <p className="truncate text-sm font-medium text-gray-700">{link}</p>
              </div>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 transition"
              >
                {copied ? <><Check className="h-3 w-3" /> Copied</> : <><Copy className="h-3 w-3" /> Copy</>}
              </button>
              <button
                onClick={() => setShowLink(false)}
                className="ml-1 flex h-6 w-6 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 transition"
              >✕</button>
            </div>
          )}
        </div>

        <div className="relative w-full max-w-md ml-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by email…"
            className="w-full rounded-lg bg-white border border-slate-200 px-4 py-3 pl-12 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b">
              <th className="pl-6 pr-4 py-5 w-12 text-left">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  ref={(el) => { if (el) el.indeterminate = isSomeSelected; }}
                  onChange={toggleSelectAll}
                  className="h-4 w-4 accent-blue-600 cursor-pointer"
                />
              </th>
              <th className="px-4 py-5 text-xs font-bold uppercase tracking-wider text-slate-400 text-left">Name</th>
              <th className="px-4 py-5 text-xs font-bold uppercase tracking-wider text-slate-400 text-left">Email</th>
              <th className="px-4 py-5 text-xs font-bold uppercase tracking-wider text-slate-400 text-left">Phone</th>
              <th className="px-4 py-5 text-xs font-bold uppercase tracking-wider text-slate-400 text-left">Role</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {users.map((user) => {
              const isSelected = selectedUserIds.includes(user._id);
              const initials = `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`.toUpperCase();
              const fullName = `${user.firstName || ""}${user.lastName || ""}`;
              return (
                <tr key={user._id} className={`group transition-colors ${isSelected ? "bg-blue-50/60" : "hover:bg-slate-50"}`}>
                  <td className="pl-6 pr-4 py-5">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleUserSelection(user._id)}
                      className="h-4 w-4 accent-blue-600 cursor-pointer"
                    />
                  </td>
                  <td className="px-4 py-5">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shadow-sm ${getAvatarColor(fullName)}`}>
                        {initials}
                      </div>
                      <div className="inline-flex items-center rounded-xl border bg-gradient-to-r px-3 py-1 text-sm font-semibold">
                        {user.firstName} {user.lastName}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-5">
                    {visibleEmails[user._id] ? (
                      <span className="text-sm text-slate-700">{user.email}</span>
                    ) : (
                      <button onClick={() => toggleEmailVisibility(user._id)} className="text-blue-600 text-xs font-semibold uppercase flex items-center gap-2"><FiEye />Click to view</button>
                    )}
                  </td>
                  <td className="px-4 py-5">
                    {visiblePhones[user._id] ? (
                      <span className="text-sm text-slate-700">{user.phoneNumber}</span>
                    ) : (
                      <button onClick={() => togglePhoneVisibility(user._id)} className="text-blue-600 text-xs uppercase font-semibold flex items-center gap-2"><FiEye />Click to view</button>
                    )}
                  </td>
                  <td className="px-4 py-5">
                    <span className="text-[11px] font-mono text-slate-500 bg-slate-100 px-2 py-1 rounded">{user.role?.name || "no-role"}</span>
                  </td>
                </tr>
              );
            })}
            <tr ref={loadMoreRef}><td colSpan={5} /></tr>
          </tbody>
        </table>
      </div>

      {/* FLOATING ACTION BAR */}
      {selectedUserIds.length > 0 && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
          <div className="bg-white border border-slate-200 shadow-2xl px-8 py-4 rounded-full flex items-center gap-10">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">{selectedUserIds.length}</div>
              <span className="text-sm font-semibold text-slate-700">Selected</span>
            </div>
            
            {/* Action buttons */}
            <div className="flex items-center gap-8">
              {/* SHARE BUTTON */}
              

              {/* CREATE GROUP BUTTON (Right Side of Share) */}
              <button 
                onClick={() => setIsGroupModalOpen(true)} 
                className="flex flex-col items-center gap-1 text-blue-600 hover:text-blue-700 transition"
              >
                <UserPlus className="h-4 w-4" />
                <span className="text-xs font-semibold uppercase tracking-wide">Create Group</span>
              </button> 

              <button onClick={() => router.push("/admin/groups")} className="flex flex-col items-center gap-1 text-slate-600 hover:text-slate-900 transition">
                <UsersRound className="h-4 w-4" />
                <span className="text-xs font-semibold uppercase tracking-wide">View Groups</span>
              </button>

              <button onClick={openBulkRoleModal} className="flex flex-col items-center gap-1 text-slate-600 hover:text-slate-900 transition" title="Edit role for selected">
                <ArrowRightLeft className="h-4 w-4" />
                <span className="text-xs font-semibold uppercase tracking-wide">Edit Role</span>
              </button>

              <button className="flex flex-col items-center gap-1 text-slate-600 hover:text-slate-900 transition" title="Blast email">
                <Mail className="h-4 w-4" />
                <span className="text-xs font-semibold uppercase tracking-wide">Blast</span>
              </button>

              <button onClick={handleBulkDelete} className="flex flex-col items-center gap-1 text-red-500 hover:text-red-600 transition" title="Delete selected">
                <Trash2 className="h-4 w-4" />
                <span className="text-xs font-semibold uppercase tracking-wide">Delete</span>
              </button>
            </div>

            <button onClick={handleViewSelected} className="ml-6 bg-blue-600 text-white text-xs font-bold uppercase tracking-widest px-8 py-3.5 rounded-full shadow-lg shadow-blue-600/30 hover:bg-blue-700 active:scale-95 transition-all whitespace-nowrap">
              Apply Actions
            </button>
          </div>
        </div>
      )}

      {/* CREATE GROUP MODAL */}
      {isGroupModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="w-[400px] rounded-2xl bg-white p-6 shadow-2xl animate-in zoom-in duration-200">
            <div className="flex items-center gap-3 mb-6 border-b pb-4">
              <div className="bg-blue-100 p-2 rounded-lg text-blue-600"><Users size={20} /></div>
              <h2 className="text-xl font-bold text-slate-800">Create New Group</h2>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase">Group Name</label>
                <input
                  autoFocus
                  className="w-full rounded-xl border-2 border-slate-100 px-4 py-3 focus:border-blue-500 outline-none transition-all placeholder:text-slate-300"
                  placeholder="e.g. Frontend Team"
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleCreateGroupSubmit()}
                />
              </div>
              <p className="text-xs text-slate-400 italic font-medium">Adding {selectedUserIds.length} selected candidates.</p>
              <div className="flex justify-end gap-3 pt-4">
                <button onClick={() => setIsGroupModalOpen(false)} className="px-4 py-2 text-sm font-semibold text-slate-500 hover:bg-slate-50 rounded-xl transition">Cancel</button>
                <button 
                  onClick={handleCreateGroupSubmit}
                  disabled={isSharing || !newGroupName.trim()}
                  className="bg-blue-600 text-white px-6 py-2 rounded-xl text-sm font-bold hover:bg-blue-700 disabled:opacity-50 transition shadow-lg shadow-blue-200 flex items-center gap-2"
                >
                  {isSharing ? <Loader2 className="animate-spin h-4 w-4" /> : <Check size={16} />}
                  Create Group
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ROLE MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-80 rounded-xl bg-white p-6 shadow-xl">
            <h2 className="mb-4 text-lg font-semibold">Update Role</h2>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="w-full rounded-lg border px-3 py-2"
            >
              <option value="">Select role</option>
              <option value="6915a17ed8d70e9b7ce70ec7">Admin</option>
              <option value="692c10094167ed9d874b8f99">Client</option>
              <option value="6915ab309788ad1e00990866">Candidate</option>
            </select>
            <div className="mt-6 flex justify-end gap-3">
              <button onClick={() => setIsModalOpen(false)}>Cancel</button>
              <button onClick={handleSaveRole} disabled={isSaving} className="rounded-lg bg-blue-600 px-4 py-2 text-white">
                {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}