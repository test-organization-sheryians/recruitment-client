export interface CompanyData{
  name: string;
  website?: string;
  sector: string;
  location?: string;
  description?: string;
};

export interface RegisterFormProps{
  initialData?: CompanyData;
  isEdit?: boolean;
  clientId?: string;
};
