/**
 * src/components/Dashboard.jsx
 * 
 * Central learner hub.
 * Features:
 * - Active PetDisplay with idle bobbing and layered accessories
 * - Growth stage label & XP progress bar
 * - Dynamic background theme based on equipped background item
 * - ChapterMap navigation
 */

import React, { useMemo } from 'react';
import { useProfile } from '../context/ProfileContext.jsx';
import PetDisplay from './PetDisplay.jsx';
import ChapterMap from './ChapterMap.jsx';
import { getItemById } from '../data/shopItems.js';

export default function Dashboard({ onSelectChapter, onOpenShop }) {
  const { profile } = useProfile();
  const { petType, growthStage, totalXP, equippedItems } = profile;

  // Determine active background CSS class from equipped items
  const backgroundClass = useMemo(() => {
    const bgItem = (equippedItems || []).find((id) => id.startsWith('bg-'));
    if (!bgItem) return 'bg-default';
    const item = getItemById(bgItem);
    return item?.cssClass || 'bg-default';
  }, [equippedItems]);

  // Calculate XP progress bar percentage towards next stage
  const xpProgress = useMemo(() => {
    if (totalXP < 50) {
      return { current: totalXP, max: 50, percent: (totalXP / 50) * 100, nextStage: 'Young' };
    }
    if (totalXP < 150) {
      return { current: totalXP - 50, max: 100, percent: ((totalXP - 50) / 100) * 100, nextStage: 'Grown' };
    }
    if (totalXP < 300) {
      return { current: totalXP - 150, max: 150, percent: ((totalXP - 150) / 150) * 100, nextStage: 'Companion' };
    }
    return { current: totalXP, max: totalXP, percent: 100, nextStage: 'Max Stage Reached! 👑' };
  }, [totalXP]);

  return (
    <div className="dashboard-screen">
      {/* Pet Hero Stage Card */}
      <section className={`dashboard-hero-card ${backgroundClass}`} aria-label="Pet Stage">
        <PetDisplay isDashboard={true} />

        <div className="pet-status-info">
          <div className="stage-badge">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#facc15" stroke="#d97706" strokeWidth="1.5">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
            <span>{growthStage} {petType ? petType.toUpperCase() : 'Pet'}</span>
          </div>

          <div className="xp-bar-container" title={`XP: ${totalXP}`}>
            <div
              className="xp-bar-fill"
              style={{ width: `${Math.min(100, Math.max(0, xpProgress.percent))}%` }}
            />
          </div>

          <p className="xp-text">
            {totalXP >= 300
              ? `Max Growth! (${totalXP} Total XP)`
              : `${totalXP} XP • Next stage: ${xpProgress.nextStage}`}
          </p>

          <button
            type="button"
            className="item-action-btn btn-equip toy-customize-btn"
            style={{ width: 'auto', padding: '10px 24px', marginTop: '6px' }}
            onClick={onOpenShop}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
            <span>Customize Pet</span>
          </button>
        </div>
      </section>

      {/* Chapters Roadmap */}
      <ChapterMap onSelectChapter={onSelectChapter} />
    </div>
  );
}
