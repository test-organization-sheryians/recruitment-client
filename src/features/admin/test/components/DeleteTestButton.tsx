
"use client";
import { useState } from "react";
import { useDeleteTest } from "@/features/admin/test/hooks/useTest";




interface Props {
  testId: string;
  onSuccess?: () => void;
  onOpen?: () => void;
}

export default function DeleteTestButton({
  testId,
  onSuccess,
  onOpen,
}: Props) {
  const deleteMut = useDeleteTest();
  const [open, setOpen] = useState(false);

  const handleConfirmDelete = () => {
    deleteMut.mutate(testId, {
      onSuccess: () => {
        setOpen(false);
        onSuccess?.();
      },
      onError: () => {
        alert("Failed to delete test"); // ONLY after confirm
      },
    });
  };

  return (
    <>
      <button
        onClick={() => {
          onOpen?.();     
          setOpen(true);  
        }}
        className="w-full px-4 py-2 text-left text-red-600"
      >
        Delete Test
      </button>

    </>
  );
}
