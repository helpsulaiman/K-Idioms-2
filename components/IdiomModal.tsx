import React from 'react';
import { Idiom } from '../types/idiom';

interface IdiomModalProps {
  idiom: Idiom;
  onClose: () => void;
}

const IdiomModal: React.FC<IdiomModalProps> = ({ idiom, onClose }) => {
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="modal-overlay"
      onClick={handleBackdropClick}
    >
      <div className="modal-content relative">
        {/* Close button at absolute top right of entire modal */}
        <button
          onClick={onClose}
          className="absolute top-4 transition-all hover:opacity-80 shadow-md z-10"
          style={{ 
            background: 'var(--chinar-orange)',
            color: 'white',
            border: 'none',
            fontSize: '1.2rem',
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0',
            minWidth: '40px',
            maxWidth: '40px',
            borderRadius: '8px',
            right: '1rem'
          }}
        >
          ×
        </button>


        {/* Split Layout - Left and Right sections */}
        <div className="modal-split">
          {/* LEFT SIDE - Idiom Text Details */}
          <div className="modal-left">
            {/* Kashmiri Text - Prominent display */}
            <div className="text-kashmiri mb-4" style={{ fontSize: '2rem' }}>
              {idiom.idiom_kashmiri}
            </div>
                        
            {/* Transliteration */}
            <div className="text-transliteration mb-3" style={{ fontSize: '1.3rem' }}>
              {idiom.transliteration}
            </div>
                        
            {/* Translation */}
            <div className="text-translation mb-6" style={{ fontSize: '1.1rem' }}>
              <strong>Translation:</strong> {idiom.translation}
            </div>

            {/* Tags Section */}
            {idiom.tags && idiom.tags.length > 0 && (
              <div className="mt-6">
                <h4 className="text-sm font-semibold mb-3" style={{ color: 'var(--text-secondary)' }}>
                  CATEGORIES
                </h4>
                <div className="flex flex-wrap gap-2">
                  {idiom.tags.map((tag, index) => (
                    <span key={index} className="tag">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT SIDE - Audio and Meaning */}
          <div className="modal-right">
            {/* Audio Section */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
                🔊 Audio Pronunciation
              </h3>
              {idiom.audio_url ? (
                <div className="space-y-3">
                  <audio 
                    controls 
                    className="w-full"
                    style={{
                      background: 'var(--bg-card)',
                      borderRadius: '8px',
                      border: '1px solid var(--border-light)'
                    }}
                  >
                    <source src={idiom.audio_url} type="audio/mpeg" />
                    Your browser does not support the audio element.
                  </audio>
                  <p className="text-base" style={{ color: 'var(--text-muted)' }}>
                    Listen to the correct pronunciation
                  </p>
                </div>
              ) : (
                <div 
                  className="p-4 rounded-lg text-center"
                  style={{
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-light)',
                    color: 'var(--text-muted)'
                  }}
                >
                  <div className="text-3xl mb-2">🎤</div>
                  <p className="text-base">Audio not available</p>
                  <p className="text-sm mt-1">We&apos;re working on adding pronunciations</p>
                </div>
              )}
            </div>

            {/* Meaning/Moral Section */}
            <div>
              <h3 className="text-xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
                💡 Meaning & Context
              </h3>
              <div className="text-meaning" style={{ fontSize: '1.1rem', lineHeight: '1.7' }}>
                {idiom.meaning}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IdiomModal;