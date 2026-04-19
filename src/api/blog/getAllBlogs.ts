export async function getAllBlogs(page = 1, limit = 10) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/blogs/admin?page=${page}&limit=${limit}`,
  );

  if (!res.ok) {
    throw new Error("Failed to fetch blogs");
  }

  return res.json();
}
