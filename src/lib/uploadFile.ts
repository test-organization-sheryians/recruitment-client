import api from "@/config/axios";
import axios from "axios"; 

interface FileDetails {
  fileName: string;
  contentType: string;
}

/**
 * Uploads a file to S3 using a presigned URL fetched from a backend API.
 * * @param file The File object to upload.
 * @param apiEndpoint The local API endpoint to fetch the presigned URL.
 * @returns The final public URL of the uploaded file.
 */
export async function uploadFileToS3(
  file: File,
  apiEndpoint: string = "/api/aws/presignedurl-s3"
): Promise<string> {
   if (file.type !== "application/pdf") {
    throw new Error("Only PDF files are allowed.");
  }
  
  const fileDetails: FileDetails = {
    fileName: file.name + Date.now(),
    contentType: file.type,
  };
console.log("Preparing to upload file:", fileDetails);
  try {
    const response = await api.post<string>(apiEndpoint, fileDetails, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    const presignedUrl = response.data;
    console.log("Received presigned URL from backend:", presignedUrl);

    // Step 2: Upload file to S3 using presigned URL
    const uploadResponse = await axios.put(presignedUrl, file, {
      headers: { "Content-Type": file.type },
    });
    console.log("File uploaded to S3, response status:", uploadResponse.status);

     // Step 3: Return final public URL
    const finalUrl = `https://sherihunt.s3.ap-south-1.amazonaws.com/uploads/${encodeURIComponent(fileDetails.fileName)}`;
    console.log("Final public URL:", finalUrl);

    return finalUrl;
    
  } catch (error) {
    console.error("Error during S3 upload process:", error);
    if (axios.isAxiosError(error)) {
      throw new Error(
        `S3 Upload Failed: ${error.response?.statusText || error.message}`
      );
    }
    throw new Error(`S3 Upload Failed: ${(error as Error).message}`);
  }
}