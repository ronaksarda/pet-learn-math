/**
 * src/components/ComfortSettings.jsx
 * 
 * Accessibility & Comfort Settings Modal.
 * Provides controls for Dark Mode, Reduced Motion, High Contrast, Dyslexia Font,
 * ADHD Focus Mode, Text Size scaling, and Speech Synthesis Read-Aloud.
 * 
 * UX Highlights:
 * - Backdrop click to dismiss
 * - Escape key support
 * - Explicit header '✕' and footer 'Done' buttons
 */

import React, { useEffect } from 'react';
import { useProfile } from '../context/ProfileContext.jsx';

export default function ComfortSettings({ onClose }) {
  const { profile, updateSettings } = useProfile();
  const settings = profile.comfortSettings || {};

  // Prevent body scroll when modal is open and handle Escape key
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  const handleToggle = (key) => {
    updateSettings({ [key]: !settings[key] });
  };

  const handleTextSize = (size) => {
    updateSettings({ textSize: size });
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-title"
      onClick={handleOverlayClick}
    >
      <div className="modal-card comfort-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 id="settings-title" className="modal-title">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9c.26.604.852.997 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
            Comfort & Accessibility
          </h2>
          <button
            type="button"
            className="icon-btn modal-close-btn"
            onClick={onClose}
            aria-label="Close settings"
            title="Close"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="settings-list">
          {/* Dark Mode Toggle */}
          <div className="setting-row">
            <div className="setting-label-block">
              <span className="setting-title">Dark Mode 🌙</span>
              <span className="setting-desc">Sleek, eye-friendly dark color palette</span>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={!!settings.darkMode}
                onChange={() => handleToggle('darkMode')}
                aria-label="Toggle dark mode"
              />
              <span className="toggle-slider" />
            </label>
          </div>

          {/* Reduced Motion Toggle */}
          <div className="setting-row">
            <div className="setting-label-block">
              <span className="setting-title">Reduced Motion</span>
              <span className="setting-desc">Disables continuous bobbing and jumping animations</span>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={!!settings.reducedMotion}
                onChange={() => handleToggle('reducedMotion')}
                aria-label="Toggle reduced motion"
              />
              <span className="toggle-slider" />
            </label>
          </div>

          {/* High Contrast Toggle */}
          <div className="setting-row">
            <div className="setting-label-block">
              <span className="setting-title">High Contrast Mode</span>
              <span className="setting-desc">Enhances text contrast and visual borders</span>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={!!settings.highContrast}
                onChange={() => handleToggle('highContrast')}
                aria-label="Toggle high contrast"
              />
              <span className="toggle-slider" />
            </label>
          </div>

          {/* Dyslexia Friendly Font Toggle */}
          <div className="setting-row">
            <div className="setting-label-block">
              <span className="setting-title">Dyslexia-Friendly Typography</span>
              <span className="setting-desc">Switches to Lexend font with extra letter spacing for reading fluency</span>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={!!settings.dyslexiaFont}
                onChange={() => handleToggle('dyslexiaFont')}
                aria-label="Toggle dyslexia-friendly font"
              />
              <span className="toggle-slider" />
            </label>
          </div>

          {/* ADHD / High Focus Mode Toggle */}
          <div className="setting-row">
            <div className="setting-label-block">
              <span className="setting-title">ADHD Focus Mode</span>
              <span className="setting-desc">Highlights numbers/operators and adds a calming reading guide</span>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={!!settings.adhdFocus}
                onChange={() => handleToggle('adhdFocus')}
                aria-label="Toggle ADHD Focus Mode"
              />
              <span className="toggle-slider" />
            </label>
          </div>

          {/* Read Aloud Toggle */}
          <div className="setting-row">
            <div className="setting-label-block">
              <span className="setting-title">Read Questions Aloud</span>
              <span className="setting-desc">Speaks math problems and answer options automatically</span>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={!!settings.readAloud}
                onChange={() => handleToggle('readAloud')}
                aria-label="Toggle read questions aloud"
              />
              <span className="toggle-slider" />
            </label>
          </div>

          {/* Text Size Scale */}
          <div className="setting-row">
            <div className="setting-label-block">
              <span className="setting-title">Text Size</span>
              <span className="setting-desc">Adjust font scale for easy reading</span>
            </div>
            <div className="size-pill-group" role="radiogroup" aria-label="Text Size">
              {['small', 'medium', 'large'].map((size) => (
                <button
                  key={size}
                  type="button"
                  role="radio"
                  aria-checked={settings.textSize === size}
                  className={`size-pill-btn ${settings.textSize === size ? 'active' : ''}`}
                  onClick={() => handleTextSize(size)}
                  style={{ textTransform: 'capitalize' }}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Done Footer */}
        <div className="modal-footer" style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
          <button
            type="button"
            className="toy-customize-btn"
            style={{ width: '100%', padding: '12px' }}
            onClick={onClose}
          >
            Done & Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}
