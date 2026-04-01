"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function CallbackPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const token = searchParams.get("token");

    if (token) {
      document.cookie = `accessToken=${token}; path=/;`; 
      

      router.push("/dashboard");
    } else {
      router.push("/google-auth");
    }
  }, [searchParams, router]);

  return
   <p>Logging you in...</p>;
}
