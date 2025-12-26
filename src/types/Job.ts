export interface Job {
<<<<<<< HEAD
=======
    id: string;
    title: string;
    location: {
      city: string;
      state: string;
      pincode: string;
      country: string;
    };
    salary: number;
    isRemote: boolean;
    isFeatured: boolean;
    createdAt: string;
    updatedAt: string;
>>>>>>> 052aaa9e5bdfd3cb1cbe6dac7d9c6ea8ec25d984
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
export interface Skill {
  _id?: string;
  name: string;
}


export interface SavedJob {
  _id: string;
  jobId: Job;
}

export interface JobFormValues {
    title: string;
    description: string;
    location: {
      city: string;
      state: string;
      pincode: string;
      country: string;
    };
    salary: number;
    category: string;
    skills: string[];
    isRemote: boolean;
    isFeatured: boolean;
}
<<<<<<< HEAD
=======


// export interface PaginatedJobsResponse {
//    "success": true,
//   "data": {
//     "data": [Job],
//     "pagination": {
//       "totalRecords": number,
//       "totalPages": number,
//       "currentPage": number,
//       "limit": number
//     }
//   }
// }

export type SearchQuery = {
  q: string;
  location: string;
};
>>>>>>> 052aaa9e5bdfd3cb1cbe6dac7d9c6ea8ec25d984
