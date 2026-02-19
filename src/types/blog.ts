// src/types/blog.ts
import type { PartialBlock } from "@blocknote/core";

export interface BlogPost {
  _id?: string; // MongoDB id

  title: string;
  slug: string;
  subtitle: string;
  readingTime: string;

  category: string;
  technologies: string[]; // ObjectId[]

  hero: {
    imageUrl: string;
    caption: string;
    altText: string;
  };

  content: PartialBlock[]; // 👈 keep this for editor

  author?: string; // ObjectId

  seo: {
    metaTitle: string;
    metaDescription: string;
    keywords: string[];
    ogImage: string;
  };

  stats: {
    views: number;
    likes: number;
    shares: number;
  };

  isPublished: boolean;
  publishedAt: Date | null;

  allowNewsletter: boolean;

  status: "draft" | "published" | "archived";

  // timestamps
  createdAt?: Date;
  updatedAt?: Date;
}