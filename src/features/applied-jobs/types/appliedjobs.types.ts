export interface AppliedJob {
  _id: string;              
  jobId: string;            
  jobTitle: string;

  location?: {
    city: string;
    state: string;
    country: string;
    pincode: string;
  };

  status:
    | "applied"
    | "forwarded"
    | "shortlisted"
    | "interview"
    | "rejected"
    | "hired"
    | string;

  createdAt: string;

  // 🔽 OPTIONAL (JobDetails me use honge)
  category?: string;
  experience?: string;
  education?: string;
  expiry?: string;
  description?: string;
  skills?: string[];
}
