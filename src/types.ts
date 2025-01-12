export interface JobApplication {
  id: string;
  company: string;
  position: string;
  status: 'applied' | 'interviewing' | 'rejected' | 'accepted' | 'offer';
  dateApplied: string;
  notes: string;
  resumeFileName?: string;
  interviewDate?: string;
  offerDetails?: string;
  offerDate?: string;
}

export interface StatusOption {
  value: JobApplication['status'];
  label: string;
}