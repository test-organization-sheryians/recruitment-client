


export type CertificateType =
  | "Completion"
  | "Internship"
  | "Offer"
  | "Other";

export interface Certificate {
  _id?: string;   // backend dega
  name: string;
  type: CertificateType;
  // fileUrl: string;
  fileUrl: string;   // frontend se aayega, backend me handle hoke fileUrl ban jayega
  createdAt?: string;
  updatedAt?: string;
}

export interface CertificateField {
  title: string;
  type: string;
  placeholder: string;
  certificateId?: string; // ye baad me add hoga
}
