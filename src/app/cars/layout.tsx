import React from "react";

export default function CarsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Car Management</h1>
      {children}
    </div>
  );
}