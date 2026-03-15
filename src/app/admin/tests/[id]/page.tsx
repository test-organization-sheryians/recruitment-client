import TestDetails from "@/features/admin/test/components/TestDetails";
import { notFound } from "next/navigation";

export default async function Page(
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!id) {
    notFound();
  }

  return (
    <div>
      <TestDetails testId={id} />
    </div>
  );
}
  