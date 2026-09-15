/**
 * src/components/CompletionSummary.jsx
 * 
 * Victory screen presented after finishing 5 questions in a chapter.
 * Shows coins earned, XP gained, completion bonus, performance stars,
 * and whether the pet evolved to a new growth stage.
 * Includes CSS confetti animation and "Play Again" option.
 */

import React, { useEffect, useState } from 'react';
import PetDisplay from './PetDisplay.jsx';
import { useProfile } from '../context/ProfileContext.jsx';

export default function CompletionSummary({
  results,
  onReturnToDashboard,
  onPlayAgain,
  previousGrowthStage
}) {
  const { profile } = useProfile();
  const [animTrigger, setAnimTrigger] = useState(null);
  const [showConfetti, setShowConfetti] = useState(true);

  const stageEvolved = previousGrowthStage && previousGrowthStage !== profile.growthStage;

  useEffect(() => {
    if (stageEvolved) {
      setAnimTrigger('spin-full');
    } else {
      setAnimTrigger('celebrate');
    }
    // Hide confetti after 4 seconds to reduce visual noise
    const timer = setTimeout(() => setShowConfetti(false), 4000);
    return () => clearTimeout(timer);
  }, [stageEvolved]);

  // Calculate performance stars (0-3) based on first-try accuracy
  const performanceStars = results.perfectScore ? 3 : results.bonusCoins > 0 ? 2 : 1;

  return (
    <div className="summary-container" role="main">
      {/* CSS Confetti */}
      {showConfetti && (
        <div className="confetti-container" aria-hidden="true">
          {Array.from({ length: 30 }).map((_, i) => (
            <div
              key={i}
              className="confetti-piece"
              style={{
                '--x': `${Math.random() * 100}vw`,
                '--delay': `${Math.random() * 2}s`,
                '--color': ['#facc15', '#3b82f6', '#ef4444', '#10b981', '#8b5cf6', '#ec4899'][i % 6],
                '--rotation': `${Math.random() * 360}deg`,
                '--duration': `${2 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>
      )}

      <div className="summary-card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
            <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
            <path d="M4 22h16" />
            <path d="M10 14.66V17c0 .55-.45 1-1 1H7v2h10v-2h-2c-.55 0-1-.45-1-1v-2.34" />
            <path d="M6 4h12v5c0 3.31-2.69 6-6 6s-6-2.69-6-6V4z" />
          </svg>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-primary)' }}>
            Chapter Complete!
          </h2>
        </div>
        <p style={{ color: 'var(--color-text-muted)', fontWeight: 600, marginTop: '4px' }}>
          {results.chapterTitle} &bull; <span style={{ textTransform: 'capitalize' }}>{results.difficulty}</span>
        </p>

        {/* Performance Stars */}
        <div className="performance-stars" aria-label={`${performanceStars} out of 3 stars`}>
          {[0, 1, 2].map((i) => (
            <svg
              key={i}
              width="36"
              height="36"
              viewBox="0 0 24 24"
              fill={i < performanceStars ? '#facc15' : '#e2e8f0'}
              stroke={i < performanceStars ? '#d97706' : '#cbd5e1'}
              strokeWidth="1.5"
              className={i < performanceStars ? 'star-earned-anim' : ''}
              style={{ animationDelay: `${i * 0.2}s` }}
            >
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          ))}
        </div>

        {/* Pet in celebratory mode */}
        <div style={{ margin: '12px 0' }}>
          <PetDisplay
            animationTrigger={animTrigger}
            onAnimationEnd={() => setAnimTrigger(null)}
            isDashboard={false}
          />
        </div>

        {stageEvolved && (
          <div
            className="feedback-banner correct"
            style={{ width: '100%', animation: 'banner-pop 0.4s ease' }}
          >
            <span>Awesome! Your pet grew into a <strong>{profile.growthStage.toUpperCase()}</strong>!</span>
          </div>
        )}

        {/* Reward Stats Breakdown */}
        <div className="rewards-grid">
          <div className="reward-stat-card">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" fill="#facc15" stroke="#d97706" strokeWidth="2" />
              <circle cx="12" cy="12" r="7" stroke="#eab308" strokeWidth="1.5" strokeDasharray="3 2" />
              <polygon points="12,7 13.5,10.5 17,11 14.5,13.5 15.5,17 12,15 8.5,17 9.5,13.5 7,11 10.5,10.5" fill="#ca8a04" />
            </svg>
            <span className="reward-number" style={{ color: '#b7791f' }}>
              +{results.coinsEarned}
            </span>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-text-muted)' }}>
              Coins Earned
            </span>
          </div>

          <div className="reward-stat-card">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="#38bdf8" stroke="#0284c7" strokeWidth="1.5">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
            <span className="reward-number" style={{ color: 'var(--color-primary)' }}>
              +{results.xpEarned}
            </span>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-text-muted)' }}>
              XP Gained
            </span>
          </div>
        </div>

        <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', fontStyle: 'italic' }}>
          {results.perfectScore
            ? `Perfect score! +${results.bonusCoins} bonus coins and +${results.bonusXP} bonus XP!`
            : `Includes +${results.bonusCoins} bonus completion coins!`}
        </p>

        {/* Action Buttons */}
        <div className="summary-actions">
          <button
            type="button"
            className="primary-cta-btn"
            onClick={onReturnToDashboard}
          >
            Return to Academy
          </button>
          {onPlayAgain && (
            <button
              type="button"
              className="secondary-cta-btn"
              onClick={onPlayAgain}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="1 4 1 10 7 10" />
                <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
              </svg>
              Play Again
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
