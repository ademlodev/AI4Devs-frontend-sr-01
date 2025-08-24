import React from 'react';
import { Card } from 'react-bootstrap';
import { Candidate } from '../types/interview.types';

interface CandidateCardProps {
  candidate: Candidate;
}

const CandidateCard: React.FC<CandidateCardProps> = ({ candidate }) => {
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
    <Card className="mb-3 shadow-sm candidate-card">
      <Card.Body className="p-3">
        <div className="candidate-name fw-bold mb-2">
          {candidate.firstName} {candidate.lastName}
        </div>
        <div className="candidate-score">
          {renderStars(candidate.averageScore)}
        </div>
      </Card.Body>
    </Card>
  );
};

export default CandidateCard;
