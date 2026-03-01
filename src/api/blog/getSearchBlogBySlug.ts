import api from "@/config/axios";

export async function getSearchBlogBySlug(slug: string) {
  if (!slug) return [];

  const res = await api.get("/api/blogs/admin?page=1&limit=50");

  const blogs = res.data?.data?.blogs || [];

  const searchTerm = slug.toLowerCase();

  return blogs.filter(
    (blog: any) =>
      blog.slug?.toLowerCase().includes(searchTerm) ||
      blog.title?.toLowerCase().includes(searchTerm) ||
      blog.subtitle?.toLowerCase().includes(searchTerm),
  );
}
