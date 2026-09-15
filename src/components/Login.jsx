/**
 * src/components/Login.jsx
 * 
 * Welcome & Learner Sign-in screen.
 * Allows young learners to enter their name and select their grade/class
 * to resume their pet journey or create a brand new profile.
 * 
 * HOOKS USED:
 * - useState: Manages local form state (name, grade, error) that doesn't
 *   need to be shared with other components.
 */

import React, { useState } from 'react';
import { useProfile } from '../context/ProfileContext.jsx';

const GRADES = ['K', '1', '2', '3', '4', '5'];

export default function Login({ onLoginSuccess }) {
  const { loginProfile, setGrade } = useProfile();
  const [name, setName] = useState('');
  const [selectedGrade, setSelectedGrade] = useState(null);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      setError('Please enter your name to start playing!');
      return;
    }
    if (!selectedGrade) {
      setError('Pick your grade so we can find the right math adventures!');
      return;
    }
    setError('');
    loginProfile(trimmed);
    setGrade(selectedGrade);
    onLoginSuccess();
  };

  return (
    <div className="auth-container" role="main">
      {/* Floating math symbols background (CSS-animated) */}
      <div className="login-math-bg" aria-hidden="true">
        <span className="float-symbol fs-1">+</span>
        <span className="float-symbol fs-2">=</span>
        <span className="float-symbol fs-3">÷</span>
        <span className="float-symbol fs-4">×</span>
        <span className="float-symbol fs-5">3</span>
        <span className="float-symbol fs-6">7</span>
        <span className="float-symbol fs-7">½</span>
        <span className="float-symbol fs-8">9</span>
      </div>

      <div className="auth-card">
        {/* SVG paw + star logo replacing emoji */}
        <div className="login-logo" aria-hidden="true">
          <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
            <ellipse cx="32" cy="42" rx="14" ry="12" fill="#5e81f4" />
            <circle cx="18" cy="24" r="6.5" fill="#5e81f4" />
            <circle cx="32" cy="18" r="6.5" fill="#5e81f4" />
            <circle cx="46" cy="24" r="6.5" fill="#5e81f4" />
            <polygon points="32,28 35,36 43,37 37,42 39,50 32,46 25,50 27,42 21,37 29,36" fill="#facc15" />
          </svg>
        </div>

        <h1 className="login-title">Pet Math Academy</h1>
        <p className="login-subtitle">
          Adopt a virtual pet and level up by solving fun math challenges!
        </p>

        <form onSubmit={handleSubmit} className="login-form">
          {/* Name Input */}
          <div className="form-group">
            <label htmlFor="learner-name-input" className="form-label">
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

          {/* Grade Selector */}
          <div className="form-group">
            <label className="form-label">Pick your grade</label>
            <div className="grade-picker" role="radiogroup" aria-label="Select your grade">
              {GRADES.map((g) => (
                <button
                  key={g}
                  type="button"
                  role="radio"
                  aria-checked={selectedGrade === g}
                  className={`grade-pill ${selectedGrade === g ? 'active' : ''}`}
                  onClick={() => {
                    setSelectedGrade(g);
                    if (error) setError('');
                  }}
                >
                  {g === 'K' ? 'K' : g}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <p className="form-error">{error}</p>
          )}

          <button type="submit" className="primary-cta-btn login-cta">
            Start Learning!
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
}
