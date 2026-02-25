export async function getAllBlogs(skip = 0, limit = 10) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/blogs?skip=${skip}&limit=${limit}&type=admin`,
  );

  if (!res.ok) {
    throw new Error("Failed to fetch blogs");
  }

  return res.json();
}
