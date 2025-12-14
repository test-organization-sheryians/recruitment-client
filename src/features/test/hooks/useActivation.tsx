import { useQuery } from "@tanstack/react-query";
import * as api from "@/api";

export const useActiveQuestions = () =>
  useQuery<api.RawQuestion[]>({
    queryKey: ["active-questions"],
    queryFn: () => [],
    enabled: false,
  });
