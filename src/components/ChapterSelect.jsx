/**
 * src/components/ChapterSelect.jsx
 * 
 * Difficulty selection modal / screen for a chosen chapter.
 * Presents Easy (1x coins), Medium (1.5x coins), and Hard (2x coins).
 */

import React from 'react';
import { useProfile } from '../context/ProfileContext.jsx';

export default function ChapterSelect({ chapter, onStartDifficulty, onClose }) {
  const { profile } = useProfile();
  const chapterProgress = profile.chapterProgress?.[chapter.key] || {};

  const tiers = [
    {
      id: 'easy',
      name: 'Easy',
      desc: 'Great warm-up to learn core concepts',
      multiplier: '1x Coins',
      completed: !!chapterProgress.easy,
      className: 'tier-easy'
    },
    {
      id: 'medium',
      name: 'Medium',
      desc: 'Build confidence with bigger numbers',
      multiplier: '1.5x Coins',
      completed: !!chapterProgress.medium,
      className: 'tier-medium'
    },
    {
      id: 'hard',
      name: 'Hard',
      desc: 'Master challenges for top rewards',
      multiplier: '2x Coins',
      completed: !!chapterProgress.hard,
      className: 'tier-hard'
    }
  ];

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="diff-title">
      <div className="modal-card">
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            {chapter.badgeSvg && <div className="modal-chapter-badge">{chapter.badgeSvg}</div>}
            <div>
              <h2 id="diff-title" className="modal-title">
                {chapter.title}
              </h2>
              <p className="chapter-grades">{chapter.grades}</p>
            </div>
          </div>
          <button
            type="button"
            className="icon-btn"
            onClick={onClose}
            aria-label="Close difficulty selector"
          >
            ✕
          </button>
        </div>

        <p style={{ marginBottom: '16px', color: 'var(--color-text-muted)', fontWeight: 600 }}>
          Pick your challenge level:
        </p>

        <div className="difficulty-options">
          {tiers.map((t) => (
            <button
              key={t.id}
              type="button"
              className={`difficulty-btn ${t.className}`}
              onClick={() => onStartDifficulty(t.id)}
            >
              <div style={{ textAlign: 'left' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>{t.name}</span>
                  {t.completed && <span title="Completed" style={{ color: 'var(--color-success)' }}>✓</span>}
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>
                  {t.desc}
                </div>
              </div>
              <span className="tier-multiplier">{t.multiplier}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
