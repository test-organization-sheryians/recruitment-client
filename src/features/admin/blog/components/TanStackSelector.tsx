 "use client";

import { useState, useEffect } from "react";
import { searchSkill } from "@/api/skills/searchSkill";
import type { Skill } from "@/types/skilll";

interface TechStackSelectorProps {
  selectedIds: string[];
  // We pass names for display purposes, IDs for logic
  selectedNames: string[]; 
  onChange: (ids: string[], names: string[]) => void;
}

export default function TechStackSelector({ selectedIds, selectedNames, onChange }: TechStackSelectorProps) {
  const [input, setInput] = useState("");
  const [suggestions, setSuggestions] = useState<Skill[]>([]);
  
  // Debounce logic for optimization
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (input.trim()) {
        const results = await searchSkill(input);
        setSuggestions(results || []);
      } else {
        setSuggestions([]);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [input]);

  const addSkill = (skill: Skill) => {
    if (selectedIds.includes(skill._id)) return;
    onChange([...selectedIds, skill._id], [...selectedNames, skill.name]);
    setInput("");
    setSuggestions([]);
  };

  const removeSkill = (index: number) => {
    const newIds = [...selectedIds];
    const newNames = [...selectedNames];
    newIds.splice(index, 1);
    newNames.splice(index, 1);
    onChange(newIds, newNames);
  };

  return (
    <div>
      {selectedNames.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3 p-2 bg-blue-50 rounded-lg border border-blue-100">
          {selectedNames.map((name, i) => (
            <span 
              key={i} 
              onClick={() => removeSkill(i)} 
              className="cursor-pointer bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-medium hover:bg-blue-700 transition-colors flex items-center gap-1 group shadow-sm"
            >
              {name}
              <span className="ml-0.5 opacity-70 group-hover:opacity-100 transition-opacity">×</span>
            </span>
          ))}
        </div>
      )}
      <div className="relative">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Search technologies..."
          className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-200 transition-all"
        />
        {suggestions.length > 0 && (
          <div className="absolute z-10 w-full bg-white border border-slate-300 shadow-md mt-1 rounded-lg max-h-48 overflow-auto divide-y divide-slate-200">
            {suggestions.map((s) => (
              <div 
                key={s._id} 
                onClick={() => addSkill(s)} 
                className="p-3 hover:bg-blue-50 cursor-pointer text-sm font-medium text-slate-700 transition-colors"
              >
                {s.name}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
