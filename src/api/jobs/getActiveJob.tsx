import api from "@/config/axios/index";  


  export const getActiveJob = async () => {
    const res = await api.get("/api/jobs/status/active");
    console.log(res.data,"Herer is data ");
    return res.data.data;
  }
