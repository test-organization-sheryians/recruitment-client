"use client"

import QueryProvider from "@/components/hoc/QueryProvider";


export default function  Skillslayout({children}:  {children : React.ReactNode}){
    return (
    
       
      <QueryProvider>
        {children}
      </QueryProvider>
   
    
    )
}