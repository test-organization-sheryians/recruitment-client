"use client";

import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import axios from "@/config/axios";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { logout } from "../slice";
import { LogOut } from "lucide-react";

const LogoutButton = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const logoutMutation = useMutation({
    mutationFn: () => axios.post("/api/auth/logout"),
    onSuccess: () => {
      Cookies.remove("access");
      dispatch(logout());
      router.push("/login");
    },
    onError: (error) => {
      console.error("Logout error:", error);
    },
  });

  return (
    <button
      onClick={() => logoutMutation.mutate()}
      disabled={logoutMutation.isPending}
      className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:bg-blue-400 transition-colors"
    >
      {logoutMutation.isPending ? "Logging out..." : "Logout"}
    </button>
  );
};

export default LogoutButton;