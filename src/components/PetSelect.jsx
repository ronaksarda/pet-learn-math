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
        <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--color-primary)' }}>
          Choose Your Math Companion! 🐾
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
                fontSize: '0.9rem'
              }}
            >
              Adopt Me! 💖
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
