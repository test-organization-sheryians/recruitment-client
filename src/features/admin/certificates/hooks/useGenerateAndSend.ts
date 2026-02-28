import { useState } from "react";
import { generateAndSendCertificates } from "@/api/certificate/genrate-and-send_certificate";
import axios from "axios";

export const useGenerateAndSend = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (file: File, templateUrl: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await generateAndSendCertificates(
        file,
        templateUrl
      );

      return response;
    } catch (err: unknown) {
  if (axios.isAxiosError(err)) {
    setError(err.response?.data?.message || "API Error");
  } else if (err instanceof Error) {
    setError(err.message);
  } else {
    setError("Something went wrong");
  }
  throw err;
}
  }
  return { handleGenerate, loading, error };
}
//     } finally {
//       setLoading(false);
//     }
//   };

//   return { handleGenerate, loading, error };
// };