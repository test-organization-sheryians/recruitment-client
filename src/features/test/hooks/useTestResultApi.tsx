// src/hooks/useSubmitTest.ts

import { useMutation } from "@tanstack/react-query";
import { submitTestAPI, SubmitPayload } from "@/api/submitTestAPI";

export const useSubmitTest = () => {
  return useMutation({
    mutationFn: async ({
      attemptId,
      payload,
    }: {
      attemptId: string;
      payload: SubmitPayload;
    }) => submitTestAPI({ attemptId, payload }),
  });
};
