export interface Group {
  _id: string;
  groupName: string;
  users?: User[];
  createdAt?: string;
  updatedAt?: string;
}

export interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  role?: string;
}
