'use client';

import FileUploadComponent from "@/features/admin/test/components/FileUploadComponent";

export default function Page() {
  return (
    <FileUploadComponent apiEndpoint="/api/upload" />
  );
}
