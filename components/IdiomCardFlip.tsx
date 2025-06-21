import React from 'react';
import { Idiom } from '../types/idiom';

interface IdiomCardFlipProps {
  idiom: Idiom;
  isFlipped: boolean;
  onFlip: () => void;
}

const IdiomCardFlip: React.FC<IdiomCardFlipProps> = ({ idiom, isFlipped, onFlip }) => {
  const handleCardClick = () => {
    onFlip();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleCardClick();
    }
  };

  return (
    <div 
      className="card-flip-container"
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      aria-label={`Flip card for idiom: ${idiom.idiom_kashmiri}`}
    >
      <div className={`card-flip ${isFlipped ? 'flipped' : ''}`}>
        {/* FRONT SIDE */}
        <div className="card-flip-front idiom-card">
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

        {/* BACK SIDE */}
        <div className="card-flip-back">
          <div className="flip-back-content">
            {/* Audio Section */}
            <div className="flip-audio-section">
              <h4 className="flip-section-title">🔊 AUDIO</h4>
              {idiom.audio_url ? (
                <div className="flip-audio-container">
                  <audio controls className="flip-audio-player">
                    <source src={idiom.audio_url} type="audio/mpeg" />
                  </audio>
                </div>
              ) : (
                <div className="flip-audio-placeholder">
                  <div className="flip-audio-icon">🎤</div>
                  <p className="flip-audio-text">No audio</p>
                </div>
              )}
            </div>

            {/* Meaning Section */}
            <div className="flip-meaning-section">
              <h4 className="flip-section-title">💡 MEANING</h4>
              <div className="flip-meaning-text">
                {idiom.meaning}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IdiomCardFlip;