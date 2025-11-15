"use client";

import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import Cookies from "js-cookie";
import { logout as logoutSlice } from "../slice"; 
import useAuthApi from "../hooks/useAuthApi";

const Logout = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { logoutMutation } = useAuthApi(); 

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        Cookies.remove("access");
        dispatch(logoutSlice());
        router.push("/login");
      },
      onError: (error: any) => {
        console.error("Logout error:", error);
      },
    });
  };

  return (
    <button
      onClick={handleLogout}
      disabled={logoutMutation.isPending}
      className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:bg-blue-400 transition-colors"
    >
      {logoutMutation.isPending ? "Logging out..." : "Logout"}
    </button>
  );
};

export default Logout;
