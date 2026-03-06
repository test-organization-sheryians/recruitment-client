// import { useState } from "react";
// import { generateAndSendCertificates } from "@/api/certificate/genrate-and-send_certificate";
// import axios from "axios";

// export const useGenerateAndSend = () => {
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const handleGenerate = async (file: File, templateUrl: string) => {
//     try {
//       setLoading(true);
//       setError(null);

//       const response = await generateAndSendCertificates(
//         file,
//         templateUrl
//       );

//       return response;
//     } catch (err: unknown) {
//   if (axios.isAxiosError(err)) {
//     setError(err.response?.data?.message || "API Error");
//   } else if (err instanceof Error) {
//     setError(err.message);
//   } else {
//     setError("Something went wrong");
//   }
//   throw err;
// }
//   }
//   return { handleGenerate, loading, error };
// }

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { generateAndSendCertificates } from "@/api/certificate/genrate-and-send_certificate";
import { useToast } from "../../../../components/ui/Toast"; // Ensure this matches your project's toast path

export const useGenerateAndSend = () => {
  const{success, error } = useToast();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ file, templateUrl }: { file: File; templateUrl: string }) => 
      generateAndSendCertificates(file, templateUrl),
    
    onSuccess: () => {
      // ✅ Success message (Clear response)
      success("Certificates generated and sent successfully");
      queryClient.invalidateQueries({ queryKey: ["certificates"] });
    },
    
    onError: (err: any) => {
      // ✅ Centralized error handling: Backend se aa raha message show karein
      const errorMessage = err?.response?.data?.message || "Failed to send certificates.";
      error(errorMessage);
    }
  });

  return {
    handleGenerate: mutation.mutateAsync,
    loading: mutation.isPending, // loading state (automatically managed)
    error: mutation.error        // error state (automatically managed)
  };
};