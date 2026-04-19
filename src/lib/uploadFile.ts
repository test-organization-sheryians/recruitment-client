import api from "@/config/axios";
import axios from "axios"; 

interface FileDetails {
  fileName: string;
  contentType: string;
}

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];
const ALLOWED_PDF_TYPES = ["application/pdf"];

/**
 * Uploads a file (image or PDF) to S3 using a presigned URL fetched from backend API.
 * Returns a public URL that works immediately after upload.
 * @param file The File object to upload (images or PDF).
 * @param apiEndpoint The API endpoint to fetch the presigned URL.
 * @returns The public URL of the uploaded file.
 */
export async function uploadFileToS3(
  file: File,
  apiEndpoint: string = "/api/aws/presignedurl-s3"
): Promise<string> {
  // Validate file type
  const isImage = ALLOWED_IMAGE_TYPES.includes(file.type);
  const isPdf = ALLOWED_PDF_TYPES.includes(file.type);

  if (!isImage && !isPdf) {
    throw new Error(
      `Invalid file type. Allowed: Images (JPEG, PNG, GIF, WebP) or PDF. Got: ${file.type}`
    );
  }

  // Generate unique filename with timestamp
  const timestamp = Date.now();
  const randomSuffix = Math.random().toString(36).substring(2, 8);
  const fileNameWithoutExt = file.name.split(".").slice(0, -1).join(".");
  const fileExt = file.name.split(".").pop() || "";
  const fileDetails: FileDetails = {
    fileName: `${timestamp}-${randomSuffix}-${fileNameWithoutExt}.${fileExt}`,
    contentType: file.type,
  };

  console.log("=== FILE UPLOAD START ===");
  console.log("File Name:", file.name);
  console.log("File Size:", `${(file.size / 1024 / 1024).toFixed(2)} MB`);
  console.log("File Type:", file.type);
  console.log("Generated File Name:", fileDetails.fileName);
  console.log("Requesting presigned URL from backend...");

  try {
    // Step 1: Get presigned URL from backend
    const response = await api.post<string>(apiEndpoint, fileDetails, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    const presignedUrl = response.data;

    if (!presignedUrl) {
      throw new Error("No presigned URL received from backend");
    }

    console.log("✅ Presigned URL received from backend");
    console.log("Presigned URL:", presignedUrl);
    console.log("Uploading file to S3 with presigned URL...");

    // Step 2: Upload file to S3 using presigned URL
    const uploadResponse = await axios.put(presignedUrl, file, {
      headers: { "Content-Type": file.type },
    });

    if (uploadResponse.status !== 200) {
      throw new Error(`S3 upload failed with status: ${uploadResponse.status}`);
    }

    console.log("✅ File uploaded to S3 successfully!");

    // Step 3: Extract the file key from presigned URL and construct public URL
    // Presigned URLs look like: https://bucket.s3.region.amazonaws.com/path/to/file?query=params
    // Extract the base URL from presigned URL (removes query params)
    // This is more robust than hardcoding bucket/region
    const urlObj = new URL(presignedUrl);
    const fileKey = urlObj.pathname.substring(1); // Remove leading /
    
    // Construct the final public URL using origin + pathname from presigned URL
    // This approach works regardless of bucket name, region, or S3 endpoint changes
    const finalUrl = `${urlObj.origin}${urlObj.pathname}`;

    console.log("%c========== FILE S3 URL (Click to open) ==========", "color: green; font-weight: bold; font-size: 14px;");
    console.log(finalUrl);
    console.log("%c===============================================", "color: green; font-weight: bold;");
    console.log("Origin:", urlObj.origin);
    console.log("Region/Bucket:", urlObj.hostname);
    console.log("File Key:", fileKey);
    console.log("Type:", isImage ? "Image" : "PDF");
    console.log("=== FILE UPLOAD END ===");

    return finalUrl;

  } catch (error) {
    console.error("❌ Error during file upload:", error);
    if (axios.isAxiosError(error)) {
      const errorMsg = error.response?.data?.message || error.message;
      console.error("Presigned URL error:", errorMsg);
      throw new Error(`Upload Failed: ${errorMsg}`);
    }
    throw new Error(`Upload Failed: ${(error as Error).message}`);
  }
}
