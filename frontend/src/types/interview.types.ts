// Tipos para el endpoint /positions/:id/interviewFlow
export interface InterviewStep {
  id: number;
  interviewFlowId: number;
  interviewTypeId: number;
  name: string;
  orderIndex: number;
}

export interface InterviewFlow {
  id: number;
  description: string;
  interviewSteps: InterviewStep[];
}

// Estructura real de la respuesta del API
export interface InterviewFlowApiResponse {
  interviewFlow: {
    positionName: string;
    interviewFlow: InterviewFlow;
  };
}

// Estructura interna para facilitar el uso
export interface InterviewFlowResponse {
  positionName: string;
  interviewFlow: InterviewFlow;
}

// Tipos para candidatos del endpoint real
export interface CandidateApiResponse {
  fullName: string;
  currentInterviewStep: string;
  averageScore: number;
  id: number;
  applicationId: number;
}

// Tipo adaptado para uso interno (mantiene compatibilidad con componentes)
export interface Candidate {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  averageScore: number;
  currentPhaseId: string;
  fullName: string;
  currentInterviewStep: string;
}

export interface Position {
  id: string;
  title: string;
  manager: string;
  deadline: string;
  status: 'Abierto' | 'Contratado' | 'Cerrado' | 'Borrador';
}

// Tipos adaptados para la vista
export interface InterviewPhase {
  id: string;
  name: string;
  order: number;
  description?: string;
}

export interface InterviewProcess {
  position: Position;
  phases: InterviewPhase[];
  candidates: Candidate[];
}

export interface CandidatesByPhase {
  [phaseId: string]: Candidate[];
}
