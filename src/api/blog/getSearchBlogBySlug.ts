export async function getSearchBlogBySlug(slug: string) {
  if (!slug) return [];

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/blogs/slug/${slug}`,
  );

  if (!res.ok) return [];

  const data = await res.json();
  return data.data ? [data.data] : [];
}
