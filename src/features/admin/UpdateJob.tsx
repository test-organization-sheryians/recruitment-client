'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { updateJob, getJobs } from '@/api/jobs';
import { useGetAllSkills } from '@/features/admin/skills/hooks/useSkillApi';
import { useGetJobCategories } from './categories/hooks/useJobCategoryApi';

interface Category {
  _id: string;
  name: string;
}

interface Skill {
  _id: string;
  name: string;
}

interface UpdateJobProps {
  jobId: string;
  onJobUpdated?: () => void;
}

export default function UpdateJobPage({ jobId, onJobUpdated }: UpdateJobProps) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const { data: categories = [], isLoading: isLoadingCategories } = useGetJobCategories();
  const { data: skillsResponse, isLoading: isLoadingSkills } = useGetAllSkills();
  const skills = skillsResponse || [];
  const [formData, setFormData] = useState({
    title: '',
    requiredExperience: '',
    category: '',
    education: '',
    description: '',
    skills: [''],
    expiry: '',
    clientId: ''
  });


  // Fetch job details using jobId from props
  useEffect(() => {
    if (jobId) fetchJobData();
  }, [jobId]);

  const fetchJobData = async () => {
    try {
      const response = await getJobs(jobId);

      if (!response.success || !response.data) {
        setError('Failed to load job data');
        setFetching(false);
        return;
      }

      const job = response.data;

      setFormData({
        title: job.title || '',
        description: job.description || '',
        education: job.education || '',
        requiredExperience: job.requiredExperience || '',
        skills: Array.isArray(job.skills) ? job.skills : [''],
        expiry: job.expiry ? new Date(job.expiry).toISOString().split('T')[0] : '',
        category: job.category || '',
        clientId: job.clientId || ''
      });

    } catch (err) {
      console.error(err);
      setError('Failed to load job data.');
    }

    setFetching(false);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSkillChange = (skillId: string) => {
    setFormData(prev => {
      const currentSkills = prev.skills.filter(skill => skill !== ''); // Remove empty strings
      const skillIndex = currentSkills.indexOf(skillId);
      
      if (skillIndex === -1) {
        // Add skill if not already selected
        return { ...prev, skills: [...currentSkills, skillId] };
      } else {
        // Remove skill if already selected
        return { 
          ...prev, 
          skills: [...currentSkills.slice(0, skillIndex), ...currentSkills.slice(skillIndex + 1)] 
        };
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Validate required fields
      if (!formData.title || !formData.description || !formData.education || 
          !formData.requiredExperience || !formData.category || !formData.expiry) {
        setError('Please fill in all required fields');
        setLoading(false);
        return;
      }

      // Clean up skills array - remove empty strings and ensure all are strings
      const cleanedSkills = formData.skills
        .filter(skill => skill && typeof skill === 'string' && skill.trim() !== '')
        .map(skill => skill.trim());

      // If no valid skills, set to empty array
      const finalSkills = cleanedSkills.length > 0 ? cleanedSkills : [];

      const formDataObj = new FormData();
      formDataObj.append('title', formData.title);
      formDataObj.append('requiredExperience', formData.requiredExperience);
      formDataObj.append('category', formData.category);
      formDataObj.append('education', formData.education);
      formDataObj.append('description', formData.description);
      formDataObj.append('expiry', new Date(formData.expiry).toISOString());
      formDataObj.append('clientId', formData.clientId);
      // Append each skill individually
      finalSkills.forEach(skill => {
        formDataObj.append('skills', skill);
      });

      const response = await updateJob(jobId, formDataObj);

      if (response.success) {
        setIsSuccess(true);
        onJobUpdated?.();
        
        setTimeout(() => {
          router.push('/admin/jobs');
          router.refresh();
        }, 1500);
      } else {
        setError(response.message || 'Failed to update job');
      }
    } catch (err) {
      console.error('Error updating job:', err);
      setError('Failed to update job. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getMinDate = () => {
    return new Date().toISOString().split('T')[0];
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin h-8 w-8 border-2 border-blue-500 border-t-transparent rounded-full"></div>
        <span className="ml-2 text-gray-600">Loading job data...</span>
      </div>
    );
  }

  return (
    <div className="w-full h-[90vh]">
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-2 border-b border-gray-100">
          <p className="text-gray-600 mt-1">
            {isSuccess ? 'Job updated successfully!' : 'Edit job details'}
          </p>
        </div>

        {isSuccess ? (
          <div className="p-6 text-center">
            <div className="text-green-500 mb-4">
              <svg className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-gray-700">The job has been updated successfully!</p>
          </div>
        ) : (
          <>
            {error && (
              <div className="bg-red-50 text-red-600 border-b border-red-200 p-2">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="p-3 space-y-6">

              {/* --- FORM FIELDS --- */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Job Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-1 border rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Description *</label>
                <textarea
                  name="description"
                  rows={5}
                  value={formData.description}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-1 border rounded-md"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Education *</label>
                  <input
                    type="text"
                    name="education"
                    value={formData.education}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-1 border rounded-md"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Required Experience *
                  </label>
                  <input
                    type="text"
                    name="requiredExperience"
                    value={formData.requiredExperience}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-1 border rounded-md"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                    Category *
                  </label>
                  {isLoadingCategories ? (
                    <div className="animate-pulse h-10 bg-gray-200 rounded-md"></div>
                  ) : (
                    <select
                      id="category"
                      name="category"
                      required
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      disabled={isLoadingCategories}
                    >
                      <option value="">Select a category</option>
                      {categories.map((category: Category) => (
                        <option key={category._id} value={category._id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  )}
                  {isLoadingCategories && (
                    <p className="mt-1 text-xs text-gray-500">Loading categories...</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Deadline *</label>
                  <input
                    type="date"
                    name="expiry"
                    min={getMinDate()}
                    value={formData.expiry}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-1 border rounded-md"
                  />
                </div>
              </div>

              {/* --- SKILLS --- */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <label htmlFor="skills-select" className="block text-gray-700 text-sm font-bold">
                    Required Skills {isLoadingSkills && '(Loading...)'}
                  </label>
                  {formData.skills.filter(skill => skill !== '').length > 0 && (
                    <span className="text-xs text-gray-500">
                      {formData.skills.filter(skill => skill !== '').length} selected
                    </span>
                  )}
                </div>
                <div className="relative">
                  <select
                    id="skills-select"
                    multiple
                    value={formData.skills}
                    onChange={(e) => {
                      const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
                      setFormData(prev => ({
                        ...prev,
                        skills: selectedOptions
                      }));
                    }}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 min-h-[100px]"
                  >
                    {skills?.map((skill: Skill) => (
                      <option 
                        key={skill._id} 
                        value={skill._id}
                        className="p-2 hover:bg-blue-50"
                      >
                        {skill.name}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    <svg className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                  {!isLoadingSkills && (!skills || skills.length === 0) && (
                    <p className="text-gray-500 text-sm mt-1">No skills available. Please add skills first.</p>
                  )}
                </div>
              </div>

              {/* --- ACTIONS --- */}
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="px-6 py-1 bg-white border rounded-md"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-1 bg-blue-600 text-white rounded-md disabled:opacity-50"
                >
                  {loading ? 'Updating...' : 'Update Job'}
                </button>
              </div>

            </form>
          </>
        )}
      </div>
    </div>
  );
}
