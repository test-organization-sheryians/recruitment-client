export const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  let token = document.cookie
    .split("; ")
    .find((row) => row.startsWith("access="))
    ?.split("=")[1];

  let res = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    },
  });

  if (res.status === 401) {
    const refreshRes = await fetch("http://localhost:9000/api/auth/refresh", {
      method: "POST",
      credentials: "include",
    });

    if (refreshRes.ok) {
      const data = await refreshRes.json();

      document.cookie = `access=${data.token}; path=/;`;

      res = await fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          Authorization: `Bearer ${data.token}`,
        },
      });
    }
  }

  return res;
};