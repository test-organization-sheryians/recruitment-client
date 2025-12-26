import React from "react";

interface Props {
  icon: React.ReactNode;
  label: string;
  value: string | number | undefined;
}

export const DetailRow: React.FC<Props> = ({ icon, label, value }) => (
  <div className="border rounded-xl p-3 flex items-center gap-3">
    <div className="text-blue-600">{icon}</div>
    <div>
      <p className="text-xs text-slate-400 font-bold uppercase">{label}</p>
      <p className="font-bold">{value}</p>
    </div>
  </div>
);
