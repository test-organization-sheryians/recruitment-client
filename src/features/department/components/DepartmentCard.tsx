import { Department } from "../Types/department.types";

interface Props {
  department: Department;
  onDelete: (id: string) => void;
  onEdit: (dep: Department) => void;
}

export default function DepartmentCard({ department, onDelete ,onEdit }: Props) {
  return (
    <div className="border rounded-lg p-4 flex justify-between items-center">
      <div>
        <h3 className="font-semibold">{department.name}</h3>
        <p className="text-sm text-gray-500">{department.description}</p>
      </div>

      <div className="flex gap-4">
        <button
  onClick={() => onEdit(department)}
  className="text-blue-600 hover:underline"
>
  Edit
</button>

        <button
          onClick={() => onDelete(department._id)}
          className="text-red-500 hover:underline"
        >
          Delete
        </button>
      </div>
    </div>
  );
}