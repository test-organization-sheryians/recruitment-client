// Admin: Create Blog Page
"use client";

import CreateBlogLayout from "@/features/admin/blog/components/BlogLayout";

export default function CreateBlogPage() {
  return (
    <div className="bg-slate-50">
      <div className="mx-auto max-w-6xl px-6 py-8">
        <CreateBlogLayout />
      </div>
    </div>
  );
}
