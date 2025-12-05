'use client'
import { useParams } from 'next/navigation'
import React from 'react'

const Page = () => { // Renamed 'page' to 'Page' for convention
    const param = useParams()
    const id = param.id // Assuming your parameter is named 'id'
    console.log(param)
  return (
    <div>
       {/* Use regular JSX interpolation { } to display the value */}
       This is the **ID**: **{id}**
       {/* You can still use the template literal, but within the { } */}
       <p>The entire param object is: {JSON.stringify(param)}</p>
    </div>
  )
}

export default Page