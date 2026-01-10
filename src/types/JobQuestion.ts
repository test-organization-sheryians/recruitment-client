export interface JobQuestion {
  _id?: string;
  title: string;
  inputType: string;
  options: string[];
  isRequired: boolean;
  jobId?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
}
