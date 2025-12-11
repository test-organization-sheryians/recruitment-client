export interface Job {
    id: string;
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
