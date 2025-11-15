"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { Provider } from "react-redux";
import { store } from "@/config/store";

const Wrapper = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [client] = useState(() => new QueryClient());

  const [authChecked, setAuthChecked] = useState(true);

  // useEffect(() => {
  //   const token = Cookies.get("access") || null;
  //   const publicPaths = ["/login", "/register", "/"];

  //   if (!token && !publicPaths.includes(pathname)) {
  //     router.replace("/login");
  //   } else if (token && publicPaths.includes(pathname)) {
  //     router.replace("/resume");
  //   } else {
  //     setAuthChecked(true);
  //   }
  // }, [pathname, router]);

  if (!authChecked) {
    return <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>Loading...</div>;
  }

  return (
    <QueryClientProvider client={client}>
      <Provider store={store}>{children}</Provider>
    </QueryClientProvider>
  );
};

export default Wrapper;