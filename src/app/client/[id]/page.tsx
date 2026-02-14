'use client'

import { useParams } from "next/navigation"
import { useGetClient } from "@/features/client/hook/useClient"
import Link from "next/link"
import ClientDetailsCard from "@/features/client/components/ClientDetailsCard"

export default function Page() {
  const params = useParams()
  const id = params.id as string

  const { data, error, isPending } = useGetClient(id)

  if (isPending) return <p>Loading...</p>
  if (error) return <p>Error loading client</p>

  const client = data?.data

  return (
    <main className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Client details</h1>
      <ClientDetailsCard client={client}/>

      <div className="mt-6">
        <Link href="/client">← Back to clients</Link>
      </div>
    </main>
  )
}
