"use client"

import { useFetchedProducts } from "../hooks/useFetchedProducts"


const ShowProducts = () => {
    const { data, isLoading } = useFetchedProducts();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center text-2xl">
                Loading...
            </div>
        )
    }

    return (
        <div>
            {JSON.stringify(data)}
        </div>
    )
}

export default ShowProducts