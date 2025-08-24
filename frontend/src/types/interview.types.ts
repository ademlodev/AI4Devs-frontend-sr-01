export interface InterviewPhase {
  id: string;
  name: string;
  order: number;
  description?: string;
}

export interface Candidate {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  averageScore: number;
  currentPhaseId: string;
}

export interface Position {
  id: string;
  title: string;
  manager: string;
  deadline: string;
  status: 'Abierto' | 'Contratado' | 'Cerrado' | 'Borrador';
}

export interface InterviewProcess {
  position: Position;
  phases: InterviewPhase[];
  candidates: Candidate[];
}

export interface CandidatesByPhase {
  [phaseId: string]: Candidate[];
}
