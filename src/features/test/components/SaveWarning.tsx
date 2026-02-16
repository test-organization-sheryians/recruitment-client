// SaveWarningModal.tsx
interface Props {
  onStay: () => void;
  onSaveAndNavigate: () => void;
}

export default function SaveWarningModal({
  onStay,
  onSaveAndNavigate,
}: Props) {
  return (
    <div className="fixed inset-0 z-[250] bg-black/60 flex items-center justify-center">
      <div className="bg-white rounded-xl p-6 max-w-sm w-full text-center shadow-xl">
        <h2 className="text-lg font-bold text-gray-900 mb-2">
          Unsaved Answer
        </h2>

        <p className="text-sm text-gray-600 mb-5">
          Please <b>Save</b> your answer or <b>Mark for Review</b> before navigating.
        </p>

        <div className="flex gap-3">
          <button
            onClick={onStay}
            className="flex-1 border rounded-lg py-2 text-sm"
          >
            Stay Here
          </button>

          <button
            onClick={onSaveAndNavigate}
            className="flex-1 bg-blue-600 text-white rounded-lg py-2 text-sm"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
