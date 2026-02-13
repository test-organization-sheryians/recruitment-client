import { notFound } from "next/navigation";

interface PageProps {
  params: {
    id: string;
  };
}

export default async function UserProfilePage({ params }: PageProps) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/users/${params.id}`,
    { cache: "no-store" }
  );

  if (!res.ok) return notFound();

  const user = await res.json();

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">
        {user.firstName} {user.lastName}
      </h1>

      <p className="text-gray-600">{user.email}</p>

      <div className="mt-6 space-y-2">
        <p><strong>Phone:</strong> {user.phoneNumber}</p>
        <p><strong>Role:</strong> {user.role?.name}</p>
        <p><strong>Status:</strong> {user.status}</p>
      </div>
    </div>
  );
}
