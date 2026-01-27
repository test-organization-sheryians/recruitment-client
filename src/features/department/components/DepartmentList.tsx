"use client";

import { useState } from "react";
import DepartmentForm from "./DepartmentForm";
import DepartmentCard from "./DepartmentCard";
import EmptyState from "./EmptyState";
import EditDepartmentModal from "./EditDepartmentModel";
import { useDepartments } from "../Hooks/useDepartment";
import { Department } from "../Types/department.types";

export default function DepartmentList() {
  const {
    departments,
    isLoading,
    createDepartment,
    updateDepartment,
    deleteDepartment,
  } = useDepartments();

  const [selectedDept, setSelectedDept] = useState<Department | null>(null);

  // Open modal
  const handleEdit = (dep: Department) => {
    setSelectedDept(dep);
  };

 

  // Save updated data
  const handleUpdate = async ({
    id,
    name,
    description,
  }: {
    id: string;
    name: string;
    description?: string;
  }) => {
    await updateDepartment({
      id,
      payload: { name, description },
    });
  };
  

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="space-y-6 p-4">
      <DepartmentForm onSubmit={createDepartment} />

      {departments.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid gap-4">
          {departments.map((dep) => (
            <DepartmentCard
              key={dep._id}
              department={dep}
              onDelete={deleteDepartment}
              onEdit={handleEdit}
            />
          ))}
        </div>
      )}

      {/*  Edit Modal */}
      {selectedDept && (
        <EditDepartmentModal
          department={selectedDept}
          isOpen={true}
          onClose={() => setSelectedDept(null)}
          onSave={handleUpdate}
        />
      )}
    </div>
  );
}