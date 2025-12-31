import api from "@/config/axios"

interface SearchJobParams {
  q?: string;
  location?: string;
}


export const searchJob = async ({ q, location }: SearchJobParams) => {
  const res = await api.get("/api/jobs/search", {
    params: {
      q,
      location,
    },
  });

  console.log("search api response ===>", res.data);
  return res.data;
};