"use client"

import { useEffect, useState, useCallback } from "react"
import { useGetJobById, useUpdateJob, useGetCategories, useGetSkills } from "@/features/job-management/hooks/useJobApi"
import { useToast } from "@/components/ui/Toast"
import { X } from "lucide-react"
import { Job } from "@/types/Job"
import { JobFormData, APIResponse, Skill, Category, LocationForm } from "../types/job.types"

/* ================= TYPES ================= */

interface EditJobProps {
  jobId: string | null
  onClose: () => void
  onJobUpdated: () => void
} 

/* ================= COMPONENT ================= */

export default function EditJob({ jobId, onClose, onJobUpdated }: EditJobProps) {
  const toast = useToast()
  
  /* ================= STATE ================= */

  const [formData, setFormData] = useState<JobFormData>({
    title: "",
    description: "",
    education: "",
    requiredExperience: "",
    category: "",
    skills: [],
    expiry: "",
    clientId: "",
    location: {
      city: "",
      state: "",
      pincode: "",
      country: "",
    },
    employmentType: "Full-time",
  })

  const [error, setError] = useState<string | null>(null)
  const [skillSearch, setSkillSearch] = useState("")

  /* ================= QUERIES ================= */

  const { data: job, isLoading, isError } = useGetJobById(jobId || undefined)
  const { data: categories = [] } = useGetCategories()
  const { data: skills = [] } = useGetSkills()

  /* ================= MUTATIONS ================= */

  const { mutate: updateJob, isPending } = useUpdateJob()

  /* ================= EFFECTS ================= */

  // Disable background scrolling when modal opens
  useEffect(() => {
    if (jobId) {
      document.body.style.overflow = "hidden"
      return () => {
        document.body.style.overflow = "unset"
      }
    }
  }, [jobId])

  // Populate form when job data is loaded
  useEffect(() => {
    if (job) {
      setFormData({
        _id: job._id,
        title: job.title || "",
        description: job.description || "",
        education: job.education || "",
        requiredExperience: job.requiredExperience || "",
        category: typeof job.category === "string" ? job.category : job.category?._id || "",
        skills: ((job.skills as Array<Skill | string>) || []).map((s: Skill | string) => (typeof s === "string" ? s : s._id || "")),
        expiry: job.expiry || "",
        clientId: ((job as Job & { clientId?: string })?.clientId) || ((job as Job & { client?: { _id: string } })?.client?._id) || "",
        location: job.location || {
          city: "",
          state: "",
          pincode: "",
          country: "",
        },
        employmentType: ((job as Job & { employmentType?: string })?.employmentType) || "Full-time",
      })
      setError(null)
    }
  }, [job])

  /* ================= HANDLERS ================= */

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target
      if (name.startsWith("location.")) {
        const field = name.split(".")[1]
        setFormData((prev: JobFormData) => ({
          ...prev,
          location: {
            ...prev.location,
            [field]: value,
          },
        }))
      } else {
        setFormData((prev: JobFormData) => ({
          ...prev,
          [name]: value,
        }))
      }
    },
    []
  )

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      setError(null)

      try {
        // Build clean payload - exclude server-managed fields
        const payload: Record<string, unknown> = {
          title: formData.title,
          description: formData.description,
          education: formData.education,
          requiredExperience: formData.requiredExperience,
          category: formData.category,
          skills: formData.skills,
          clientId: formData.clientId,
          expiry: formData.expiry ? new Date(formData.expiry).toISOString() : "",
          location: {
            city: formData.location.city,
            state: formData.location.state,
            country: formData.location.country,
            pincode: formData.location.pincode,
          },
        }

        updateJob(
          { id: jobId!, formData: payload as unknown as Record<string, unknown> },
          {
            onSuccess: (res: APIResponse<Job>) => {
              if (res.success || res.data) {
                toast.success("Job updated successfully!")
                onJobUpdated()
                onClose()
              } else {
                const errorMsg = "Failed to update job"
                setError(errorMsg)
                toast.error(errorMsg)
              }
            },
            onError: (err: Error) => {
              const errorMsg = err?.message || "An error occurred while updating the job"
              setError(errorMsg)
              toast.error(errorMsg)
            },
          }
        )
      } catch (err: unknown) {
        const errorMsg = (err instanceof Error ? err.message : "An error occurred")
        setError(errorMsg)
        toast.error(errorMsg)
      }
    },
    [formData, jobId, updateJob, onJobUpdated, onClose, toast]
  )

  /* ================= UI STATES ================= */

  if (!jobId) return null

  /* ================= RENDER ================= */

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-40" onClick={onClose} />

      {/* Side Panel */}
      <div className="fixed inset-y-0 right-0 bg-white dark:bg-[#11131e] shadow-2xl z-50 flex flex-col border-l border-[#dbdde6] dark:border-gray-800 overflow-hidden" style={{ width: "550px" }}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-6 border-b border-[#f0f1f4] dark:border-gray-800">
          <div>
            <h2 className="text-xl font-bold text-[#111218] dark:text-white">Edit Job Details</h2>
            <p className="text-xs text-[#616889] dark:text-gray-400 mt-1 uppercase tracking-widest font-semibold">
              ID: {jobId}
            </p>
          </div>
          <button
            onClick={onClose}
            className="size-10 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-[#616889] dark:text-gray-400"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-8 py-8 no-scrollbar">
          {isLoading ? (
            <div className="text-center text-gray-500">Loading job details...</div>
          ) : isError ? (
            <div className="text-center text-red-500">Failed to load job details</div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded text-red-700 dark:text-red-300 text-sm">
                  {error}
                </div>
              )}

              {/* Job Title */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-[#111218] dark:text-gray-300">
                  Job Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg border border-[#dbdde6] dark:border-gray-700 bg-white dark:bg-gray-800/50 text-[#111218] dark:text-white focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                  placeholder="Enter job title"
                />
              </div>

              {/* Department & Employment Type */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-[#111218] dark:text-gray-300">
                    Department
                  </label>
                  <div className="relative">
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg border border-[#dbdde6] dark:border-gray-700 bg-white dark:bg-gray-800/50 text-[#111218] dark:text-white focus:ring-2 focus:ring-primary focus:border-primary transition-all appearance-none pr-10"
                    >
                      <option value="">Select Category</option>
                      {(categories as Category[]).map((cat: Category) => (
                        <option key={cat._id} value={cat._id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                    <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#616889] dark:text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-[#111218] dark:text-gray-300">
                    Employment Type
                  </label>
                  <div className="relative">
                    <select
                      name="employmentType"
                      value={formData.employmentType || "Full-time"}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg border border-[#dbdde6] dark:border-gray-700 bg-white dark:bg-gray-800/50 text-[#111218] dark:text-white focus:ring-2 focus:ring-primary focus:border-primary transition-all appearance-none pr-10"
                    >
                      <option value="Full-time">Full-time</option>
                      <option value="Part-time">Part-time</option>
                      <option value="Contract">Contract</option>
                      <option value="Internship">Internship</option>
                    </select>
                    <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#616889] dark:text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
                  </div>
                </div>
              </div>

              {/* Experience Level */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-[#111218] dark:text-gray-300">
                  Experience Level
                </label>
                <div className="flex gap-2">
                  {["Senior", "Mid-Level", "Junior", "Fresher"].map((level) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setFormData((prev: JobFormData) => ({ ...prev, requiredExperience: level }))}
                      className={`flex-1 py-2 px-3 text-xs font-bold rounded border transition-all ${
                        formData.requiredExperience === level
                          ? "bg-[#2b4bee] text-white border-[#2b4bee]"
                          : "border-[#dbdde6] text-[#616889] bg-white hover:bg-[#f7f8fb]"
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              {/* Education */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-[#111218] dark:text-gray-300">
                  Education
                </label>
                <input
                  type="text"
                  name="education"
                  value={formData.education}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg border border-[#dbdde6] dark:border-gray-700 bg-white dark:bg-gray-800/50 text-[#111218] dark:text-white focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                  placeholder="e.g., Bachelor's in Computer Science"
                />
              </div>

              {/* Job Description */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-[#111218] dark:text-gray-300">
                  Job Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={8}
                  className="w-full px-4 py-4 border border-[#dbdde6] dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800/50 text-[#111218] dark:text-white text-sm leading-relaxed resize-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                  placeholder="Enter job description..."
                />
              </div>

              {/* Required Skills */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-[#111218] dark:text-gray-300">
                  Required Skills
                </label>
                
                {/* Search Input */}
                <input
                  type="text"
                  placeholder="Search and add skills (e.g react, node)"
                  value={skillSearch || ""}
                  onChange={(e) => {
                    setSkillSearch(e.currentTarget.value.toLowerCase())
                  }}
                  className="w-full px-4 py-2.5 rounded-lg border border-[#dbdde6] dark:border-gray-700 bg-white dark:bg-gray-800/50 text-[#111218] dark:text-white placeholder:text-[#999] focus:ring-2 focus:ring-primary focus:border-primary transition-all text-sm"
                />

                {/* Quick Add Buttons - Filtered based on search */}
                {Array.isArray(skills) && skills.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {skills
                      .filter((skill: Skill) => {
                        if (!skillSearch) return !formData.skills.includes(skill._id)
                        return skill.name.toLowerCase().startsWith(skillSearch) && !formData.skills.includes(skill._id)
                      })
                      .map((skill: Skill) => {
                        return (
                          <button
                            key={skill._id}
                            type="button"
                            onClick={() => {
                              setFormData((prev: JobFormData) => ({
                                ...prev,
                                skills: [...prev.skills, skill._id],
                              }))
                              setSkillSearch("")
                            }}
                            className="px-2.5 py-1 text-xs font-medium rounded-full border border-[#dbdde6] dark:border-gray-600 hover:border-primary dark:hover:border-primary bg-white dark:bg-gray-800/50 text-[#616889] dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-all"
                          >
                            + {skill.name}
                          </button>
                        )
                      })}
                  </div>
                )}

                {/* Selected Skills */}
                {formData.skills && formData.skills.length > 0 && (
                  <div className="mt-2">
                    <p className="text-xs font-semibold text-[#616889] dark:text-gray-400 mb-2 uppercase tracking-wide">
                      SELECTED SKILLS:
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {formData.skills.map((skillId: string) => {
                        const skillName = (skills as Skill[]).find((s: Skill) => s._id === skillId)?.name || skillId
                        return (
                          <span
                            key={skillId}
                            className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-full text-xs font-medium border border-blue-200 dark:border-blue-700"
                          >
                            {skillName}
                            <button
                              type="button"
                              onClick={() => {
                              setFormData((prev: JobFormData) => ({
                                ...prev,
                                skills: prev.skills.filter((id: string) => id !== skillId),
                                }))
                              }}
                              className="hover:text-blue-900 dark:hover:text-blue-100 font-bold ml-0.5"
                            >
                              ×
                            </button>
                          </span>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Location Fields */}
              <div className="space-y-4">
                <label className="text-sm font-semibold text-[#111218] dark:text-gray-300 block">
                  Location
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="location.city"
                    value={formData.location.city}
                    onChange={handleInputChange}
                    placeholder="City"
                    className="w-full px-4 py-3 rounded-lg border border-[#dbdde6] dark:border-gray-700 bg-white dark:bg-gray-800/50 text-[#111218] dark:text-white focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                  />
                  <input
                    type="text"
                    name="location.state"
                    value={formData.location.state}
                    onChange={handleInputChange}
                    placeholder="State"
                    className="w-full px-4 py-3 rounded-lg border border-[#dbdde6] dark:border-gray-700 bg-white dark:bg-gray-800/50 text-[#111218] dark:text-white focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                  />
                  <input
                    type="text"
                    name="location.country"
                    value={formData.location.country}
                    onChange={handleInputChange}
                    placeholder="Country"
                    className="w-full px-4 py-3 rounded-lg border border-[#dbdde6] dark:border-gray-700 bg-white dark:bg-gray-800/50 text-[#111218] dark:text-white focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                  />
                  <input
                    type="text"
                    name="location.pincode"
                    value={formData.location.pincode}
                    onChange={handleInputChange}
                    placeholder="Pincode"
                    className="w-full px-4 py-3 rounded-lg border border-[#dbdde6] dark:border-gray-700 bg-white dark:bg-gray-800/50 text-[#111218] dark:text-white focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                  />
                </div>
              </div>

              {/* Expiry Date */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-[#111218] dark:text-gray-300">
                  Job Expiry Date
                </label>
                <input
                  type="date"
                  name="expiry"
                  value={formData.expiry ? formData.expiry.split("T")[0] : ""}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg border border-[#dbdde6] dark:border-gray-700 bg-white dark:bg-gray-800/50 text-[#111218] dark:text-white focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                />
              </div>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-[#f0f1f4] dark:border-gray-800 bg-white dark:bg-[#11131e] flex gap-3">
          <button
            onClick={onClose}
            disabled={isPending}
            className="flex-1 h-12 flex items-center justify-center rounded-lg border border-[#dbdde6] dark:border-gray-700 text-[#111218] dark:text-white font-bold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isPending}
            className="flex-1 h-12 flex items-center justify-center rounded-lg bg-primary text-white font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-primary/20 disabled:opacity-50"
          >
            {isPending ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </>
  )
}
