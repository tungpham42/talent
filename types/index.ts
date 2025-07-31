export type JobStatus = "Open" | "Closed";
export type CandidateStage =
  | "Applied"
  | "Screened"
  | "Interviewed"
  | "Offered"
  | "Hired";
export type UserRole = "admin" | "staff";

export interface Job {
  id: string;
  title: string;
  department: string;
  status: JobStatus;
  description?: string;
  requiredSkills: string[];
  createdAt?: Date;
}

export interface Candidate {
  id: string;
  name: string;
  email: string;
  appliedJobId: string; // reference to Job document
  resumeUrl?: string;
  stage: CandidateStage;
  source?: string; // e.g., "LinkedIn", "Referral"
  skills?: string[];
  createdAt?: Date;
}

export interface Interview {
  id: string;
  candidateId: string; // reference to Candidate document
  jobId: string; // reference to Job document
  date: Date;
  scheduledAt?: Date; // ISO date string
  createdAt?: Date;
  notes?: string;
  type?: string;
  score?: number; // 1–5 scale
}

export interface User {
  uid: string;
  name: string;
  email: string;
  role: UserRole;
  department?: string;
}
