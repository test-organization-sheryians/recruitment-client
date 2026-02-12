export interface Certificate {
  _id: string;            
  name: string;           
  type: "Completion" | "Internship" | "Offer" | "Other";
  file: string;           
  createdAt: string;     
  updatedAt?: string;     
  
  // Optional Fields 
  issuedBy?: string;      
  description?: string;   
}