import React, { useState, useEffect } from 'react';
import { Container, Row, Button } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'react-bootstrap-icons';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
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

  const handleDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;

    // Si no hay destino, no hacer nada
    if (!destination) {
      return;
    }

    // Si se movió a la misma posición, no hacer nada
    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return;
    }

    if (!processData) return;

    // Encontrar el candidato que se está moviendo
    const candidate = processData.candidates.find((c) => c.id === draggableId);
    if (!candidate) return;

    // Encontrar la fase de destino
    const destinationPhase = processData.phases.find((p) => p.id === destination.droppableId);
    if (!destinationPhase) return;

    try {
      // Actualización optimista: actualizar el estado local primero
      const updatedCandidates = processData.candidates.map((c) =>
        c.id === draggableId
          ? { ...c, currentInterviewStep: destinationPhase.name, currentPhaseId: destinationPhase.name }
          : c
      );

      setProcessData({
        ...processData,
        candidates: updatedCandidates,
      });

      // Llamar al API para actualizar en el backend
      await InterviewService.updateCandidateStage(candidate.id, {
        applicationId: candidate.applicationId.toString(),
        currentInterviewStep: destinationPhase.id,
      });

      console.log(`Candidato ${candidate.fullName} movido a ${destinationPhase.name}`);
    } catch (error) {
      console.error('Error updating candidate stage:', error);

      // Revertir el cambio optimista en caso de error
      const revertedCandidates = processData.candidates.map((c) =>
        c.id === draggableId
          ? candidate // Restaurar el candidato original
          : c
      );

      setProcessData({
        ...processData,
        candidates: revertedCandidates,
      });

      // Mostrar error al usuario (opcional: añadir toast notification)
      setError('Error al mover el candidato. Por favor, intenta de nuevo.');
      setTimeout(() => setError(null), 3000);
    }
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

      {/* Drag & Drop Context */}
      <DragDropContext onDragEnd={handleDragEnd}>
        {/* Columnas de fases */}
        <Row className="interview-process-columns">
          {processData.phases
            .sort((a, b) => a.order - b.order)
            .map((phase) => (
              <PhaseColumn key={phase.id} phase={phase} candidates={candidatesByPhase[phase.id] || []} />
            ))}
        </Row>
      </DragDropContext>
    </Container>
  );
};

export default InterviewProcess;
