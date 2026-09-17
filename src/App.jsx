/**
 * src/App.jsx
 * 
 * Root Application Component.
 * Manages screen routing via simple `currentScreen` state (no react-router needed).
 * Renders persistent top navigation bar, comfort settings modal, and routes between:
 * - 'login'
 * - 'petSelect'
 * - 'dashboard'
 * - 'chapterSelect' (modal over dashboard)
 * - 'question'
 * - 'completion'
 * - 'shop'
 */

import React, { useState, useEffect } from 'react';
import { useProfile } from './context/ProfileContext.jsx';
import Login from './components/Login.jsx';
import PetSelect from './components/PetSelect.jsx';
import Dashboard from './components/Dashboard.jsx';
import ChapterSelect from './components/ChapterSelect.jsx';
import QuestionScreen from './components/QuestionScreen.jsx';
import CompletionSummary from './components/CompletionSummary.jsx';
import Shop from './components/Shop.jsx';
import ComfortSettings from './components/ComfortSettings.jsx';

export default function App() {
  const { currentUser, profile, logout } = useProfile();

  // Screen state
  const [currentScreen, setCurrentScreen] = useState('login');
  const [activeChapter, setActiveChapter] = useState(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState(null);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [quizResults, setQuizResults] = useState(null);
  const [previousStage, setPreviousStage] = useState(null);

  // Sync screen with login/pet status
  useEffect(() => {
    if (!currentUser) {
      setCurrentScreen('login');
    } else if (!profile.petType) {
      setCurrentScreen('petSelect');
    } else if (currentScreen === 'login' || currentScreen === 'petSelect') {
      setCurrentScreen('dashboard');
    }
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [currentUser, profile.petType, currentScreen]);

  // Comfort settings classes applied to root and document body
  const settings = profile.comfortSettings || {};
  const rootClasses = [
    'app-container',
    settings.darkMode ? 'dark-mode' : '',
    settings.highContrast ? 'high-contrast' : '',
    settings.dyslexiaFont ? 'dyslexia-font' : '',
    settings.adhdFocus ? 'adhd-focus-mode' : '',
    settings.reducedMotion ? 'reduced-motion' : '',
    `text-${settings.textSize || 'medium'}`
  ]
    .filter(Boolean)
    .join(' ');

  useEffect(() => {
    document.body.className = rootClasses;
  }, [rootClasses]);


  // Flow handlers
  const handleStartChapter = (chapter) => {
    setActiveChapter(chapter);
  };

  const handleStartDifficulty = (difficulty) => {
    setSelectedDifficulty(difficulty);
    setPreviousStage(profile.growthStage);
    setCurrentScreen('question');
  };

  const handleCompleteQuiz = (results) => {
    setQuizResults(results);
    setCurrentScreen('completion');
  };

  const handleReturnToDashboard = () => {
    setActiveChapter(null);
    setSelectedDifficulty(null);
    setQuizResults(null);
    setCurrentScreen('dashboard');
  };

  // Replay the same chapter + difficulty
  const handlePlayAgain = () => {
    setQuizResults(null);
    setPreviousStage(profile.growthStage);
    setCurrentScreen('question');
  };

  return (
    <div className={rootClasses}>
      {/* Persistent Top Navigation Bar */}
      {currentUser && profile.petType && (
        <header className="top-nav-bar">
          <div
            className="brand-section"
            onClick={handleReturnToDashboard}
            title="Go to Dashboard"
          >
            <div className="brand-logo-badge" aria-hidden="true">
              <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
                <ellipse cx="16" cy="21" rx="7" ry="6" fill="#3b82f6" />
                <circle cx="9" cy="12" r="3.2" fill="#3b82f6" />
                <circle cx="16" cy="9" r="3.2" fill="#3b82f6" />
                <circle cx="23" cy="12" r="3.2" fill="#3b82f6" />
                <polygon points="16,14 17.5,18 21.5,18.5 18.5,21 19.5,25 16,23 12.5,25 13.5,21 10.5,18.5 14.5,18" fill="#facc15" />
              </svg>
            </div>
            <span className="brand-title">Pet Math Academy</span>
            <span className="learner-badge">{currentUser}</span>
          </div>

          <div className="nav-actions">
            {/* Coins Display */}
            <div className="coin-pill" aria-label={`${profile.coins} coins`}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle cx="12" cy="12" r="10" fill="url(#coinGradTop)" stroke="#d97706" strokeWidth="1.5" />
                <circle cx="12" cy="12" r="7.5" stroke="#fef08a" strokeWidth="1" strokeDasharray="3 2" />
                <polygon points="12,7 13.5,10.5 17,11 14.5,13.5 15.5,17 12,15 8.5,17 9.5,13.5 7,11 10.5,10.5" fill="#fef08a" />
                <defs>
                  <linearGradient id="coinGradTop" x1="4" y1="4" x2="20" y2="20" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#fde047" />
                    <stop offset="0.6" stopColor="#eab308" />
                    <stop offset="1" stopColor="#ca8a04" />
                  </linearGradient>
                </defs>
              </svg>
              <span className="coin-amount">{profile.coins}</span>
            </div>

            {/* Daily Streak Display */}
            <div className="streak-pill" aria-label={`${profile.streak || 0} day learning streak`} title="Daily Learning Streak">
              <span className="streak-fire-icon" aria-hidden="true">🔥</span>
              <span className="streak-count">{profile.streak || 0}</span>
            </div>

            {/* Shop Button */}
            <button
              type="button"
              className="icon-btn toy-nav-btn"
              onClick={() => setCurrentScreen('shop')}
              title="Pet Boutique & Shop"
              aria-label="Open shop"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
            </button>

            {/* Comfort Settings Button */}
            <button
              type="button"
              className="icon-btn toy-nav-btn"
              onClick={() => setShowSettingsModal(true)}
              title="Comfort & Accessibility Settings"
              aria-label="Open comfort settings"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
              </svg>
            </button>

            {/* Switch User / Logout Button */}
            <button
              type="button"
              className="icon-btn toy-nav-btn"
              onClick={logout}
              title="Switch Learner"
              aria-label="Log out / Switch learner"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
            </button>
          </div>
        </header>
      )}

      {/* Main Screen Body */}
      <main className="main-content">
        {currentScreen === 'login' && (
          <Login
            onLoginSuccess={() => {
              // Screen transition handled by useEffect
            }}
          />
        )}

        {currentScreen === 'petSelect' && (
          <PetSelect
            onPetSelected={() => {
              setCurrentScreen('dashboard');
            }}
          />
        )}

        {currentScreen === 'dashboard' && (
          <Dashboard
            onSelectChapter={handleStartChapter}
            onOpenShop={() => setCurrentScreen('shop')}
          />
        )}

        {currentScreen === 'shop' && (
          <Shop onClose={handleReturnToDashboard} />
        )}

        {currentScreen === 'question' && activeChapter && selectedDifficulty && (
          <QuestionScreen
            chapterKey={activeChapter.key}
            chapterTitle={activeChapter.title}
            difficulty={selectedDifficulty}
            onCompleteQuiz={handleCompleteQuiz}
            onExitQuiz={handleReturnToDashboard}
            onTriggerCelebrate={() => {}}
          />
        )}

        {currentScreen === 'completion' && quizResults && (
          <CompletionSummary
            results={quizResults}
            previousGrowthStage={previousStage}
            onReturnToDashboard={handleReturnToDashboard}
            onPlayAgain={handlePlayAgain}
          />
        )}

        {/* Modal: Difficulty Selector */}
        {activeChapter && !selectedDifficulty && currentScreen === 'dashboard' && (
          <ChapterSelect
            chapter={activeChapter}
            onStartDifficulty={handleStartDifficulty}
            onClose={() => setActiveChapter(null)}
          />
        )}

        {/* Modal: Comfort Settings */}
        {showSettingsModal && (
          <ComfortSettings onClose={() => setShowSettingsModal(false)} />
        )}
      </main>
    </div>
  );
}
