import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAllSkills } from "../../api/skills/getAllSkills";

export default function JobCard({ job }) {
  const [skillNames, setSkillNames] = useState([]);
  const [showAllSkills, setShowAllSkills] = useState(false);
  const router = useRouter();

  const handleCardClick = () => {
    if (!job?._id) return;
    router.push(`/candidate-home/job-details?id=${job._id}`);
  };

  // Convert category safely
  const categoryText = (() => {
    if (!job?.category) return "";
    if (typeof job.category === "string") return job.category;
    if (job.category.name) return job.category.name;
    return "";
  })();

  // Load skills & map IDs → names
  useEffect(() => {
    const loadSkills = async () => {
      try {
        const allSkills = await getAllSkills();

        // Map skill ID to name
        const map = {};
        allSkills.forEach((s) => {
          map[s._id] = s.name;
        });

        // Convert job skills to readable names
        const names = (job.skills || []).map((skill) => {
          if (typeof skill === "object" && skill.name) {
            return skill.name;
          }
          return map[skill] || "Unknown";
        });

        setSkillNames(names);
      } catch (err) {
        console.error(err);
      }
    };

    loadSkills();
  }, [job.skills]);

  return (
    <div
      onClick={handleCardClick}
      className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-all cursor-pointer relative"
    >
      <div className="flex justify-between items-start gap-4 relative">
        {/* LEFT CONTENT */}
        <div className="flex-1">
          {/* TAGS */}
          <div className="flex flex-wrap items-center gap-2 mb-2 text-[10px] sm:text-xs font-medium">
            {categoryText && (
              <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-md">
                {categoryText}
              </span>
            )}

            {job.requiredExperience && (
              <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-md">
                {job.requiredExperience}
              </span>
            )}

            {job.education && (
              <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-md">
                {job.education}
              </span>
            )}

            {job.expiry && (
              <span className="text-gray-600">
                {new Date(job.expiry).toLocaleDateString()}
              </span>
            )}
          </div>

          {/* JOB TITLE */}
          <h2 className="text-base sm:text-lg font-bold mb-1">{job.title}</h2>

          {/* SALARY + DEPARTMENT */}
          <div className="mb-2">
            {job.salary && (
              <p className="text-gray-700 text-sm font-semibold">
                {job.salary}
              </p>
            )}

            {job.department && (
              <p className="text-gray-600 text-sm">{job.department}</p>
            )}
          </div>

          {/* SKILLS */}
          {skillNames.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {/* Show first 4 or full list */}
              {(showAllSkills ? skillNames : skillNames.slice(0, 4)).map(
                (skill, i) => (
                  <span
                    key={i}
                    className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-[10px] sm:text-xs"
                  >
                    {skill}
                  </span>
                )
              )}

              {/* "+X more" */}
              {skillNames.length > 4 && !showAllSkills && (
                <button
                  onClick={() => setShowAllSkills(true)}
                  className="text-xs text-blue-700 font-medium"
                >
                  +{skillNames.length - 4} more
                </button>
              )}

              {/* Show less */}
              {showAllSkills && (
                <button
                  onClick={() => setShowAllSkills(false)}
                  className="text-xs text-blue-700 font-medium"
                >
                  Show less
                </button>
              )}
            </div>
          )}
        </div>

        {/* RIGHT BUTTONS */}
        <div className="flex flex-col gap-3 items-end shrink-0">
          <button className="px-5 py-2 bg-blue-700 text-white rounded-md hover:bg-blue-800 text-sm font-semibold shadow-sm">
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}
