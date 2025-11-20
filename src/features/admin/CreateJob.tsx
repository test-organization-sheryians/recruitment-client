'use client'

import { useState, useEffect } from 'react';
import { createJob } from '@/api/jobs';
import { useRouter } from 'next/navigation';

interface Category {
  _id: string;
  name: string;
}

interface Skill {
  _id: string;
  name: string;
}

interface CreateJobProps {
  onJobCreated?: () => void;  // Make it optional with ?
}

interface FormData {
  title: string;
  description: string;
  education: string;
  requiredExperience: string;
  skills: string[]; // Array of skill IDs
  expiry: string;
  category: string; // Category ID
  clientId: string;
}

export default function CreateJob({ onJobCreated }: CreateJobProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    title: '',
    requiredExperience: '',
    category: '6915f00858c60a88896fbee5',
    education: '',
    description: '',
    skills: [''],
    expiry: '',
    clientId: '6915b90df6594de75060410b' // Pre-fill with the provided clientId
  });

  // Fetch categories and skills on component mount
  useEffect(() => {
    const fetchDropdownData = async () => {
      try {setCategories([
          { _id: '6915f00858c60a88896fbee5', name: 'Technology' }
        ]);
        
        setSkills([
          { _id: '691dd57f2f2aefeb50de1704', name: 'JavaScript' }
        ]);
      } catch (err) {
        console.error('Error fetching dropdown data:', err);
      }
    };

    fetchDropdownData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSkillChange = (skillId: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills[0] === skillId ? [''] : [skillId] // Allow only one skill to be selected at a time
    }));
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

      // Prepare data for API with exact structure
      const jobData = {
        title: formData.title,
        requiredExperience: formData.requiredExperience,
        category: formData.category,
        education: formData.education,
        description: formData.description,
        skills: formData.skills[0] ? formData.skills : [''], // Ensure skills is an array with at least one empty string
        expiry: formData.expiry ? new Date(formData.expiry).toISOString() : '',
        clientId: formData.clientId
      };

      const response = await createJob(jobData);
      
      if (response.success) {
        setIsSuccess(true);
        // Close dialog and refresh after 1.5 seconds
        setTimeout(() => {
          onJobCreated?.();
          router.push('/admin/jobs');
          router.refresh();
        }, 1500);
      } else {
        setError(response.message || 'Failed to create job');
      }
    } catch (err) {
      console.error('Error creating job:', err);
      setError('Failed to create job. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Calculate minimum date for expiry (tomorrow)
  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  return (
    <div className="w-full h-[90vh] ">
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-1 border-b border-gray-100">
          <p className="text-gray-600 mt-1">
            {isSuccess ? 'Job created successfully!' : 'Fill in the details to create a new job listing'}
          </p>
        </div>

        {isSuccess ? (
          <div className="p-6 text-center">
            <div className="text-green-500 mb-4">
              <svg className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-gray-700">The job has been created successfully!</p>
          </div>
        ) : (
          <>
            {error && (
              <div className="bg-red-50 text-red-600 border-b border-red-200 p-2">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit} className="p-2 space-y-6">
              {/* Job Title */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 ">
                  Job Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-3 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Senior Backend Developer"
                />
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 ">
                  Job Description *
                </label>
                <textarea
                  id="description"
                  name="description"
                  required
                  rows={5}
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full px-3 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Describe the job responsibilities, requirements, and what you're looking for in a candidate..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Education */}
                <div>
                  <label htmlFor="education" className="block text-sm font-medium text-gray-700  ">
                    Education Requirements *
                  </label>
                  <input
                    type="text"
                    id="education"
                    name="education"
                    required
                    value={formData.education}
                    onChange={handleChange}
                    className="w-full px-3 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., Bachelor of Computer Science"
                  />
                </div>

                {/* Required Experience */}
                <div>
                  <label htmlFor="requiredExperience" className="block text-sm font-medium text-gray-700 ">
                    Required Experience *
                  </label>
                  <input
                    type="text"
                    id="requiredExperience"
                    name="requiredExperience"
                    required
                    value={formData.requiredExperience}
                    onChange={handleChange}
                    className="w-full px-3 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., 3+ years in backend development"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Category */}
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 ">
                    Job Category *
                  </label>
                  <select
                    id="category"
                    name="category"
                    required
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-3 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select a category</option>
                    {categories.map(category => (
                      <option key={category._id} value={category._id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Expiry Date */}
                <div>
                  <label htmlFor="expiry" className="block text-sm font-medium text-gray-700 ">
                    Application Deadline *
                  </label>
                  <input
                    type="date"
                    id="expiry"
                    name="expiry"
                    required
                    value={formData.expiry}
                    onChange={handleChange}
                    min={getMinDate()}
                    className="w-full px-3 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Skills */}
              <div>
                <label className="block text-sm font-medium text-gray-700 ">
                  Required Skills
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {skills.map(skill => (
                    <label key={skill._id} className="flex items-center space-x-2 p-1 border border-gray-200 rounded-md hover:bg-gray-50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.skills.includes(skill._id)}
                        onChange={() => handleSkillChange(skill._id)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{skill.name}</span>
                    </label>
                  ))}
                </div>
                {formData.skills.length > 0 && (
                  <p className="text-sm text-gray-500 mt-2">
                    Selected skills: {formData.skills.length}
                  </p>
                )}
              </div>

              {/* Form Actions */}
              <div className="flex justify-end space-x-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="px-6 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-1 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="flex items-center">
                      <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                      Creating Job...
                    </div>
                  ) : (
                    'Create Job Role'
                  )}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}