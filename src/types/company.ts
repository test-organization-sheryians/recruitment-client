export interface Company {
  _id: string;
  name: string;
  description: string;
  website: string;
  industry: string;
  companySize: "1-10" | "11-50" | "51-200" | "201-500" | "501-1000" | "1000+";
  location: string;
  logo?: string;
  createdBy?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

