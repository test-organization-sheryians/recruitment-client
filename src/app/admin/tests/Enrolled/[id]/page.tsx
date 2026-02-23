
import EnrolledPopup from "@/features/admin/test/components/EnrolledPopUp";
import { notFound } from "next/navigation";

export default async function Page(
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!id) notFound();

  // page only passes route param
  return <EnrolledPopup testId={id} onClose={() => {}} />;
}
