export interface JobCategory {
    _id: string;
    name: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface CategoryError {
    response?: {
        data?: {
            message?: string;
        };
    };
    message?: string;
}
