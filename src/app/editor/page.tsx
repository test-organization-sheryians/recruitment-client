"use client";

import dynamic from "next/dynamic";

const RichEditor = dynamic(() => import("@/components/editor/RichEditor"), {
  ssr: false,
});

export default function EditorPage() {
  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Write Your Post</h1>
      <RichEditor />
    </div>
  );
}

