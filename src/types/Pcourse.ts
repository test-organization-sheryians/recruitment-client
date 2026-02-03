export interface ICourse {
    _id: string;
    title: string;
    price: number;
    instructor: string;
    description: string;
}

export interface CourseResponse {
    success: boolean;
    data: ICourse[];
}