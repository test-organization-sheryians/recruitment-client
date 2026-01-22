// TestInstructionsModal.tsx
interface Props {
  onClose: () => void;
}

export default function TestInstructionsModal({ onClose }: Props) {
  return (
    <div className="fixed inset-0 z-[400] bg-black/70 flex items-center justify-center">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl text-gray-800">
        <h2 className="text-xl font-bold mb-4 text-center text-blue-600">
          Test Instructions
        </h2>

        <div className="space-y-3 text-sm">
          <Instruction color="bg-red-500" label="Red" text="Question visited but no answer saved" />
          <Instruction color="bg-green-600" label="Green" text="Answer saved successfully" />
          <Instruction color="bg-amber-500" label="Orange" text="Marked for review" />
          <Instruction ring label="Blue Ring" text="Current question" />

          <hr className="my-3" />

          <p className="text-red-600 font-semibold">
            ⚠️ Do NOT switch tabs, minimize, or leave the test window.
            <br />Doing so may <b>disqualify your test automatically</b>.
          </p>

          <p className="text-gray-700">
            💾 Always <b>Save</b> or <b>Mark for Review</b> before navigating.
          </p>
        </div>

        <button
          onClick={onClose}
          className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg"
        >
          Got It
        </button>
      </div>
    </div>
  );
}

function Instruction({
  color,
  label,
  text,
  ring,
}: {
  color?: string;
  label: string;
  text: string;
  ring?: boolean;
}) {
  return (
    <div className="flex items-center gap-3">
      <span
        className={`w-4 h-4 rounded-full ${
          ring ? "ring-2 ring-indigo-500" : color
        }`}
      />
      <span>
        <b>{label}:</b> {text}
      </span>
    </div>
  );
}
