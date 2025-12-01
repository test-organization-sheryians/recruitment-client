export const parseResumeAPI = async (file: File) => {
  const response = await fetch("/api/parse-resume", {
    method: "POST",
    body: file,
  });

  if (!response.ok) {
    throw new Error("Failed to parse resume");
  }

  const data = await response.json();

  if (!data || !data.text) {
    throw new Error(data.error || "PDF parsing failed");
  }

  return data.text;
};
