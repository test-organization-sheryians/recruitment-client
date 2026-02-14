"use client";

import Link from "next/link";
import ClientCard from "../../features/client/components/ClientCard";
import { useGetAllClients } from "../../features/client/hook/useClient";
import { useRouter } from "next/navigation";

const ClientList = () => {
  const { data, isLoading, error } = useGetAllClients();
  const router = useRouter();

  if (isLoading)
    return (
      <div className="p-6">
        <p className="text-gray-500">Loading clients...</p>
      </div>
    );

  if (error)
    return (
      <div className="p-6">
        <p className="text-red-500">Error loading clients</p>
      </div>
    );

  const clients = data?.data || [];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">
          Clients
        </h1>

        <button
          onClick={() => router.push("/client/register")}
          className="bg-black text-white text-sm px-4 py-2 rounded-lg hover:bg-gray-800 transition"
        >
          + Register
        </button>
      </div>

     
      {clients.length === 0 ? (
        <div className="text-gray-500 text-sm">
          No clients found.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {clients.map((client: any) => (
            <Link key={client._id} href={`/client/${client._id}`}>
              <ClientCard client={client} />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default ClientList;
