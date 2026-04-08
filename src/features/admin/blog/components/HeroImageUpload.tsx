"use client";

import { useRef, useState } from "react";
import { uploadFileToS3 } from "@/lib/uploadFile";
import toast from "react-hot-toast";
import Input from "@/components/Input"; // Your generic input
import { X } from "lucide-react";

interface HeroImageUploaderProps {
  imageUrl: string;
  caption: string;
  altText: string;
  onChange: (data: {
    imageUrl: string;
    caption: string;
    altText: string;
  }) => void;
}

export default function HeroImageUploader({
  imageUrl,
  caption,
  altText,
  onChange,
}: HeroImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (file: File) => {
    if (!file.type.startsWith("image/") || file.size > 5 * 1024 * 1024) {
      toast.error("Invalid file. Must be an image under 5MB", {
        duration: 3000,
        position: "top-right",
      });
      return;
    }

    try {
      setIsUploading(true);
      const url = await uploadFileToS3(file);
      onChange({ imageUrl: url, caption, altText });
      toast.success("Featured image uploaded successfully!", {
        duration: 3000,
        position: "top-right",
      });
    } catch (err) {
      toast.error("Upload failed. Please try again", {
        duration: 3000,
        position: "top-right",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-3">
      {!imageUrl ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            if (e.dataTransfer.files?.[0])
              handleUpload(e.dataTransfer.files[0]);
          }}
          className="flex h-32 flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 text-sm cursor-pointer hover:bg-slate-100 hover:border-blue-300 transition-all group"
        >
          <div className="text-center space-y-1">
            <div className="text-3xl text-slate-300 group-hover:text-blue-400 transition-colors">
              📸
            </div>
            <p className="text-xs text-slate-500">
              {isUploading ? "Uploading..." : "Drag or click to upload"}
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="relative group rounded-lg overflow-hidden">
            <img
              src={imageUrl}
              alt="Hero"
              onClick={() => setIsImageModalOpen(true)}
              className="h-32 w-full object-cover group-hover:opacity-90 transition-opacity cursor-pointer"
              title="Click to view full image"
            />
            <button
              onClick={() =>
                onChange({ imageUrl: "", caption: "", altText: "" })
              }
              className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white text-xs px-2 py-0.5 rounded font-medium transition-colors shadow-md"
            >
              ✕ Remove
            </button>
          </div>
          <div className="space-y-1.5">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-slate-600 block mb-0.5">
                Caption
              </label>
              <Input
                value={caption}
                onChange={(e) =>
                  onChange({ imageUrl, caption: e.target.value, altText })
                }
                placeholder="Enter image caption..."
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-slate-600 block mb-0.5">
                Alt Text
              </label>
              <Input
                value={altText}
                onChange={(e) =>
                  onChange({ imageUrl, caption, altText: e.target.value })
                }
                placeholder="Describe the image..."
              />
            </div>
          </div>
        </div>
      )}
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])}
      />

      {/* Image Preview Modal */}
      {isImageModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={() => setIsImageModalOpen(false)}
        >
          <div
            className="relative max-w-4xl max-h-[90vh] bg-white rounded-xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setIsImageModalOpen(false)}
              className="absolute top-4 right-4 z-10 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors"
            >
              <X className="w-6 h-6 text-slate-900" />
            </button>

            {/* Image */}
            <img
              src={imageUrl}
              alt="Featured Image Full View"
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}
