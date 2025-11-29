export interface Experience {
    _id: string;
    title: string;
    company: string;
    location: string;
    startDate: string;
    endDate: string;
    description: string;
    createdAt?: string;
    updatedAt?: string;
    isCurrent: boolean;
}