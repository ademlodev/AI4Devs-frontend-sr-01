import React, { useState, useEffect } from 'react';
import { Container, Row, Button } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'react-bootstrap-icons';
import {
  InterviewProcess as InterviewProcessType,
  CandidatesByPhase,
  InterviewPhase,
  InterviewStep,
} from '../types/interview.types';
import PhaseColumn from './PhaseColumn';
import { InterviewService } from '../services/interviewService';
import '../styles/InterviewProcess.css';

const InterviewProcess: React.FC = () => {
  const { positionId } = useParams<{ positionId: string }>();
  const navigate = useNavigate();
  const [processData, setProcessData] = useState<InterviewProcessType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Función para convertir InterviewStep a InterviewPhase
  const convertToInterviewPhases = (steps: InterviewStep[]): InterviewPhase[] => {
    return steps.map((step) => ({
      id: step.id.toString(),
      name: step.name,
      order: step.orderIndex,
      description: undefined,
    }));
  };

  // Cargar datos reales de la API
  useEffect(() => {
    const loadInterviewFlow = async () => {
      if (!positionId) {
        setError('ID de posición no válido');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Obtener datos del flujo de entrevistas y candidatos en paralelo
        const [interviewFlowData, candidatesData] = await Promise.all([
          InterviewService.getInterviewFlow(positionId),
          InterviewService.getCandidatesByPosition(positionId),
        ]);

        // Convertir los datos de la API al formato esperado por el componente
        const phases = convertToInterviewPhases(interviewFlowData.interviewFlow.interviewSteps);

        // Mock position data (esto se puede mejorar cuando tengamos el endpoint de posiciones)
        const mockPosition = {
          id: positionId,
          title: interviewFlowData.positionName,
          manager: 'TBD', // Por definir cuando tengamos más datos
          deadline: 'TBD', // Por definir cuando tengamos más datos
          status: 'Abierto' as const,
        };

        setProcessData({
          position: mockPosition,
          phases: phases,
          candidates: candidatesData,
        });
      } catch (err) {
        console.error('Error loading interview flow:', err);
        setError(err instanceof Error ? err.message : 'Error desconocido al cargar los datos');
      } finally {
        setLoading(false);
      }
    };

    loadInterviewFlow();
  }, [positionId]);

  const handleGoBack = () => {
    navigate('/positions');
  };

  const groupCandidatesByPhase = (): CandidatesByPhase => {
    if (!processData) return {};

    const grouped: CandidatesByPhase = {};

    // Inicializar todas las fases usando el ID como clave
    processData.phases.forEach((phase) => {
      grouped[phase.id] = [];
    });

    // Agrupar candidatos por fase, mapeando el nombre del paso al ID de la fase
    processData.candidates.forEach((candidate) => {
      // Buscar la fase que coincida con el nombre del paso actual del candidato
      const matchingPhase = processData.phases.find((phase) => phase.name === candidate.currentInterviewStep);

      if (matchingPhase && grouped[matchingPhase.id]) {
        grouped[matchingPhase.id].push(candidate);
      }
    });

    return grouped;
  };

  if (loading) {
    return (
      <Container className="mt-5">
        <div className="loading-container">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-5">
        <div className="alert alert-danger">
          <h5>Error al cargar los datos</h5>
          <p>{error}</p>
          <Button variant="outline-secondary" onClick={handleGoBack}>
            <ArrowLeft size={16} className="me-2" />
            Volver a Posiciones
          </Button>
        </div>
      </Container>
    );
  }

  if (!processData) {
    return (
      <Container className="mt-5">
        <div className="alert alert-danger">Error al cargar los datos del proceso de entrevistas.</div>
      </Container>
    );
  }

  const candidatesByPhase = groupCandidatesByPhase();

  return (
    <Container className="mt-4">
      {/* Header con navegación */}
      <div className="d-flex align-items-center mb-4 interview-process-header">
        <Button variant="outline-secondary" size="sm" className="me-3 back-button" onClick={handleGoBack}>
          <ArrowLeft size={16} />
        </Button>
        <h2 className="mb-0">{processData.position.title}</h2>
      </div>

      {/* Columnas de fases */}
      <Row className="interview-process-columns">
        {processData.phases
          .sort((a, b) => a.order - b.order)
          .map((phase) => (
            <PhaseColumn key={phase.id} phase={phase} candidates={candidatesByPhase[phase.id] || []} />
          ))}
      </Row>
    </Container>
  );
};

export default InterviewProcess;
