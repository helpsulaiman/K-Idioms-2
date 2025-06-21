import React, { useState } from 'react';
import { Idiom } from '../types/idiom';
import IdiomModal from './IdiomModal';

interface IdiomCardProps {
  idiom: Idiom;
}

const IdiomCard: React.FC<IdiomCardProps> = ({ idiom }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCardClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div 
        className="idiom-card fade-in"
        onClick={handleCardClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleCardClick();
          }
        }}
        aria-label={`Open details for idiom: ${idiom.idiom_kashmiri}`}
      >
        <div className="card-content">
          <div className="text-kashmiri">
            {idiom.idiom_kashmiri}
          </div>
          <div className="text-transliteration">
            {idiom.transliteration}
          </div>
          <div className="text-translation">
            {idiom.translation}
          </div>
        </div>
        
        {idiom.tags && idiom.tags.length > 0 && (
          <div className="card-tags">
            {idiom.tags.slice(0, 3).map((tag, index) => (
              <span key={index} className="tag">
                {tag}
              </span>
            ))}
            {idiom.tags.length > 3 && (
              <span className="tag">
                +{idiom.tags.length - 3} more
              </span>
            )}
          </div>
        )}
      </div>

      {isModalOpen && (
        <IdiomModal 
          idiom={idiom} 
          onClose={handleCloseModal}
        />
      )}
    </>
  );
};

export default IdiomCard;