"use client";

import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import Cookies from "js-cookie";
import { logout as logoutSlice } from "../slice";
import { useLogout } from "../hooks/useAuthApi";

const Logout = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const { mutate: logoutUser, isPending } = useLogout();

  const handleLogout = () => {
    logoutUser(undefined, {
      onSuccess: () => {
        Cookies.remove("access");
        dispatch(logoutSlice());
        router.push("/login");
      },
      onError: (error) => {
        console.error("Logout failed:", error);
        // Optional: still redirect even if API fails
        Cookies.remove("access");
        dispatch(logoutSlice());
        router.push("/login");
      },
    });
  };

  return (
    <button
      onClick={handleLogout}
      disabled={isPending}
      className="px-6 py-2.5 bg-red-600 text-white rounded-full hover:bg-red-700 disabled:bg-red-400 disabled:cursor-not-allowed transition-colors font-medium text-sm"
    >
      {isPending ? "Logging out..." : "Logout"}
    </button>
  );
};

export default Logout;