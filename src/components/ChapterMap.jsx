/**
 * src/components/ChapterMap.jsx
 * 
 * Curriculum roadmap displaying the 4 core K-5 math chapters.
 * Features custom SVG vector badges (no raw browser emojis),
 * tactile 3D play cards, and 3-tier star progression trackers.
 */

import React from 'react';
import { useProfile } from '../context/ProfileContext.jsx';

export const CHAPTERS_DATA = [
  {
    key: 'counting',
    title: 'Counting & Numbers',
    themeName: 'Counting Kingdom',
    themeColor: '#10b981',
    themeBg: '#ecfdf5',
    grades: 'Grades K-1',
    description: 'Object counting, before & after, skip counting, and number ordering',
    badgeSvg: (
      <svg width="56" height="56" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="8" y="28" width="22" height="24" rx="5" fill="#38bdf8" stroke="#0284c7" strokeWidth="2.5" />
        <text x="19" y="45" fontSize="16" fontWeight="900" fill="#ffffff" textAnchor="middle">1</text>
        <rect x="34" y="24" width="22" height="28" rx="5" fill="#f59e0b" stroke="#d97706" strokeWidth="2.5" />
        <text x="45" y="43" fontSize="16" fontWeight="900" fill="#ffffff" textAnchor="middle">2</text>
        <rect x="21" y="8" width="22" height="24" rx="5" fill="#f43f5e" stroke="#e11d48" strokeWidth="2.5" />
        <text x="32" y="25" fontSize="16" fontWeight="900" fill="#ffffff" textAnchor="middle">3</text>
      </svg>
    )
  },
  {
    key: 'addSub',
    title: 'Add & Subtract',
    themeName: 'Math Safari',
    themeColor: '#3b82f6',
    themeBg: '#eff6ff',
    grades: 'Grades 1-2',
    description: 'Addition & subtraction within 10, within 20, and with regrouping',
    badgeSvg: (
      <svg width="56" height="56" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="32" cy="32" r="28" fill="#3b82f6" stroke="#1d4ed8" strokeWidth="3" />
        <path d="M22 24 H32 M27 19 V29" stroke="#ffffff" strokeWidth="4.5" strokeLinecap="round" />
        <path d="M36 40 H46" stroke="#fef08a" strokeWidth="4.5" strokeLinecap="round" />
        <circle cx="41" cy="24" r="3" fill="#ffffff" />
        <circle cx="23" cy="40" r="3" fill="#ffffff" />
      </svg>
    )
  },
  {
    key: 'multDiv',
    title: 'Multiply & Divide',
    themeName: 'Space Galaxy',
    themeColor: '#8b5cf6',
    themeBg: '#f5f3ff',
    grades: 'Grade 3',
    description: 'Times tables 1-10, mental division, and mixed math within 100',
    badgeSvg: (
      <svg width="56" height="56" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M32 4 L40 22 L60 25 L45 39 L49 59 L32 49 L15 59 L19 39 L4 25 L24 22 Z" fill="#f59e0b" stroke="#d97706" strokeWidth="2.5" />
        <path d="M25 25 L39 39 M39 25 L25 39" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" />
      </svg>
    )
  },
  {
    key: 'fractions',
    title: 'Intro to Fractions',
    themeName: 'Fraction Bakery',
    themeColor: '#ec4899',
    themeBg: '#fdf2f8',
    grades: 'Grades 3-4',
    description: 'Visual shaded shapes, comparing fractions, and equivalent fractions',
    badgeSvg: (
      <svg width="56" height="56" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="32" cy="32" r="26" fill="#fed7aa" stroke="#c2410c" strokeWidth="3" />
        <path d="M32 6 A26 26 0 0 1 58 32 L32 32 Z" fill="#ef4444" stroke="#b91c1c" strokeWidth="2" />
        <path d="M32 32 L58 32 A26 26 0 0 1 32 58 Z" fill="#f97316" stroke="#c2410c" strokeWidth="2" />
        <circle cx="44" cy="20" r="3" fill="#ffffff" />
        <circle cx="42" cy="44" r="3" fill="#ffffff" />
        <circle cx="20" cy="32" r="3" fill="#b91c1c" />
      </svg>
    )
  }
];

export default function ChapterMap({ onSelectChapter }) {
  const { profile } = useProfile();
  const progress = profile.chapterProgress || {};

  // Check if chapter is unlocked based on preceding chapter completion
  const isUnlocked = (index) => {
    if (index === 0) return true;
    const prevChapterKey = CHAPTERS_DATA[index - 1].key;
    const prevProgress = progress[prevChapterKey];
    return Boolean(prevProgress && (prevProgress.easy || prevProgress.medium || prevProgress.hard));
  };

  return (
    <section className="chapter-map-section" aria-label="Math Learning Chapters">
      <div className="section-header-row">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
            <line x1="8" y1="2" x2="8" y2="18" />
            <line x1="16" y1="6" x2="16" y2="22" />
          </svg>
          <div>
            <h2 className="section-heading">Math Adventures</h2>
            <p style={{ color: 'var(--color-text-muted)', fontWeight: 700, fontSize: '0.95rem' }}>
              Choose an adventure, answer math questions, and earn coins for your companion!
            </p>
          </div>
        </div>
      </div>

      <div className="chapters-grid">
        {CHAPTERS_DATA.map((ch, index) => {
          const unlocked = isUnlocked(index);
          const prog = progress[ch.key] || {};
          const starsEarned = [prog.easy, prog.medium, prog.hard].filter(Boolean).length;

          return (
            <div
              key={ch.key}
              className={`chapter-card ${unlocked ? 'unlocked' : 'locked'}`}
              style={{ '--chapter-color': ch.themeColor }}
            >
              {/* Top Banner */}
              <div
                className="chapter-card-banner"
                style={{ background: ch.themeBg, color: ch.themeColor }}
              >
                <span className="chapter-theme-tag">{ch.themeName}</span>
                <span className="chapter-grade-pill">{ch.grades}</span>
              </div>

              {/* Card Body */}
              <div className="chapter-card-body">
                <div className="chapter-badge-container">
                  {ch.badgeSvg}
                </div>

                <h3 className="chapter-title">{ch.title}</h3>
                <p className="chapter-description">{ch.description}</p>

                {/* 3-Star Progress Tracker */}
                <div className="chapter-stars-row" aria-label={`${starsEarned} of 3 stars earned`}>
                  {['Easy', 'Med', 'Hard'].map((tier, i) => (
                    <span
                      key={tier}
                      className={`star-pill ${i < starsEarned ? 'earned' : 'empty'}`}
                    >
                      ★ {tier}
                    </span>
                  ))}
                </div>

                {/* Chunky 3D Action Button */}
                <button
                  type="button"
                  className={`chapter-play-btn ${unlocked ? 'btn-active' : 'btn-disabled'}`}
                  disabled={!unlocked}
                  onClick={() => unlocked && onSelectChapter(ch)}
                  aria-label={unlocked ? `Play ${ch.title}` : `${ch.title} is locked`}
                >
                  {unlocked ? (starsEarned === 3 ? 'Mastered! 🌟' : 'Play Quest! 🚀') : 'Locked 🔒'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
