/**
 * src/components/MathVisualCounter.jsx
 * 
 * Child-friendly interactive math visualizer for K-5 learners.
 * Replaces raw emoji text dumps with tactile, touch-to-count SVG game tokens,
 * colorful equation blocks, and fraction wheels.
 */

import React, { useState, useEffect } from 'react';

// ─── High-Polish Illustrated SVG Tokens ─────────────────────

export function AppleToken({ size = 48, isCounted, number }) {
  return (
    <div className={`visual-token ${isCounted ? 'token-counted' : ''}`}>
      <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
        <filter id="apple-glow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="3" stdDeviation="2" floodColor="#991b1b" floodOpacity="0.25" />
        </filter>
        {/* Leaf & Stem */}
        <path d="M32 16 C32 10, 36 6, 40 4" stroke="#78350f" strokeWidth="3.5" strokeLinecap="round" />
        <path d="M34 12 C38 8, 48 8, 46 16 C40 18, 36 14, 34 12 Z" fill="#22c55e" />
        {/* Apple Body */}
        <path
          d="M32 20 C22 14, 10 20, 10 34 C10 48, 24 58, 32 58 C40 58, 54 48, 54 34 C54 20, 42 14, 32 20 Z"
          fill="url(#appleGrad)"
          filter="url(#apple-glow)"
        />
        {/* Specular Highlight */}
        <ellipse cx="22" cy="28" rx="4" ry="7" transform="rotate(-25 22 28)" fill="#ffffff" fillOpacity="0.45" />
        <defs>
          <linearGradient id="appleGrad" x1="16" y1="16" x2="48" y2="58" gradientUnits="userSpaceOnUse">
            <stop stopColor="#ef4444" />
            <stop offset="0.6" stopColor="#dc2626" />
            <stop offset="1" stopColor="#991b1b" />
          </linearGradient>
        </defs>
      </svg>
      {isCounted && <span className="counted-badge">{number}</span>}
    </div>
  );
}

export function StarToken({ size = 48, isCounted, number }) {
  return (
    <div className={`visual-token ${isCounted ? 'token-counted' : ''}`}>
      <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
        <path
          d="M32 6 L39.5 22 L57 24 L44 36 L48 54 L32 44 L16 54 L20 36 L7 24 L24.5 22 Z"
          fill="url(#starGrad)"
          stroke="#d97706"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        {/* Cute Face */}
        <circle cx="27" cy="31" r="2" fill="#78350f" />
        <circle cx="37" cy="31" r="2" fill="#78350f" />
        <path d="M29 36 Q32 39 35 36" stroke="#78350f" strokeWidth="2" strokeLinecap="round" />
        <circle cx="24" cy="34" r="2" fill="#f43f5e" fillOpacity="0.6" />
        <circle cx="40" cy="34" r="2" fill="#f43f5e" fillOpacity="0.6" />
        <defs>
          <linearGradient id="starGrad" x1="10" y1="6" x2="54" y2="54" gradientUnits="userSpaceOnUse">
            <stop stopColor="#fde047" />
            <stop offset="0.5" stopColor="#eab308" />
            <stop offset="1" stopColor="#ca8a04" />
          </linearGradient>
        </defs>
      </svg>
      {isCounted && <span className="counted-badge">{number}</span>}
    </div>
  );
}

export function BalloonToken({ size = 48, isCounted, number }) {
  return (
    <div className={`visual-token ${isCounted ? 'token-counted' : ''}`}>
      <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
        {/* String */}
        <path d="M32 50 Q36 56 30 62" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
        {/* Knot */}
        <polygon points="29,50 35,50 32,47" fill="#2563eb" />
        {/* Balloon Body */}
        <ellipse cx="32" cy="27" rx="20" ry="23" fill="url(#balloonGrad)" />
        {/* Shine */}
        <ellipse cx="24" cy="18" rx="4" ry="8" transform="rotate(-30 24 18)" fill="#ffffff" fillOpacity="0.5" />
        <defs>
          <linearGradient id="balloonGrad" x1="16" y1="8" x2="48" y2="48" gradientUnits="userSpaceOnUse">
            <stop stopColor="#60a5fa" />
            <stop offset="0.6" stopColor="#3b82f6" />
            <stop offset="1" stopColor="#1d4ed8" />
          </linearGradient>
        </defs>
      </svg>
      {isCounted && <span className="counted-badge">{number}</span>}
    </div>
  );
}

