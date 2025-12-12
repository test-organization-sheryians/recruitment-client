export const submitHandler = async ({
  answers,
  questions,
  attemptMeta,
  submitMutation,
  evaluateMutation,
  onSuccess,
  onError,
}: any) => {
  try {
    const cleanedAnswers = answers.map((a: any) =>
      typeof a === "string"
        ? a
        : `${a?.text || ""}\n${a?.code || ""}`.trim()
    );

    const mode = attemptMeta?.mode || "resume";

    const strategies: any = {
      real: async () => {
        await submitMutation.mutateAsync({
          attemptId: attemptMeta.attemptId,
          testId: attemptMeta.testId,
          email: attemptMeta.email,
          startTime: attemptMeta.startTime,
          answers: cleanedAnswers,
          score: 0,
        });
        onSuccess("real");
      },

      resume: async () => {
        const result = await evaluateMutation.mutateAsync({
          questions: questions.map((q: any) => q.question),
          answers: cleanedAnswers,
        });
        onSuccess("practice", result);
      },
    };

    await strategies[mode]();
  } catch (err) {
    console.error("SUBMIT ERROR:", err);
    onError(err);
  }
};
