export async function getAllBlogs() {
  const res = await fetch("/api/blogs");

  if (!res.ok) {
    throw new Error("Failed to fetch blogs");
  }

  return res.json();
}