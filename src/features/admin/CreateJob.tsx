'use client'

import { useState, useEffect } from 'react';
import { createJob } from '@/api/jobs';
import { useRouter } from 'next/navigation';
 
export default function CreateJob() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [skills, setSkills] = useState([]);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    education: '',
    requiredExperience: '',
    skills: [], // Array of skill IDs
    expiry: '',
    category: '', // Category ID
    clientId: ''
  });

  // Fetch categories and skills on component mount
  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        // You'll need to create these API functions
        // const categoriesData = await getCategories();
        // const skillsData = await getSkills();
        // setCategories(categoriesData);
        // setSkills(skillsData);
        
        // For now, using mock data - replace with actual API calls
        setCategories([
          { _id: '1', name: 'Technology' },
          { _id: '2', name: 'Design' },
          { _id: '3', name: 'Marketing' },
          { _id: '4', name: 'Sales' },
        ]);
        
        setSkills([
          { _id: '1', name: 'JavaScript' },
          { _id: '2', name: 'React' },
          { _id: '3', name: 'Node.js' },
          { _id: '4', name: 'MongoDB' },
          { _id: '5', name: 'Python' },
          { _id: '6', name: 'UI/UX Design' },
        ]);
      } catch (err) {
        console.error('Error fetching dropdown data:', err);
      }
    };

    fetchDropdownData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSkillChange = (skillId) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.includes(skillId)
        ? prev.skills.filter(id => id !== skillId)
        : [...prev.skills, skillId]
    }));
  };

  const handleSubmit = async (e) => {
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

      // Prepare data for API
      const jobData = {
        ...formData,
        expiry: new Date(formData.expiry).toISOString(),
        // createdBy and clientId might be set automatically on the backend
        // or you might need to get them from user session
      };

      const response = await createJob(jobData);
      
      if (response.success) {
        router.push('/jobs');
        router.refresh();
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
          <p className="text-gray-600 mt-1">Fill in the details to create a new job listing</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 border-b border-red-200">
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
      </div>
    </div>
  );
}