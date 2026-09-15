/**
 * src/components/PetSelect.jsx
 * 
 * Companion adoption screen for new learners.
 * Presents 4 companion cards (Dog, Cat, Penguin, Unicorn).
 * Choosing a pet is permanent and persisted to context/localStorage.
 */

import React from 'react';
import { useProfile } from '../context/ProfileContext.jsx';
import PetCanvas3D from './PetCanvas3D.jsx';

const PET_OPTIONS = [
  {
    type: 'dog',
    name: 'Playful Pup',
    desc: 'Bouncy, loyal, and full of energy!'
  },
  {
    type: 'cat',
    name: 'Mystic Kitten',
    desc: 'Clever, curious, and loves puzzles!'
  },
  {
    type: 'penguin',
    name: 'Snowy Penguin',
    desc: 'Cheerful, cool, and super smart!'
  },
  {
    type: 'unicorn',
    name: 'Starry Unicorn',
    desc: 'Magical, colorful, and sparkles with joy!'
  }
];

export default function PetSelect({ onPetSelected }) {
  const { selectPet } = useProfile();

  const handleChoose = (petType) => {
    selectPet(petType);
    onPetSelected();
  };

  return (
    <div className="auth-container" style={{ maxWidth: '640px' }} role="main">
      <div style={{ textAlign: 'center', marginBottom: '16px' }}>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
          Choose Your Math Companion!
          <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
            <ellipse cx="12" cy="16" rx="5" ry="4" />
            <ellipse cx="6" cy="11" rx="2.5" ry="3.5" />
            <ellipse cx="18" cy="11" rx="2.5" ry="3.5" />
            <ellipse cx="9" cy="6" rx="2" ry="3" />
            <ellipse cx="15" cy="6" rx="2" ry="3" />
          </svg>
        </h1>
        <p style={{ color: 'var(--color-text-muted)', fontWeight: 600 }}>
          Your companion will grow, wear fun accessories, and level up alongside you!
        </p>
      </div>

      <div className="pets-grid" role="group" aria-label="Available pet companions">
        {PET_OPTIONS.map((pet) => (
          <button
            key={pet.type}
            type="button"
            className="pet-select-card"
            onClick={() => handleChoose(pet.type)}
            aria-label={`Adopt ${pet.name} (${pet.desc})`}
          >
            <div className="pet-preview-box">
              <PetCanvas3D
                petType={pet.type}
                growthStage="baby"
                width={130}
                height={130}
                interactive={false}
              />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: '8px 0 2px 0' }}>
              {pet.name}
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>
              {pet.desc}
            </p>
            <span
              style={{
                marginTop: 'auto',
                padding: '8px 20px',
                borderRadius: 'var(--border-radius-pill)',
                background: 'var(--color-primary-light)',
                color: 'var(--color-primary)',
                fontWeight: 800,
                fontSize: '0.9rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              Adopt Me!
              <svg width="16" height="16" viewBox="0 0 24 24" fill="#ec4899">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