export function PizzaToken({ size = 48, isCounted, number }) {
  return (
    <div className={`visual-token ${isCounted ? 'token-counted' : ''}`}>
      <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
        {/* Crust */}
        <path d="M12 18 Q32 10 52 18" stroke="#b45309" strokeWidth="6" strokeLinecap="round" />
        {/* Cheese */}
        <polygon points="13,19 51,19 32,56" fill="url(#cheeseGrad)" stroke="#d97706" strokeWidth="2" />
        {/* Pepperoni */}
        <circle cx="26" cy="28" r="4" fill="#b91c1c" />
        <circle cx="38" cy="28" r="4" fill="#b91c1c" />
        <circle cx="32" cy="40" r="3.5" fill="#b91c1c" />
        <defs>
          <linearGradient id="cheeseGrad" x1="16" y1="18" x2="48" y2="56" gradientUnits="userSpaceOnUse">
            <stop stopColor="#fef08a" />
            <stop offset="0.7" stopColor="#facc15" />
            <stop offset="1" stopColor="#eab308" />
          </linearGradient>
        </defs>
      </svg>
      {isCounted && <span className="counted-badge">{number}</span>}
    </div>
  );
}

export function FishToken({ size = 48, isCounted, number }) {
  return (
    <div className={`visual-token ${isCounted ? 'token-counted' : ''}`}>
      <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
        {/* Tail */}
        <polygon points="12,22 12,42 24,32" fill="#ea580c" />
        {/* Body */}
        <ellipse cx="36" cy="32" rx="18" ry="14" fill="url(#fishGrad)" />
        {/* White Stripe */}
        <path d="M34 18 Q38 32 34 46" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" />
        {/* Eye */}
        <circle cx="46" cy="28" r="2.5" fill="#0f172a" />
        <circle cx="47" cy="27" r="1" fill="#ffffff" />
        <defs>
          <linearGradient id="fishGrad" x1="20" y1="20" x2="52" y2="44" gradientUnits="userSpaceOnUse">
            <stop stopColor="#fb923c" />
            <stop offset="0.7" stopColor="#f97316" />
            <stop offset="1" stopColor="#c2410c" />
          </linearGradient>
        </defs>
      </svg>
      {isCounted && <span className="counted-badge">{number}</span>}
    </div>
  );
}

export function CookieToken({ size = 48, isCounted, number }) {
  return (
    <div className={`visual-token ${isCounted ? 'token-counted' : ''}`}>
      <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
        <circle cx="32" cy="32" r="22" fill="url(#cookieGrad)" stroke="#78350f" strokeWidth="2.5" />
        {/* Choc Chips */}
        <circle cx="24" cy="24" r="3" fill="#451a03" />
        <circle cx="38" cy="22" r="2.5" fill="#451a03" />
        <circle cx="34" cy="34" r="3.5" fill="#451a03" />
        <circle cx="22" cy="38" r="2.5" fill="#451a03" />
        <circle cx="42" cy="36" r="3" fill="#451a03" />
        <defs>
          <linearGradient id="cookieGrad" x1="16" y1="16" x2="48" y2="48" gradientUnits="userSpaceOnUse">
            <stop stopColor="#d97706" />
            <stop offset="0.6" stopColor="#b45309" />
            <stop offset="1" stopColor="#92400e" />
          </linearGradient>
        </defs>
      </svg>
      {isCounted && <span className="counted-badge">{number}</span>}
    </div>
  );
}

export function FlowerToken({ size = 48, isCounted, number }) {
  return (
    <div className={`visual-token ${isCounted ? 'token-counted' : ''}`}>
      <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
        {/* Petals */}
        <circle cx="32" cy="18" r="9" fill="#f472b6" />
        <circle cx="46" cy="32" r="9" fill="#f472b6" />
        <circle cx="32" cy="46" r="9" fill="#f472b6" />
        <circle cx="18" cy="32" r="9" fill="#f472b6" />
        {/* Center */}
        <circle cx="32" cy="32" r="10" fill="#facc15" stroke="#eab308" strokeWidth="2" />
        <circle cx="29" cy="30" r="1.5" fill="#713f12" />
        <circle cx="35" cy="30" r="1.5" fill="#713f12" />
        <path d="M30 35 Q32 37 34 35" stroke="#713f12" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
      {isCounted && <span className="counted-badge">{number}</span>}
    </div>
  );
}

export function PuppyToken({ size = 48, isCounted, number }) {
  return (
    <div className={`visual-token ${isCounted ? 'token-counted' : ''}`}>
      <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
        {/* Ears */}
        <ellipse cx="16" cy="22" rx="7" ry="12" fill="#b45309" transform="rotate(-15 16 22)" />
        <ellipse cx="48" cy="22" rx="7" ry="12" fill="#b45309" transform="rotate(15 48 22)" />
        {/* Head */}
        <ellipse cx="32" cy="34" rx="19" ry="17" fill="#f59e0b" stroke="#d97706" strokeWidth="2" />
        {/* Muzzle */}
        <ellipse cx="32" cy="39" rx="9" ry="7" fill="#fef3c7" />
        {/* Nose & Eyes */}
        <ellipse cx="32" cy="36" rx="3.5" ry="2.5" fill="#1e293b" />
        <circle cx="25" cy="30" r="2.5" fill="#1e293b" />
        <circle cx="39" cy="30" r="2.5" fill="#1e293b" />
        <circle cx="26" cy="29" r="1" fill="#ffffff" />
        <circle cx="40" cy="29" r="1" fill="#ffffff" />
      </svg>
      {isCounted && <span className="counted-badge">{number}</span>}
    </div>
  );
}

