export interface Job {
    _id: string;
    title: string;
    description: string;
    location: string;
    salary: number;
    category: string;
    skills: string[];
    isRemote: boolean;
    isFeatured: boolean;
    createdAt: string;
    updatedAt: string;
    status: string;
    expiry: string;
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