import Cookies from "js-cookie";

/**
 * Check if user has a valid refresh token
 * Returns true only if refresh token exists and is not empty
 */
export const hasRefreshToken = (): boolean => {
  try {
    const refreshToken = Cookies.get("refreshToken");
    return !!refreshToken && refreshToken.trim().length > 0;
  } catch {
    return false;
  }
};

/**
 * Check if user has an access token
 */
export const hasAccessToken = (): boolean => {
  try {
    const token = Cookies.get("token");
    return !!token && token.trim().length > 0;
  } catch {
    return false;
  }
};

/**
 * Check if user is authenticated (has both tokens)
 */
export const isAuthenticated = (): boolean => {
  return hasAccessToken() && hasRefreshToken();
};

/**
 * Clear all auth tokens
 */
export const clearAuthTokens = (): void => {
  try {
    Cookies.remove("token", { path: "/" });
    Cookies.remove("refreshToken", { path: "/" });
    Cookies.remove("role", { path: "/" });
  } catch (error) {
    console.error("Error clearing auth tokens:", error);
  }
};

/**
 * Get user role from cookie
 */
export const getUserRole = (): string | null => {
  try {
    return Cookies.get("role") || null;
  } catch {
    return null;
  }
};
