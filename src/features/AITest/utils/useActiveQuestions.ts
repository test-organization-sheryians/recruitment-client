// "use client";

// import { useQuery } from "@tanstack/react-query";
// import { useGenerateQuestions } from "../hooks/aiTestApi";

// const STRATEGIES = {
//   resume: () => {
//     const { data, isLoading } = useGenerateQuestions();

//     return {
//       questions: data?.questions || [],
//       attemptMeta: {
//         mode: "resume",
//         attemptId: null,
//         testId: null,
//         email: null,
//         startTime: Date.now(),
//       },
//       isLoading,
//     };
//   },

//   real: () => {
//     const { data, isLoading } = useQuery({
//       queryKey: ["active-questions"],
//       queryFn: () => null,
//       staleTime: Infinity,
//     });

//     return {
//       questions: data?.questions || [],
//       attemptMeta: data?.attemptMeta || null,
//       isLoading,
//     };
//   },
// };

// export const useActiveQuestions = (mode: keyof typeof STRATEGIES = "resume") => {
//   return STRATEGIES[mode]();
// };
