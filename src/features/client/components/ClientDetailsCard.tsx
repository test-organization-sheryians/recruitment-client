'use client'

import { useRouter } from "next/navigation"
import { useDeleteClient } from "../hook/useClient"

type ClientDetailsProps = {
  client: {
    _id?: string
    name?: string
    website?: string
    location?: string
    sector?: string
    description?: string
  }
}

const ClientDetailsCard = ({ client }: ClientDetailsProps) => {

  const { mutate: deleteClientMutation, isPending } = useDeleteClient()
  const router = useRouter()

  const deleteClient = () => {
    if (!client?._id) return

    deleteClientMutation(client._id, {
      onSuccess: () => {
        console.log("Client deleted successfully")
        alert('deleted')
        // optional: redirect or refetch list
        router.push('/client')

      },
      onError: (error) => {
        console.error("Delete failed:", error)
      }
    })
  }

  const updateClient = ()=>{
     router.push(`/client/${client._id}/edit`)
  }

  return (
    <div className="bg-white shadow-lg rounded-2xl p-6 max-w-2xl w-full">

      <h2 className="text-2xl font-bold mb-4 text-gray-800">
        {client?.name ?? "—"}
      </h2>

      <div className="space-y-3 text-gray-700">

        <div>
          <span className="font-semibold">Website:</span>{" "}
          {client?.website ? (
            <a
              href={client.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              {client.website}
            </a>
          ) : (
            "—"
          )}
        </div>

        <div>
          <span className="font-semibold">Location:</span>{" "}
          {client?.location ?? "—"}
        </div>

        <div>
          <span className="font-semibold">Sector:</span>{" "}
          {client?.sector ?? "—"}
        </div>

        <div>
          <span className="font-semibold block mb-1">Description:</span>
          <p className="text-gray-600">
            {client?.description ?? "—"}
          </p>
        </div>
      </div>

      <div className="flex gap-10">
        <div className="mt-6">
          <button
            onClick={updateClient}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Edit
          </button>
        </div>
        <div className="mt-6">
          <button
            onClick={deleteClient}
            disabled={isPending}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 disabled:opacity-50"
          >
            {isPending ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>

    </div>
  )
}

export default ClientDetailsCard
