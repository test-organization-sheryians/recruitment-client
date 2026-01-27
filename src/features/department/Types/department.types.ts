export interface Department {
  _id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateDepartmentPayload {
  name: string;
  description?: string;
}