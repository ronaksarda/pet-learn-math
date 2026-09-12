/**
 * src/components/ComfortSettings.jsx
 * 
 * Accessibility & Comfort Settings Modal.
 * Provides controls for Reduced Motion, High Contrast, Dyslexia Font,
 * Text Size scaling, and Speech Synthesis Read-Aloud.
 */

import React from 'react';
import { useProfile } from '../context/ProfileContext.jsx';

export default function ComfortSettings({ onClose }) {
  const { profile, updateSettings } = useProfile();
  const settings = profile.comfortSettings || {};

  const handleToggle = (key) => {
    updateSettings({ [key]: !settings[key] });
  };

  const handleTextSize = (size) => {
    updateSettings({ textSize: size });
  };

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="settings-title">
      <div className="modal-card">
        <div className="modal-header">
          <h2 id="settings-title" className="modal-title">
            ⚙️ Comfort & Accessibility
          </h2>
          <button
            type="button"
            className="icon-btn"
            onClick={onClose}
            aria-label="Close settings"
          >
            ✕
          </button>
        </div>

        <div className="settings-list">
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
              <span className="setting-title">Dyslexia-Friendly Font</span>
              <span className="setting-desc">Switches to high-readability Verdana typography</span>
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
      </div>
    </div>
  );
}