// ─── Fraction Visual Pie Component ──────────────────────────

export function FractionPieVisual({ numerator, denominator, size = 160 }) {
  const radius = size / 2 - 12;
  const cx = size / 2;
  const cy = size / 2;

  const slices = [];
  const anglePerSlice = (2 * Math.PI) / denominator;

  for (let i = 0; i < denominator; i++) {
    const startAngle = i * anglePerSlice - Math.PI / 2;
    const endAngle = (i + 1) * anglePerSlice - Math.PI / 2;

    const x1 = cx + radius * Math.cos(startAngle);
    const y1 = cy + radius * Math.sin(startAngle);
    const x2 = cx + radius * Math.cos(endAngle);
    const y2 = cy + radius * Math.sin(endAngle);

    const isShaded = i < numerator;
    const largeArc = anglePerSlice > Math.PI ? 1 : 0;

    const pathData = `M ${cx} ${cy} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;

    slices.push(
      <path
        key={i}
        d={pathData}
        fill={isShaded ? '#f59e0b' : '#f1f5f9'}
        stroke="#475569"
        strokeWidth="3"
        strokeLinejoin="round"
      />
    );
  }

  return (
    <div className="fraction-visual-container">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={cx} cy={cy} r={radius + 4} fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="2" />
        {slices}
      </svg>
      <div className="fraction-label">
        <span className="num">{numerator}</span>
        <span className="bar" />
        <span className="den">{denominator}</span>
      </div>
    </div>
  );
}

// ─── Main Dispatcher Component ──────────────────────────────

export default function MathVisualCounter({ questionText }) {
  // State for interactive tapping & counting
  const [countedSet, setCountedSet] = useState(new Set());

  // Reset counted items when question changes
  useEffect(() => {
    setCountedSet(new Set());
  }, [questionText]);

  const handleToggleCount = (index) => {
    setCountedSet((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  // Check if this is a counting question
  // e.g. "How many ... do you see?\n..."
  const lines = questionText.split('\n');
  const mainPrompt = lines[0];
  const visualRow = lines[1] || '';

  // Detect token type and count from visual row or prompt
  const tokenMap = {
    '🍎': AppleToken,
    '⭐': StarToken,
    '🎈': BalloonToken,
    '🐶': PuppyToken,
    '🐠': FishToken,
    '🍪': CookieToken,
    '🌸': FlowerToken,
    '🍕': PizzaToken
  };

  // Find token emoji if present
  let matchedKey = null;
  for (const key of Object.keys(tokenMap)) {
    if (questionText.includes(key)) {
      matchedKey = key;
      break;
    }
  }

  // If question is a counting problem with items
  if (matchedKey && visualRow.includes(matchedKey)) {
    // Count occurrences of token in row
    const count = (visualRow.match(new RegExp(matchedKey, 'g')) || []).length;
    const TokenComponent = tokenMap[matchedKey];

    // Clean prompt of raw emoji
    const cleanPrompt = mainPrompt.replace(matchedKey, '').replace(/\s{2,}/g, ' ').trim();

    return (
      <div className="math-visual-counter">
        <h3 className="clean-question-prompt">{cleanPrompt}</h3>
        <p className="touch-help-tip">👆 Tap each item below to count together!</p>
        
        <div className="counter-play-board">
          {Array.from({ length: count }).map((_, idx) => (
            <button
              key={idx}
              type="button"
              className="token-tap-button"
              onClick={() => handleToggleCount(idx)}
              aria-label={`Count item ${idx + 1}`}
            >
              <TokenComponent
                size={54}
                isCounted={countedSet.has(idx)}
                number={Array.from(countedSet).indexOf(idx) + 1 || (idx + 1)}
              />
            </button>
          ))}
        </div>

        <div className="counter-status-pill">
          Counted: <strong>{countedSet.size}</strong> of <strong>{count}</strong>
        </div>
      </div>
    );
  }

  // Fraction question detection e.g. "What fraction ... 1/2" or "3/4"
  const fractionMatch = questionText.match(/(\d)\/(\d)/);
  if (fractionMatch && questionText.toLowerCase().includes('fraction')) {
    const num = parseInt(fractionMatch[1], 10);
    const den = parseInt(fractionMatch[2], 10);
    if (den > 0 && den <= 12) {
      return (
        <div className="math-visual-counter">
          <h3 className="clean-question-prompt">{questionText}</h3>
          <FractionPieVisual numerator={num} denominator={den} size={150} />
        </div>
      );
    }
  }

  // Standard equation or word problem
  return (
    <div className="math-visual-counter standard-layout">
      <h3 className="clean-question-prompt-large">{questionText}</h3>
    </div>
  );
}
