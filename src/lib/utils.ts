import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import Cookies from "js-cookie";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

 //logout timer added

let logoutTimer: ReturnType<typeof setTimeout>;

export const startSessionWatcher = (expiresIn: number) => {
  if (logoutTimer) clearTimeout(logoutTimer);

  logoutTimer = setTimeout(() => {
    Cookies.remove("refreshToken");
    Cookies.remove("accessToken");
    window.location.replace("/login");
  }, expiresIn * 1000);
};


