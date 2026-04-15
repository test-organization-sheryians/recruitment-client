export interface Interview {
  _id: string;
  jobTitle?: string;
  candidateName?: string;
  candidateEmail?: string;
  scheduledAt: string; // ISO Date String
  status?: string;
  meetingLink?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any; 
}