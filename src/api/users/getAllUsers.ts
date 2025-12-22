// import api from "@/config/axios";

// export const getAllUsers = async () => {

//     const query = role ? `?role=${role}` : "";
//   const res = await api.get("/api/users/allUser");

//   // backend returns:
//   // { success: true, data: users }
//   return res.data.data; 
// };
// my code 


import api from "@/config/axios";

// export const getAllUsers = async (role?: string) => {
//   const res = await api.get("/api/users/allUser", {
//     params: role ? { role } : {},
//   });

//   return res.data.data;
// };


// new code
export const getAllUsers = async (role?: string) => {
  let query = "";

  if (role && role !== "all") {
    const normalized = role.trim().toLowerCase();
    if (normalized === "none" || normalized === "no role") {
      query = "?noRole=true";
    } else {
      // encode role to safely include values with spaces/special chars
      query = `?role=${encodeURIComponent(role)}`;
    }
  }

  const res = await api.get(`/api/users/allUser${query}`);
  return res.data.data;
};

