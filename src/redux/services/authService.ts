import { setUser, setLoading } from "../slices/authSlice";
import { AppDispatch } from "../store";

export const fetchUser = async (dispatch: AppDispatch) => {
  try {
    dispatch(setLoading(true));

    const res = await fetch("http://localhost:9000/api/auth/me", {
      method: "GET",
      credentials: "include",
    });

    if (!res.ok) {
      dispatch(setUser(null));
      return;
    }

    const data = await res.json();
    dispatch(setUser(data.user));
  } catch (error) {
    console.error("Auth error:", error);
    dispatch(setUser(null));
  } finally {
    dispatch(setLoading(false));
  }
};