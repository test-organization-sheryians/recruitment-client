export interface ExperienceItem {
  _id?: string;
  candidateId?: string;

  company: string;
  title: string;
  location?: string;
  description?: string;

  startDate: string | Date;
  endDate?: string | Date;
  isCurrent?: boolean;
  createdAt?: string;
  updatedAt?: string;
}
