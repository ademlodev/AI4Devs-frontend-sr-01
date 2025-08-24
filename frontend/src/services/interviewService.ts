import { InterviewFlowResponse, InterviewFlowApiResponse, CandidateApiResponse, Candidate } from '../types/interview.types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3010';

export class InterviewService {
  /**
   * Obtiene el flujo de entrevistas para una posición específica
   * @param positionId ID de la posición
   * @returns Promise con los datos del flujo de entrevistas
   */
  static async getInterviewFlow(positionId: string): Promise<InterviewFlowResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/position/${positionId}/interviewflow`);

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const apiData: InterviewFlowApiResponse = await response.json();

      // Extraer los datos de la estructura anidada
      const data: InterviewFlowResponse = {
        positionName: apiData.interviewFlow.positionName,
        interviewFlow: apiData.interviewFlow.interviewFlow,
      };

      return data;
    } catch (error) {
      console.error('Error fetching interview flow:', error);
      throw error;
    }
  }

  /**
   * Obtiene los candidatos para una posición específica
   * @param positionId ID de la posición
   * @returns Promise con la lista de candidatos
   */
  static async getCandidatesByPosition(positionId: string): Promise<Candidate[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/position/${positionId}/candidates`);

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const apiData: CandidateApiResponse[] = await response.json();
      
      // Convertir los datos del API al formato interno
      const candidates: Candidate[] = apiData.map((candidateData) => {
        const [firstName, ...lastNameParts] = candidateData.fullName.split(' ');
        const lastName = lastNameParts.join(' ');
        
        return {
          id: candidateData.id.toString(),
          firstName: firstName || '',
          lastName: lastName || '',
          fullName: candidateData.fullName,
          averageScore: candidateData.averageScore,
          currentPhaseId: candidateData.currentInterviewStep, // Usamos el nombre del paso como ID
          currentInterviewStep: candidateData.currentInterviewStep,
        };
      });

      return candidates;
    } catch (error) {
      console.error('Error fetching candidates:', error);
      throw error;
    }
  }
}
