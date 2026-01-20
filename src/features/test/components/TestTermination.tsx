// TestTerminatedModal.tsx
import { AlertOctagon } from "lucide-react";
import { useRouter } from "next/navigation";

interface Props {
  onExit?: () => void; // optional if you want custom logic
}

export default function TestTerminatedModal({ onExit }: Props) {
  const router = useRouter();

  const handleExit = () => {
    sessionStorage.setItem("disqualified", "true");
    onExit?.();
    router.push("/");
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-2xl ring-1 ring-black/10">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
          <AlertOctagon className="h-9 w-9 text-red-600" />
        </div>

        <h2 className="mb-2 text-2xl font-extrabold tracking-wide text-red-600">
          TEST TERMINATED
        </h2>

        <p className="mb-6 text-sm leading-relaxed text-gray-600">
          Activity violation detected{" "}
          <b>(multiple tab switches)</b>. Your test has been locked and reported.
        </p>

        <button
          onClick={handleExit}
          className="w-full rounded-lg bg-red-600 py-3 text-sm font-bold text-white shadow-md transition hover:bg-red-700 active:scale-95 focus:outline-none focus:ring-4 focus:ring-red-300"
        >
          RETURN TO HOME
        </button>
      </div>
    </div>
  );
}
