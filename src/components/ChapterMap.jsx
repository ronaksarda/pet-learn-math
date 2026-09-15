/**
 * src/components/ChapterMap.jsx
 * 
 * Comprehensive K-5 Mathematics Curriculum Roadmap.
 * 12 dedicated chapters spanning Kindergarten through 5th Grade.
 * Filters chapters cleanly based on learner's grade level.
 * Features custom SVG vector badges, tactile cards, and 3-tier star progression.
 */

import React, { useMemo } from 'react';
import { useProfile } from '../context/ProfileContext.jsx';

export const CHAPTERS_DATA = [
  // ─── Kindergarten ──────────────────────────────────────────
  {
    key: 'k_counting',
    title: 'Counting & Numbers',
    themeName: 'Counting Kingdom',
    themeColor: '#10b981',
    themeBg: '#ecfdf5',
    grades: ['K'],
    gradeLabel: 'Kindergarten',
    description: 'Object counting 1-10, number lines, 10-frames, and comparing groups',
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
    key: 'k_shapes_patterns',
    title: 'Shapes & Patterns',
    themeName: 'Shape Island',
    themeColor: '#06b6d4',
    themeBg: '#ecfeff',
    grades: ['K'],
    gradeLabel: 'Kindergarten',
    description: '2D & 3D shapes, counting sides, size comparison, and visual patterns',
    badgeSvg: (
      <svg width="56" height="56" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="20" cy="24" r="12" fill="#06b6d4" stroke="#0891b2" strokeWidth="2.5" />
        <polygon points="44,12 56,36 32,36" fill="#f59e0b" stroke="#d97706" strokeWidth="2.5" />
        <rect x="24" y="36" width="20" height="20" rx="3" fill="#ec4899" stroke="#be185d" strokeWidth="2.5" />
      </svg>
    )
  },

  // ─── 1st Grade ─────────────────────────────────────────────
  {
    key: 'g1_add_sub',
    title: 'Add & Subtract to 20',
    themeName: 'Math Safari',
    themeColor: '#3b82f6',
    themeBg: '#eff6ff',
    grades: ['1'],
    gradeLabel: '1st Grade',
    description: 'Addition & subtraction within 20, doubles facts, and missing addends',
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
    key: 'g1_place_time',
    title: 'Place Value & Clocks',
    themeName: 'Clockwork Castle',
    themeColor: '#6366f1',
    themeBg: '#eef2ff',
    grades: ['1'],
    gradeLabel: '1st Grade',
    description: 'Tens and ones, number comparisons (<, >), and clocks to the hour/half-hour',
    badgeSvg: (
      <svg width="56" height="56" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="32" cy="32" r="26" fill="#e0e7ff" stroke="#6366f1" strokeWidth="3.5" />
        <line x1="32" y1="32" x2="32" y2="16" stroke="#4338ca" strokeWidth="3.5" strokeLinecap="round" />
        <line x1="32" y1="32" x2="44" y2="32" stroke="#4338ca" strokeWidth="3" strokeLinecap="round" />
        <circle cx="32" cy="32" r="3" fill="#4338ca" />
      </svg>
    )
  },

  // ─── 2nd Grade ─────────────────────────────────────────────
  {
    key: 'g2_2digit_math',
    title: '2-Digit Math & Regrouping',
    themeName: 'Dragon Mountain',
    themeColor: '#f59e0b',
    themeBg: '#fffbeb',
    grades: ['2'],
    gradeLabel: '2nd Grade',
    description: '2-digit addition & subtraction with carrying/borrowing, and 3 addends',
    badgeSvg: (
      <svg width="56" height="56" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="10" y="10" width="44" height="44" rx="10" fill="#fef3c7" stroke="#f59e0b" strokeWidth="3" />
        <text x="32" y="32" fontSize="16" fontWeight="900" fill="#b45309" textAnchor="middle">58</text>
        <text x="32" y="48" fontSize="16" fontWeight="900" fill="#b45309" textAnchor="middle">+27</text>
      </svg>
    )
  },
  {
    key: 'g2_money_measure',
    title: 'Money, Coins & Measure',
    themeName: 'Treasure Cove',
    themeColor: '#eab308',
    themeBg: '#fefce8',
    grades: ['2'],
    gradeLabel: '2nd Grade',
    description: 'Pennies, nickels, dimes, quarters, making change from $1, and inches',
    badgeSvg: (
      <svg width="56" height="56" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="28" cy="34" r="20" fill="#fef08a" stroke="#ca8a04" strokeWidth="3" />
        <circle cx="42" cy="24" r="15" fill="#fed7aa" stroke="#c2410c" strokeWidth="2.5" />
        <text x="28" y="41" fontSize="18" fontWeight="900" fill="#854d0e" textAnchor="middle">¢</text>
        <text x="42" y="30" fontSize="14" fontWeight="900" fill="#9a3412" textAnchor="middle">$</text>
      </svg>
    )
  },

  // ─── 3rd Grade ─────────────────────────────────────────────
  {
    key: 'g3_mult_div',
    title: 'Multiply & Divide',
    themeName: 'Space Galaxy',
    themeColor: '#8b5cf6',
    themeBg: '#f5f3ff',
    grades: ['3'],
    gradeLabel: '3rd Grade',
    description: 'Times tables 1-12, equal groups, missing factors, and word problems',
    badgeSvg: (
      <svg width="56" height="56" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M32 4 L40 22 L60 25 L45 39 L49 59 L32 49 L15 59 L19 39 L4 25 L24 22 Z" fill="#8b5cf6" stroke="#6d28d9" strokeWidth="2.5" />
        <path d="M25 25 L39 39 M39 25 L25 39" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" />
      </svg>
    )
  },
  {
    key: 'g3_fractions_geom',
    title: 'Fractions & Perimeter',
    themeName: 'Geometry Jungle',
    themeColor: '#ec4899',
    themeBg: '#fdf2f8',
    grades: ['3'],
    gradeLabel: '3rd Grade',
    description: 'Unit fractions 1/2-1/8, shaded models, perimeter and rectangle area',
    badgeSvg: (
      <svg width="56" height="56" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="32" cy="32" r="26" fill="#fed7aa" stroke="#c2410c" strokeWidth="3" />
        <path d="M32 6 A26 26 0 0 1 58 32 L32 32 Z" fill="#ef4444" stroke="#b91c1c" strokeWidth="2" />
        <path d="M32 32 L58 32 A26 26 0 0 1 32 58 Z" fill="#f97316" stroke="#c2410c" strokeWidth="2" />
      </svg>
    )
  },

  // ─── 4th Grade ─────────────────────────────────────────────
  {
    key: 'g4_multidigit_factors',
    title: 'Multi-Digit Math & Primes',
    themeName: 'Factor Forest',
    themeColor: '#14b8a6',
    themeBg: '#f0fdfa',
    grades: ['4'],
    gradeLabel: '4th Grade',
    description: 'Multi-digit multiplication, long division, factors, multiples & primes',
    badgeSvg: (
      <svg width="56" height="56" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="8" y="12" width="48" height="40" rx="6" fill="#ccfbf1" stroke="#0f766e" strokeWidth="3" />
        <text x="32" y="36" fontSize="16" fontWeight="900" fill="#115e59" textAnchor="middle">24 × 15</text>
      </svg>
    )
  },
  {
    key: 'g4_fractions_decimals',
    title: 'Fractions & Decimals',
    themeName: 'Decimal Dunes',
    themeColor: '#f97316',
    themeBg: '#fff7ed',
    grades: ['4'],
    gradeLabel: '4th Grade',
    description: 'Fractions with like denominators, mixed numbers, tenths & hundredths',
    badgeSvg: (
      <svg width="56" height="56" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="32" cy="32" r="26" fill="#ffedd5" stroke="#ea580c" strokeWidth="3" />
        <text x="32" y="38" fontSize="16" fontWeight="900" fill="#c2410c" textAnchor="middle">0.75</text>
      </svg>
    )
  },

  // ─── 5th Grade ─────────────────────────────────────────────
  {
    key: 'g5_adv_fractions_decimals',
    title: 'Fraction & Decimal Ops',
    themeName: 'Cosmic Nebula',
    themeColor: '#a855f7',
    themeBg: '#faf5ff',
    grades: ['5'],
    gradeLabel: '5th Grade',
    description: 'Unlike denominator fractions, multiplying fractions, and decimal math',
    badgeSvg: (
      <svg width="56" height="56" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="32" cy="32" r="26" fill="#f3e8ff" stroke="#9333ea" strokeWidth="3" />
        <text x="32" y="30" fontSize="13" fontWeight="900" fill="#7e22ce" textAnchor="middle">1/2 + 1/3</text>
        <text x="32" y="46" fontSize="13" fontWeight="900" fill="#7e22ce" textAnchor="middle">= 5/6</text>
      </svg>
    )
  },
  {
    key: 'g5_pemdas_volume_coords',
    title: 'PEMDAS, Volume & Coords',
    themeName: 'Quantum Matrix',
    themeColor: '#ef4444',
    themeBg: '#fef2f2',
    grades: ['5'],
    gradeLabel: '5th Grade',
    description: 'Order of Operations (PEMDAS), 3D volume (l×w×h), and coordinate plane',
    badgeSvg: (
      <svg width="56" height="56" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="10" y="10" width="44" height="44" rx="8" fill="#ffe4e6" stroke="#e11d48" strokeWidth="3" />
        <text x="32" y="36" fontSize="13" fontWeight="900" fill="#9f1239" textAnchor="middle">V = lwh</text>
      </svg>
    )
  }
];

