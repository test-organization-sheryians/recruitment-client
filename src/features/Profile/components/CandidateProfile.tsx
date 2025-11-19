// "use client";

// import { useState } from "react";
// import EditSection from "./EditSection"; // ← using the new component
// import { Button } from "@/components/ui/button";

// export default function CandidateProfile() {
//   // Personal info
//   const [firstName, setFirstName] = useState("Candidate");
//   const [lastName, setLastName] = useState("Name");
//   const [phone, setPhone] = useState("867643885");
//   const [email] = useState("xyz@mail.com"); // email not editable

//   // Skills
//   const [skills, setSkills] = useState(["React", "Node.js"]);

//   // Experience
// const [experience, setExperience] = useState([
//   {
//     title: "Frontend Intern",
//     company: "Tech Corp",
//     description: "Worked on UI components and dashboards.",
//     start: "Jan 2023",
//     end: "Jun 2023",
//   },
// ]);


//   // Socials
//   const [linkedin, setLinkedin] = useState("");
//   const [github, setGithub] = useState("");

//   const [resume, setResume] = useState<File | null>(null);

//   return (
//     <div className="w-full min-h-screen bg-gray-100 flex justify-center p-6">
//       <div className="max-w-3xl w-full space-y-6">
        
//         {/* Profile Header */}
//         <div className="bg-blue-200 rounded-xl border shadow-sm p-6 flex items-center gap-4">
//           <div className="h-18 w-18 rounded-full bg-blue-500 text-white font-bold grid place-items-center text-4xl leading-none">
//             {firstName.charAt(0)}
//           </div>
//           <div>
//             <h2 className="text-2xl font-bold">
//               {firstName} {lastName}
//             </h2>
//             <p className="text-m text-semibold text-gray-500">Fresher</p>
//           </div>
//         </div>

//         {/* PERSONAL INFO */}
//         <div className="bg-white rounded-xl border shadow-sm p-6 space-y-4">
//           <div className="flex justify-between items-center">
//             <h3 className="font-semibold text-gray-700 text-lg">Personal Information</h3>

//             <EditSection
//               title="Personal Information"
//               fields={[
//                 { key: "firstName", label: "First Name", value: firstName },
//                 { key: "lastName", label: "Last Name", value: lastName },
//                 { key: "phone", label: "Phone Number", value: phone },
//                 { key: "email", label: "Email Address", value: email, disabled: true },
//               ]}
//               onSave={(updated) => {
//                 setFirstName(updated.firstName);
//                 setLastName(updated.lastName);
//                 setPhone(updated.phone);
//               }}
//             />
//           </div>

//  <div className="grid grid-cols-2 gap-6">
//   {/* First Name */}
//   <div className="flex flex-col">
//     <span className="text-sm text-gray-500">First Name</span>
//     <span className="text-m font-medium">{firstName}</span>
//   </div>

//   {/* Last Name */}
//   <div className="flex flex-col">
//     <span className="text-sm text-gray-500">Last Name</span>
//     <span className="text-m font-medium">{lastName}</span>
//   </div>

//   {/* Phone */}
//   <div className="flex flex-col">
//     <span className="text-sm text-gray-500">Phone</span>
//     <span className="text-m font-medium">{phone}</span>
//   </div>

//   {/* Email */}
//   <div className="flex flex-col">
//     <span className="text-sm text-gray-500">Email</span>
//     <span className="text-m font-medium">{email}</span>
//   </div>
// </div>

//         </div>

// {/* SKILLS */}
// <div className="bg-white rounded-xl border shadow-sm p-6 space-y-4">
//   <div className="flex justify-between items-center">
//     <h3 className="font-semibold text-lg text-gray-700">Skills</h3>

//     <EditSection
//       title="Skills"
//       type="string"
//       fields={skills.map((s, i) => ({
//         key: String(i),
//         label: Skill ${i + 1},
//         value: s,
//       }))}
//       onSave={(updated) => {
//         const arr = Object.values(updated).filter((s) => s.trim() !== "");
//         setSkills(arr);
//       }}
//       allowAddMore={true}   // ⭐ Enable unlimited skills
//     />
//   </div>

//   {/* Rectangular Bubbles */}
//   <div className="flex flex-wrap gap-2">
//     {skills.map((s, index) => (
//       <div
//         key={index}
//         className="px-3 py-1 bg-gray-100 border rounded-lg text-sm"
//       >
//         {s}
//       </div>
//     ))}
//   </div>
// </div>

// {/* EXPERIENCE */}
// <div className="bg-white rounded-xl border shadow-sm p-6 space-y-4">
//   <div className="flex justify-between items-center">
//     <h3 className="font-semibold text-lg text-gray-700">Experience</h3>

//     <EditSection
//       title="Experience"
//       type="experience"
//       fields={experience.map((exp, i) => ({
//         key: String(i),
//         label: Experience ${i + 1},
//         value: exp,
//       }))}
//       onSave={(updated) => {
//         const arr = Object.values(updated);
//         setExperience(arr); // save all experiences including newly added ones
//       }}
//       allowAddMore={true} // enables adding new experience
//     />
//   </div>

//   <div className="space-y-4">
//     {experience.map((exp, i) => (
//       <div key={i} className="p-4 border rounded-md bg-gray-50">
//         <h4 className="font-semibold">{exp.title}</h4>
//         <p className="text-sm">{exp.company}</p>
//         <p className="text-sm text-gray-500">
//           {exp.start} - {exp.end}
//         </p>
//         <p className="text-gray-700">{exp.description}</p>
//       </div>
//     ))}
//   </div>
// </div>


//         {/* RESUME */}
//         <div className="bg-white rounded-xl border shadow-sm p-6 space-y-4">
//           <h3 className="font-semibold text-lg text-gray-700">Resume</h3>

//           <label className="border rounded-lg h-20 flex items-center justify-center text-gray-500 cursor-pointer">
//             <input
//               type="file"
//               className="hidden"
//               onChange={(e) => setResume(e.target.files?.[0] || null)}
//             />
//             {resume ? resume.name : "📝 Upload Resume"}
//           </label>
//         </div>

//         {/* SOCIALS */}
//         <div className="bg-white rounded-xl border shadow-sm p-6 space-y-4">
//           <div className="flex justify-between items-center">
//             <h3 className="font-semibold text-lg text-gray-700">Socials</h3>

//             <EditSection
//               title="Social Links"
//               fields={[
//                 { key: "linkedin", label: "LinkedIn", value: linkedin },
//                 { key: "github", label: "GitHub", value: github },
//               ]}
//               onSave={(updated) => {
//                 setLinkedin(updated.linkedin);
//                 setGithub(updated.github);
//               }}
//             />
//           </div>

//           <p>LinkedIn: {linkedin}</p>
//           <p>GitHub: {github}</p>
//         </div>

//       </div>
//     </div>
//   );
// }