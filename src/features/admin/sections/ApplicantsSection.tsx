import React from "react";
import ApplicantsList from "../components/ApplicantsList";

const ROWS = [
  {
    name: "Debasish Nayak",
    email: "dev@gmail.com",
    role: "Frontend Dev.",
    date: "Oct 15, 2025",
    experience: "0-1 years",
    status: "Interviewing",
  },
  {
    name: "Daneshwar Verma",
    email: "danish@gmail.com",
    role: "Backend Dev.",
    date: "Oct 15, 2025",
    experience: "0-1 years",
    status: "Shortlisted",
  },
  {
    name: "Sarthak Choudhary",
    email: "dev@gmail.com",
    role: "Frontend Dev.",
    date: "Oct 15, 2025",
    experience: "0-1 years",
    status: "Interviewing",
  },
  {
    name: "Arsh Rai",
    email: "arsh@gmail.com",
    role: "Full Stack Dev.",
    date: "Oct 15, 2025",
    experience: "0-1 years",
    status: "Shortlisted",
  },
  {
    name: "Pranita",
    email: "pranita@gmail.com",
    role: "Frontend Dev.",
    date: "Oct 15, 2025",
    experience: "0-1 years",
    status: "Scheduled",
  },
  {
    name: "Dipak Wagh",
    email: "dipak@gmail.com",
    role: "Frontend Dev.",
    date: "Oct 15, 2025",
    experience: "0-1 years",
    status: "Interviewing",
  },
];

const ApplicantsSection: React.FC<{ width?: string | number; height?: string | number }> = ({
  width,
  height,
}) => {
  return <ApplicantsList width={width} height={height} />;
}
export default ApplicantsSection;