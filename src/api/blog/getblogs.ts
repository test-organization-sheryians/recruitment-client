export async function getBlogs() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/blogs`
  );

  if (!res.ok) {
    throw new Error("Failed to fetch blogs");
  }

  return res.json();
}