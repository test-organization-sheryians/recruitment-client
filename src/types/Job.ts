export interface Job {
    id: string;
    title: string;
    location: string;
    salary: number;
    isRemote: boolean;
    isFeatured: boolean;
    createdAt: string;
    updatedAt: string;
    _id: string;
    requiredExperience?: string;
    category?: Category | string;
    education?: string;
    description?: string;
    skills?: (Skill | string)[];
    department?: string;
    expiry?: string;
    applied?: boolean
}   
// Category can be an object or string
interface Category {
  _id: string;
  name: string;
}

// Skill can be an object or string
interface Skill {
  _id?: string;
  name: string;
}

export interface JobFormValues {
    title: string;
    description: string;
    location: string;
    salary: number;
    category: string;
    skills: string[];
    isRemote: boolean;
    isFeatured: boolean;
}