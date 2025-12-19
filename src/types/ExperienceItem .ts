export interface ExperienceItem {
  _id?: string;
  candidateId?: string;

  company: string;
  title: string;
  location?: string;
  description?: string;

  startDate: string | Date|null;
  endDate?: string | Date | null ;
  isCurrent?: boolean|null;
  createdAt?: string;
  updatedAt?: string;
}
