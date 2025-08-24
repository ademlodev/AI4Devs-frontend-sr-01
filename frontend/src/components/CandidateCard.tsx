import React from 'react';
import { Card } from 'react-bootstrap';
import { Draggable } from 'react-beautiful-dnd';
import { Candidate } from '../types/interview.types';

interface CandidateCardProps {
  candidate: Candidate;
  index: number;
}

const CandidateCard: React.FC<CandidateCardProps> = ({ candidate, index }) => {
  const renderStars = (score: number) => {
    const stars = [];
    const fullStars = Math.floor(score);

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <span key={i} className="text-success me-1">
          ●
        </span>
      );
    }

    // Add empty stars for remaining
    for (let i = fullStars; i < 5; i++) {
      stars.push(
        <span key={i} className="text-muted me-1">
          ●
        </span>
      );
    }

    return stars;
  };

  return (
    <Draggable draggableId={candidate.id} index={index}>
      {(provided, snapshot) => (
        <Card
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`mb-3 shadow-sm candidate-card ${snapshot.isDragging ? 'dragging' : ''}`}
          style={{
            ...provided.draggableProps.style,
          }}
        >
          <Card.Body className="p-3">
            <div className="candidate-name fw-bold mb-2">
              {candidate.fullName || `${candidate.firstName} ${candidate.lastName}`}
            </div>
            <div className="candidate-score">{renderStars(candidate.averageScore)}</div>
          </Card.Body>
        </Card>
      )}
    </Draggable>
  );
};

export default CandidateCard;
