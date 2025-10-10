import React from 'react';

const items = ['Dashboard', 'Jobs', 'Shortlist', 'Interviews', 'Clients'];

export default function Sidebar({ active = 'Dashboard' }: { active?: string }) {
  return (
    <div className="h-[88vh] rounded-2xl bg-white p-4 border border-gray-200 flex flex-col">
      <div className="text-2xl font-semibold mb-6">Require.</div>
      <nav className="space-y-2 text-sm">
        {items.map((item) => (
          <button
            key={item}
            className={`w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 ${
              item === active ? 'bg-[#E9EFF7] text-[#1270B0] font-semibold' : 'text-gray-700'
            }`}
          >
            {item}
          </button>
        ))}
      </nav>
    </div>
  );
}
