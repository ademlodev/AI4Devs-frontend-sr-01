import React from 'react';
import { Col } from 'react-bootstrap';
import { Droppable } from 'react-beautiful-dnd';
import { InterviewPhase, Candidate } from '../types/interview.types';
import CandidateCard from './CandidateCard';

interface PhaseColumnProps {
  phase: InterviewPhase;
  candidates: Candidate[];
}

const PhaseColumn: React.FC<PhaseColumnProps> = ({ phase, candidates }) => {
  return (
    <Col xs={12} md={3} className="mb-4 mb-md-0">
      <div className="phase-column h-100">
        <div className="phase-header text-center p-3 mb-3 bg-light rounded">
          <h5 className="mb-0 fw-bold">{phase.name}</h5>
        </div>
        <Droppable droppableId={phase.id}>
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={`phase-candidates ${snapshot.isDraggingOver ? 'drag-over' : ''}`}
            >
              {candidates.length > 0 ? (
                candidates.map((candidate, index) => (
                  <CandidateCard key={candidate.id} candidate={candidate} index={index} />
                ))
              ) : (
                <div className="text-center no-candidates p-3">
                  <small>No hay candidatos en esta fase</small>
                </div>
              )}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </div>
    </Col>
  );
};

export default PhaseColumn;
