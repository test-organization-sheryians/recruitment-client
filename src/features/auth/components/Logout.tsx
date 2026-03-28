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
    // 1. Call API to invalidate session on server
    logoutUser(undefined, {
      onSettled: () => {
        // We use onSettled so cleanup happens even if the API call fails
        
        // 2. Clear Redux State
        dispatch(logoutSlice());

        // 3. Clear Cookies (Use the exact keys from your Axios/Login logic)
        const cookieOptions = { path: '/' };
        Cookies.remove("access", cookieOptions);
        Cookies.remove("role", cookieOptions);
        // Remove these if your backend uses them, otherwise stick to "access"
        Cookies.remove("refreshToken", cookieOptions); 
        Cookies.remove("accessToken", cookieOptions);

        // 4. Clear Storage
        try {
          localStorage.clear();
          sessionStorage.clear();
        } catch (e) {
          console.error("Storage clear failed", e);
        }

        // 5. Redirect and Force Refresh
        // router.replace is good, but window.location.href ensures 
        // all memory-leaked states are destroyed.
        window.location.href = "/login";
      },
    });
  };

  return (
    <button
      onClick={handleLogout}
      disabled={isPending}
      className="px-6 py-2.5 w-full cursor-pointer bg-red-600 text-white rounded-full hover:bg-red-700 disabled:bg-red-400 disabled:cursor-not-allowed transition-colors font-medium text-sm"
    >
      {isPending ? "Logging out..." : "Logout"}
    </button>
  );
};

export default Logout;