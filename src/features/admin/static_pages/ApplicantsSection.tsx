import React from "react";
import ApplicantsList from "../jobApplicant/component/ApplicationLists";


const ApplicantsSection: React.FC<{ width?: string | number; height?: string | number }> = ({
  width,
  height,
}) => {
  return <ApplicantsList width={width} height={height} />;
}
export default ApplicantsSection;