export default function ChapterMap({ onSelectChapter }) {
  const { profile, setGrade } = useProfile();
  const progress = profile.chapterProgress || {};
  const activeGrade = profile.grade;

  // Filter chapters to learner's selected grade. null = show all 12 chapters
  const visibleChapters = useMemo(() => {
    if (!activeGrade) return CHAPTERS_DATA;
    return CHAPTERS_DATA.filter((ch) => ch.grades.includes(activeGrade));
  }, [activeGrade]);

  // Check if chapter is unlocked based on preceding visible chapter completion
  const isUnlocked = (visibleIndex) => {
    if (visibleIndex === 0) return true;
    const prevChapterKey = visibleChapters[visibleIndex - 1].key;
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

      {/* Grade Filter Bar */}
      <div className="grade-filter-bar" role="tablist" aria-label="Filter by grade">
        <button
          type="button"
          role="tab"
          aria-selected={!activeGrade}
          className={`grade-filter-pill ${!activeGrade ? 'active' : ''}`}
          onClick={() => setGrade(null)}
        >
          All Grades (K-5)
        </button>
        {['K', '1', '2', '3', '4', '5'].map((g) => (
          <button
            key={g}
            type="button"
            role="tab"
            aria-selected={activeGrade === g}
            className={`grade-filter-pill ${activeGrade === g ? 'active' : ''}`}
            onClick={() => setGrade(g)}
          >
            {g === 'K' ? 'Kindergarten' : `Grade ${g}`}
          </button>
        ))}
      </div>

      <div className="chapters-grid">
        {visibleChapters.map((ch, index) => {
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
                <span className="chapter-grade-pill">{ch.gradeLabel}</span>
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
                      <svg width="12" height="12" viewBox="0 0 24 24" fill={i < starsEarned ? '#facc15' : '#cbd5e1'} stroke={i < starsEarned ? '#d97706' : '#94a3b8'} strokeWidth="1.5">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                      {tier}
                    </span>
                  ))}
                </div>

                {/* Action Button */}
                <button
                  type="button"
                  className={`chapter-play-btn ${unlocked ? 'btn-active' : 'btn-disabled'}`}
                  disabled={!unlocked}
                  onClick={() => unlocked && onSelectChapter(ch)}
                  aria-label={unlocked ? `Play ${ch.title}` : `${ch.title} is locked`}
                >
                  {unlocked ? (
                    starsEarned === 3 ? (
                      <>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="#facc15" stroke="#d97706" strokeWidth="1.5">
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                        </svg>
                        Mastered!
                      </>
                    ) : (
                      <>
                        Play Quest!
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="5" y1="12" x2="19" y2="12" />
                          <polyline points="12 5 19 12 12 19" />
                        </svg>
                      </>
                    )
                  ) : (
                    <>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                      </svg>
                      Locked
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {visibleChapters.length === 0 && (
        <div className="empty-chapters-message">
          <p>No math adventures available for this grade yet. Try "All Grades" to see everything!</p>
        </div>
      )}
    </section>
  );
}
