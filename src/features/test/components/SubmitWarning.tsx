// SubmitConfirmModal.tsx
interface Props {
  onCancel: () => void;
  onConfirm: () => void;
}

export default function SubmitConfirmModal({ onCancel, onConfirm }: Props) {
  return (
    <div className="fixed inset-0 z-[200] bg-black/80 flex items-center justify-center">
      <div className="bg-white rounded-2xl p-6 max-w-sm w-full text-center">
        <h2 className="text-xl font-bold mb-2">Submit Test?</h2>

        <p className="text-gray-600 mb-6">
          You won’t be able to change answers after this.
        </p>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 border rounded-lg py-2"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="flex-1 bg-cyan-600 text-white rounded-lg py-2"
          >
            Yes, Submit
          </button>
        </div>
      </div>
    </div>
  );
}
