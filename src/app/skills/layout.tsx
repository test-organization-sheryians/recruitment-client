"use client"

import QueryProvider from "@/components/hoc/QueryProvider";
import { Provider } from "react-redux";
import { store } from "../../redux/store";
import { div } from "framer-motion/client";
//import QueryProvider from "@/components/hoc/QueryProvider";
import { ReactCompilerOptions } from "next/dist/server/config-shared";

export default function  Skillslayout({children}:  {children : React.ReactNode}){
    return (
    
          <Provider store={store}>
      <QueryProvider>
        {children}
      </QueryProvider>
    </Provider>
    
    )
}