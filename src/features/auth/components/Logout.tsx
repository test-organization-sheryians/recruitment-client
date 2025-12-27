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
        Cookies.remove("accessToken", { path: '/' });
        Cookies.remove("refreshToken", { path: '/' });
        Cookies.remove("role", { path: '/' });
        Cookies.remove("access", { path: '/' });
        try {
          localStorage.clear();
          sessionStorage.clear();
        } catch {}
        dispatch(logoutSlice());
        router.replace("/login");
        setTimeout(() => {
          try {
            // try to close window in environments that allow it (electron, opened windows)
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            window.open('', '_self');
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            window.close();
          } catch {}
          window.location.href = '/login';
        }, 50);
      },
      onError: (error) => {
        console.error("Logout failed:", error);
        Cookies.remove("accessToken", { path: '/' });
        Cookies.remove("refreshToken", { path: '/' });
        Cookies.remove("role", { path: '/' });
        Cookies.remove("access", { path: '/' });
        try {
          localStorage.clear();
          sessionStorage.clear();
        } catch {}
        dispatch(logoutSlice());
        router.replace("/login");
        setTimeout(() => {
          try {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            window.open('', '_self');
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            window.close();
          } catch {}
          window.location.href = '/login';
        }, 50);
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
