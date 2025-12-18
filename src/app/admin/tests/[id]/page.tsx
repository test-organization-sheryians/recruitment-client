import TestDetails from "@/features/admin/test/components/TestDetails";
import { notFound } from "next/navigation";

export default function Page({ params }: { params: { id: string } }) {
  if (!params?.id) {
    notFound();
  }

  return (
    <div>
      <TestDetails testId={params.id} />
    </div>
  );
}
