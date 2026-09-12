/**
 * src/components/Login.jsx
 * 
 * Welcome & Learner Sign-in screen.
 * Allows young learners to enter their name to resume their pet journey
 * or create a brand new profile.
 */

import React, { useState } from 'react';
import { useProfile } from '../context/ProfileContext.jsx';

export default function Login({ onLoginSuccess }) {
  const { loginProfile } = useProfile();
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      setError('Please enter your name to start playing!');
      return;
    }
    setError('');
    loginProfile(trimmed);
    onLoginSuccess();
  };

  return (
    <div className="auth-container" role="main">
      <div className="auth-card">
        <div style={{ fontSize: '3rem' }}>🐾✨</div>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-primary)' }}>
          Pet Math Academy
        </h1>
        <p style={{ color: 'var(--color-text-muted)', fontWeight: 600 }}>
          Adopt a virtual pet and level up by solving fun math challenges!
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label
              htmlFor="learner-name-input"
              style={{ display: 'block', textAlign: 'left', fontWeight: 700, marginBottom: '6px' }}
            >
              What is your name?
            </label>
            <input
              id="learner-name-input"
              type="text"
              className="form-input"
              placeholder="e.g. Leo, Maya, Sam"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (error) setError('');
              }}
              autoFocus
              maxLength={20}
              required
            />
          </div>

          {error && (
            <p style={{ color: 'var(--color-error)', fontWeight: 700, fontSize: '0.9rem' }}>
              {error}
            </p>
          )}

          <button type="submit" className="primary-cta-btn" style={{ width: '100%' }}>
            Start Learning! 🚀
          </button>
        </form>
      </div>
    </div>
  );
}
