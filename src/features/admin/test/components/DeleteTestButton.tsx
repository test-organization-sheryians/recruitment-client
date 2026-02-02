// import { useDeleteTest } from "@/features/admin/test/hooks/useTest";

// interface DeleteTestButtonProps {
//   testId: string;
//   onSuccess?: () => void;
// }

// export default function DeleteTestButton({
//   testId,
//   onSuccess,
// }: DeleteTestButtonProps) {
//   const deleteMut = useDeleteTest();

//   const handleDelete = async () => {
//     const confirmDelete = window.confirm(
//       "Are you sure you want to delete this test?"
//     );

//     if (!confirmDelete) return;

//     try {
//       await deleteMut.mutateAsync(testId);
//       onSuccess?.();
//     } catch {
//       alert("Failed to delete test");
//     }
//   };

//   return (
//     <button
//       onClick={handleDelete}
//       disabled={deleteMut.isPending}
//       className="w-full px-4 py-2 text-left text-red-600 disabled:opacity-50"
//     >
//       {deleteMut.isPending ? "Deleting..." : "Delete Test"}
//     </button>
//   );
// }





// import { useDeleteTest } from "@/features/admin/test/hooks/useTest";

// interface Props {
//   testId: string;
//   onSuccess?: () => void;
// }

// export default function DeleteTestButton({ testId, onSuccess }: Props) {
//   const deleteMut = useDeleteTest();

//   const handleDelete = () => {
//     const confirmDelete = window.confirm(
//       "Are you sure you want to delete this test?"
//     );
//     if (!confirmDelete) return;

//     deleteMut.mutate(testId, {
//       onSuccess: () => {
//         onSuccess?.();
//       },
//       onError: (error: any) => {
//         // ❗ alert only if real backend error
//         if (error?.response?.status !== 404) {
//           alert("Failed to delete test");
//         }
//       },
//     });
//   };

//   return (
//     <button
//       onClick={handleDelete}
//       disabled={deleteMut.isPending}
//       className="w-full px-4 py-2 text-left text-red-600 disabled:opacity-50"
//     >
//       {deleteMut.isPending ? "Deleting..." : "Delete Test"}
//     </button>
//   );
// }

