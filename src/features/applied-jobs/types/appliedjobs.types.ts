export interface AppliedJob {
  _id: string;
  jobTitle: string;
  location: { city: string; country: string; pincode: 
string; state: string;
  };
  status: "forwarded" | "shortlisted" | "interview" | "rejected" | string;
  createdAt: string;
}
