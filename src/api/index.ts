/* ================= AUTH ================= */
export * from "./auth/login";
export * from "./auth/register";
export * from "./auth/logout";
export * from "./auth/verify";

/* ================= PROFILE ================= */
export * from "./profile";

/* ================= AI TEST ================= */
export * from "./AITest/postResumeAndGenerateQuestions";
export * from "./AITest/evaluteAns";
export * from "./AITest/questionGen";

/* ================= CATEGORIES ================= */
export * from "./category/getCategories";
export * from "./category/addCategory";
export * from "./category/deleteCategory";
export * from "./category/updateCategory";

/* ================= JOBS ================= */
export * from "./jobs/getjobs";
export * from "./jobs/createJob";
export * from "./jobs/updateJob";
export * from "./jobs/deleteJob";
export * from "./jobs/jobCategory";
export * from "./jobs/getJobId";
export * from "./jobs/searchJobs";

/* ================= SKILLS ================= */
export * from "./skills/createSkill";
export * from "./skills/deleteSkill";
export * from "./skills/getAllSkills";
export * from "./skills/getSkill";
export * from "./skills/updateSkill";

/* ================= EXPERIENCE ================= */
export * from "./experience/createExperience";
export * from "./experience/deleteExperience";
export * from "./experience/getCandidateExperience";
export * from "./experience/getSingleExperience";
export * from "./experience/updateExperience";

/* ================= RESUME ================= */
export * from "./resumeExtract";

/* ================= USERS ================= */
export * from "./users/getAllUsers";
export * from "./users/updateUserRole";
export * from "./users/deleteUser";
export * from "./profile/index"


/* ================= TESTS ================= */
export * from "./tests/startTest";
export * from "./tests/testAttempts";
export * from "./tests/testInfo";
export * from "./tests/createTest";
export * from "./tests/getTest";
export * from "./tests/getTestDetails";
export * from "./tests/enRolltest";
export * from "./tests/updateTest";
export * from "./tests/neRolluser";
export * from "./tests/searchUsertest";
export * from "./tests/getUserAttempts";
