// views/SkillsManagement.jsx
"use client";
import React, { useState } from 'react';
import SkillCard from '../components/SkillCard'; 
import AddSkillButtonWithModal from '../components/AddSkillButtonWithModal'; 

// Mock data to match the screenshot look
const initialSkills = [
  { _id: '1', name: 'React.js' },
  { _id: '2', name: 'Node.js' },
  { _id: '3', name: 'TypeScript' },
  { _id: '4', name: 'Tailwind CSS' },
  { _id: '5', name: 'MongoDB' },
  { _id: '6', name: 'Express.js' },
  { _id: '7', name: 'Monless.js' },
  { _id: '8', name: 'Redux' },
  { _id: '9', name: 'Next.js' },
  { _id: '10', name: 'Repnct.js' },
  { _id: '11', name: 'MOOGEBA' },
  { _id: '12', name: 'MonGEBIA' },
];

export default function SkillsManagement() {
  const [skills, setSkills] = useState(initialSkills);

  const handleAddSkill = ({ name }) => {
    const newSkill = { _id: String(Date.now()), name };
    setSkills((prevSkills) => [newSkill, ...prevSkills]); 
  };

  const handleDeleteSkill = ({ id }) => {
    setSkills((prevSkills) => prevSkills.filter((s) => s._id !== id));
  };

  const handleUpdateSkill = ({ id, name }) => {
    setSkills((prevSkills) =>
      prevSkills.map((s) => (s._id === id ? { ...s, name } : s))
    );
  };

  return (
    // Outer container matching the rounded white card style of the image
    <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 min-h-[500px]"> 
      
      {/* Header and Add Button Section */}
      <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
        <h2 className="text-2xl font-bold text-gray-800">Manage Skills</h2>
        <AddSkillButtonWithModal onNewSkillSubmit={handleAddSkill} />
      </div>

      {/* Skills Grid */}
      {skills.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No skills have been added yet.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {skills.map((skill) => (
            <SkillCard
              key={skill._id}
              skill={skill}
              onDelete={handleDeleteSkill}
              onUpdate={handleUpdateSkill}
            />
          ))}
        </div>
      )}
    </div>
  );
}