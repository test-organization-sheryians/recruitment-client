import UserDetails from "@/features/admin/users/components/UserDetails";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

const Page = async ({ params }: PageProps) => {
  const { id } = await params; 

  return (
    <div>
      <UserDetails id={id} />
    </div>
  );
};

export default Page;