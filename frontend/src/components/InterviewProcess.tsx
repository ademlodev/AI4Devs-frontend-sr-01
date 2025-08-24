import React, { useState, useEffect } from 'react';
import { Container, Row, Button } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'react-bootstrap-icons';
import { InterviewProcess as InterviewProcessType, CandidatesByPhase, InterviewPhase, Candidate } from '../types/interview.types';
import PhaseColumn from './PhaseColumn';
import '../styles/InterviewProcess.css';

const InterviewProcess: React.FC = () => {
  const { positionId } = useParams<{ positionId: string }>();
  const navigate = useNavigate();
  const [processData, setProcessData] = useState<InterviewProcessType | null>(null);
  const [loading, setLoading] = useState(true);

  // Mock data - esto será reemplazado por llamadas a API
  useEffect(() => {
    const loadMockData = () => {
      const mockPhases: InterviewPhase[] = [
        { id: '1', name: 'Llamada telefónica', order: 1 },
        { id: '2', name: 'Entrevista técnica', order: 2 },
        { id: '3', name: 'Entrevista cultural', order: 3 },
        { id: '4', name: 'Entrevista manager', order: 4 }
      ];

      const mockCandidates: Candidate[] = [
        { id: '1', firstName: 'John', lastName: 'Doe', email: 'john@example.com', averageScore: 3, currentPhaseId: '1' },
        { id: '2', firstName: 'Alice', lastName: 'Johnson', email: 'alice@example.com', averageScore: 4, currentPhaseId: '1' },
        { id: '3', firstName: 'Jane', lastName: 'Smith', email: 'jane@example.com', averageScore: 3, currentPhaseId: '2' },
        { id: '4', firstName: 'Bob', lastName: 'Brown', email: 'bob@example.com', averageScore: 2, currentPhaseId: '3' },
        { id: '5', firstName: 'Eva', lastName: 'White', email: 'eva@example.com', averageScore: 5, currentPhaseId: '4' }
      ];

      const mockPosition = {
        id: positionId || '1',
        title: 'Senior Backend Engineer Position',
        manager: 'John Doe',
        deadline: '2024-12-31',
        status: 'Abierto' as const
      };

      setProcessData({
        position: mockPosition,
        phases: mockPhases,
        candidates: mockCandidates
      });
      setLoading(false);
    };

    // Simular carga de datos
    setTimeout(loadMockData, 500);
  }, [positionId]);

  const handleGoBack = () => {
    navigate('/positions');
  };

  const groupCandidatesByPhase = (): CandidatesByPhase => {
    if (!processData) return {};
    
    const grouped: CandidatesByPhase = {};
    
    // Inicializar todas las fases
    processData.phases.forEach(phase => {
      grouped[phase.id] = [];
    });
    
    // Agrupar candidatos por fase
    processData.candidates.forEach(candidate => {
      if (grouped[candidate.currentPhaseId]) {
        grouped[candidate.currentPhaseId].push(candidate);
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

  if (!processData) {
    return (
      <Container className="mt-5">
        <div className="alert alert-danger">
          Error al cargar los datos del proceso de entrevistas.
        </div>
      </Container>
    );
  }

  const candidatesByPhase = groupCandidatesByPhase();

  return (
    <Container className="mt-4">
      {/* Header con navegación */}
      <div className="d-flex align-items-center mb-4 interview-process-header">
        <Button 
          variant="outline-secondary" 
          size="sm" 
          className="me-3 back-button"
          onClick={handleGoBack}
        >
          <ArrowLeft size={16} />
        </Button>
        <h2 className="mb-0">{processData.position.title}</h2>
      </div>

      {/* Columnas de fases */}
      <Row className="interview-process-columns">
        {processData.phases
          .sort((a, b) => a.order - b.order)
          .map((phase) => (
            <PhaseColumn
              key={phase.id}
              phase={phase}
              candidates={candidatesByPhase[phase.id] || []}
            />
          ))}
      </Row>
    </Container>
  );
};

export default InterviewProcess;
