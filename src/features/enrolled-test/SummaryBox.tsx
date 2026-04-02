import React from "react";

interface Props {
  label: string;
  value: string | number;
}

export const SummaryBox: React.FC<Props> = ({ label, value }) => (
  <div className="bg-white rounded-xl p-3 border">
    <p className="text-xs text-slate-400 uppercase font-bold">{label}</p>
    <p className="text-lg font-extrabold">{value}</p>
  </div>
);
