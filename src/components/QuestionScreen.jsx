/**
 * src/components/QuestionScreen.jsx
 * 
 * Child-friendly, tactile math quiz arena.
 * Includes interactive SVG counting board, stepping stone progress trail,
 * active 3D cheering pet companion, and 3D toy-block answer buttons.
 */

import React, { useState, useEffect, useRef } from 'react';
import { useProfile } from '../context/ProfileContext.jsx';
import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis.js';
import { generateChapterQuestions } from '../data/questions.js';
import MathVisualCounter from './MathVisualCounter.jsx';
import PetCanvas3D from './PetCanvas3D.jsx';

// Calibrated coin & XP rewards per question
const COIN_REWARDS = {
  easy: 2,
  medium: 4,
  hard: 6
};

const XP_REWARDS = {
  easy: 5,
  medium: 10,
  hard: 15
};

const PERFECT_BONUS = {
  easy: { coins: 5, xp: 5 },
  medium: { coins: 8, xp: 10 },
  hard: { coins: 12, xp: 15 }
};

export default function QuestionScreen({
  chapterKey,
  chapterTitle,
  difficulty,
  onCompleteQuiz,
  onExitQuiz,
  onTriggerCelebrate
}) {
  const { profile, addCoins, addXP, completeChapter } = useProfile();
  const { speak, isSupported } = useSpeechSynthesis();

  // Generate 5 questions once on component mount
  const [questions, setQuestions] = useState(() => {
    return generateChapterQuestions(chapterKey, difficulty, 5);
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [feedbackState, setFeedbackState] = useState(null); // 'correct' | 'retry' | null
  const [retryOptions, setRetryOptions] = useState(new Set()); // Options already attempted incorrectly
  const [isAdvancing, setIsAdvancing] = useState(false);
  const [celebratePet, setCelebratePet] = useState(false);

  // Cumulative session reward tracking
  const sessionRewardsRef = useRef({ coins: 0, xp: 0, firstTryCorrect: 0 });

  const currentQ = questions[currentIndex];

  // Auto-trigger voice read-aloud when question mounts, if setting active
  useEffect(() => {
    if (currentQ && profile.comfortSettings?.readAloud) {
      speak(`${currentQ.questionText || currentQ.prompt}. Choose an answer.`);
    }
  }, [currentIndex, currentQ, profile.comfortSettings?.readAloud, speak]);

  // Handle user selecting an answer
  const handleSelectOption = (index) => {
    if (isAdvancing || retryOptions.has(index)) return;

    setSelectedOption(index);

    if (index === currentQ.correctIndex) {
      // ─── CORRECT ANSWER ──────────────────────────────────
      setFeedbackState('correct');
      setCelebratePet(true);
      setIsAdvancing(true);

      const earnedCoins = COIN_REWARDS[difficulty] || 2;
      const earnedXP = XP_REWARDS[difficulty] || 5;

      sessionRewardsRef.current.coins += earnedCoins;
      sessionRewardsRef.current.xp += earnedXP;

      // Track if answered on the very first try for bonus calculation
      if (retryOptions.size === 0) {
        sessionRewardsRef.current.firstTryCorrect += 1;
      }

      // Trigger global celebration if callback passed
      if (onTriggerCelebrate) {
        onTriggerCelebrate();
      }

      // Voice prompt on correct if read-aloud active
      if (profile.comfortSettings?.readAloud) {
        speak('Great job!');
      }

      // Brief delay before advancing to let learner celebrate
      setTimeout(() => {
        if (currentIndex < questions.length - 1) {
          setCurrentIndex((prev) => prev + 1);
          setSelectedOption(null);
          setFeedbackState(null);
          setCelebratePet(false);
          setRetryOptions(new Set());
          setIsAdvancing(false);
        } else {
          // Finished all 5 questions!
          const perfect = sessionRewardsRef.current.firstTryCorrect === 5;
          const bonus = perfect ? PERFECT_BONUS[difficulty] || { coins: 5, xp: 5 } : { coins: 0, xp: 0 };
          const bonusCoins = bonus.coins;
          const bonusXP = bonus.xp;

          const totalCoins = sessionRewardsRef.current.coins + bonusCoins;
          const totalXP = sessionRewardsRef.current.xp + bonusXP;

          // Commit rewards to global profile context
          addCoins(totalCoins);
          addXP(totalXP);
          completeChapter(chapterKey, difficulty);

          onCompleteQuiz({
            coinsEarned: totalCoins,
            xpEarned: totalXP,
            bonusCoins,
            bonusXP,
            perfectScore: perfect,
            chapterTitle,
            difficulty
          });
        }
      }, 1100);
    } else {
      // ─── INCORRECT ANSWER (Friendly Retry) ───────────────
      setFeedbackState('retry');
      setRetryOptions((prev) => new Set([...prev, index]));

      if (profile.comfortSettings?.readAloud) {
        speak('Almost! Try counting again.');
      }
    }
  };

  return (
    <div className="question-screen-container" role="main">
      {/* ─── Top Trail Header ─────────────────────────────── */}
      <div className="quiz-top-bar">
        <button
          type="button"
          className="quiz-exit-button"
          onClick={onExitQuiz}
          aria-label="Exit quiz to academy"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
          <span>Exit</span>
        </button>

        {/* Child-Friendly Stepping Stones Trail */}
        <div className="stepping-stones-trail" role="progressbar" aria-valuenow={currentIndex + 1} aria-valuemin="1" aria-valuemax="5">
          {questions.map((_, qIdx) => {
            const isDone = qIdx < currentIndex;
            const isCurrent = qIdx === currentIndex;
            let stoneClass = 'trail-stone';
            if (isDone) stoneClass += ' stone-completed';
            if (isCurrent) stoneClass += ' stone-current';

            return (
              <React.Fragment key={qIdx}>
                {qIdx > 0 && <div className={`trail-line ${qIdx <= currentIndex ? 'line-active' : ''}`} />}
                <div className={stoneClass}>
                  {isDone ? (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  ) : (
                    <span>{qIdx + 1}</span>
                  )}
                </div>
              </React.Fragment>
            );
          })}
        </div>

        {/* Current Quiz Coins Earned Indicator */}
        <div className="quiz-session-coins">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" fill="#facc15" stroke="#ca8a04" strokeWidth="2" />
            <circle cx="12" cy="12" r="7" stroke="#eab308" strokeWidth="1.5" strokeDasharray="3 2" />
          </svg>
          <span>+{sessionRewardsRef.current.coins}</span>
        </div>
      </div>

      {/* ─── Quiz Arena Main Row: Question Card + Cheering Companion ─── */}
      <div className="quiz-arena-row">
        {/* Main Question Card with Visual Counting Board */}
        <div className="quiz-play-card" aria-live="polite">
          {/* Interactive Visual Counter (Touch-to-Count tokens) */}
          <MathVisualCounter questionText={currentQ.questionText || currentQ.prompt} />

          {/* Read Aloud Audio Assist Button */}
          {isSupported && (
            <button
              type="button"
              className="speech-assist-btn"
              onClick={() => speak(currentQ.questionText)}
              aria-label="Read question out loud"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
              </svg>
              <span>Listen</span>
            </button>
          )}

          {/* 4 Chunky Tactile 3D Toy Answer Buttons */}
          <div className="tactile-options-grid" role="group" aria-label="Answer options">
            {currentQ.options.map((opt, idx) => {
              const isSelected = selectedOption === idx;
              const isCorrect = isSelected && feedbackState === 'correct';
              const isRetried = retryOptions.has(idx);

              let btnClass = `toy-option-btn color-slot-${idx % 4}`;
              if (isCorrect) btnClass += ' state-correct';
              if (isRetried) btnClass += ' state-incorrect';

              return (
                <button
                  key={`${currentIndex}-${idx}`}
                  type="button"
                  className={btnClass}
                  disabled={isAdvancing || isRetried}
                  onClick={() => handleSelectOption(idx)}
                  aria-label={`Option ${idx + 1}: ${opt}`}
                >
                  <span className="toy-option-text">{opt}</span>
                  {isCorrect && (
                    <span className="toy-option-icon check-icon" aria-hidden="true">
                      ✓
                    </span>
                  )}
                  {isRetried && (
                    <span className="toy-option-icon retry-icon" aria-hidden="true">
                      ↺
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Dynamic Tactile Feedback Banner */}
          {feedbackState === 'correct' && (
            <div className="child-feedback-banner correct" role="status">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="#eab308">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
              <span>Woohoo! Awesome Job!</span>
            </div>
          )}

          {feedbackState === 'retry' && (
            <div className="child-feedback-banner retry" role="status">
              <span>💡 Almost! Tap the items to count or try another answer!</span>
            </div>
          )}
        </div>

        {/* Cheering 3D Pet Companion Corner */}
        {profile.petType && (
          <aside className="quiz-companion-dock" aria-label="Your Cheering Companion">
            <div className="companion-speech-bubble">
              {feedbackState === 'correct'
                ? 'Yay! You got it right! 🎉'
                : feedbackState === 'retry'
                ? 'You can do it! Try again! 💪'
                : 'I believe in you! 🐾'}
            </div>
            <div className="companion-canvas-wrapper">
              <PetCanvas3D
                petType={profile.petType}
                growthStage={profile.growthStage}
                equippedItems={profile.equippedItems || {}}
                isCelebrating={celebratePet}
                width={190}
                height={190}
              />
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
