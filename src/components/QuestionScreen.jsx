/**
 * src/components/QuestionScreen.jsx
 * 
 * Child-friendly, tactile math quiz arena.
 * Includes interactive SVG counting board, stepping stone progress trail,
 * active 3D cheering pet companion, 3D toy-block answer buttons,
 * per-question timer, and AI-powered hints (via Groq).
 * 
 * HOOKS USED:
 * - useState: Manages quiz state (current question, feedback, retry tracking).
 *   Each piece of state triggers a targeted re-render when it changes.
 * - useEffect: Syncs side effects (voice read-aloud, timer ticking) with
 *   the current question index. Cleaned up automatically on unmount.
 * - useRef: Stores mutable values (session rewards, timer interval) that
 *   persist across renders WITHOUT causing re-renders when mutated.
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useProfile } from '../context/ProfileContext.jsx';
import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis.js';
import { generateChapterQuestions } from '../data/questions.js';
import { generateSmartMathHint } from '../utils/mathHints.js';
import { playCorrect, playRetry, playClick } from '../utils/sfx.js';
import MathVisualCounter from './MathVisualCounter.jsx';
import PetCanvas3D from './PetCanvas3D.jsx';
import MathScratchpad from './MathScratchpad.jsx';

// Calibrated coin & XP rewards per question
const COIN_REWARDS = { easy: 2, medium: 4, hard: 6 };
const XP_REWARDS = { easy: 5, medium: 10, hard: 15 };
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
  const { profile, addCoins, addXP, completeChapter, recordQuizCompletion } = useProfile();
  const { speak, isSupported } = useSpeechSynthesis();

  // Generate 5 questions once on component mount
  const [questions, setQuestions] = useState(() => {
    return generateChapterQuestions(chapterKey, difficulty, 5);
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [feedbackState, setFeedbackState] = useState(null); // 'correct' | 'retry' | null
  const [retryOptions, setRetryOptions] = useState(new Set());
  const [isAdvancing, setIsAdvancing] = useState(false);
  const [celebratePet, setCelebratePet] = useState(false);

  // Contextual smart hint state
  const [hintText, setHintText] = useState(null);
  // In-quiz interactive math scratchpad
  const [showScratchpad, setShowScratchpad] = useState(false);

  // Per-question timer
  const [elapsed, setElapsed] = useState(0);
  const timerRef = useRef(null);

  // Cumulative session reward tracking
  const sessionRewardsRef = useRef({ coins: 0, xp: 0, firstTryCorrect: 0 });

  const currentQ = questions[currentIndex];

  // Start/restart timer & reset hint on each new question
  useEffect(() => {
    setElapsed(0);
    setHintText(null);
    timerRef.current = setInterval(() => {
      setElapsed((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [currentIndex]);

  // Auto-trigger voice read-aloud when question mounts
  useEffect(() => {
    if (currentQ && profile.comfortSettings?.readAloud) {
      speak(currentQ.questionText || currentQ.prompt);
    }
  }, [currentIndex, currentQ, profile.comfortSettings?.readAloud, speak]);

  const handleRequestHint = () => {
    if (hintText) return;
    playClick();
    const smartHint = generateSmartMathHint(currentQ);
    setHintText(smartHint);
    if (profile.comfortSettings?.readAloud) {
      speak(`Hint: ${smartHint}`);
    }
  };

  const handleSkipQuestion = () => {
    if (isAdvancing) return;
    playClick();
    setIsAdvancing(true);

    if (profile.comfortSettings?.readAloud) {
      speak('Skipping to next question.');
    }

    setTimeout(() => {
      if (currentIndex < questions.length - 1) {
        setCurrentIndex((prev) => prev + 1);
        setSelectedOption(null);
        setFeedbackState(null);
        setCelebratePet(false);
        setRetryOptions(new Set());
        setIsAdvancing(false);
        setHintText(null);
      } else {
        // Complete quiz with what was earned
        const totalCoins = sessionRewardsRef.current.coins;
        const totalXP = sessionRewardsRef.current.xp;

        addCoins(totalCoins);
        addXP(totalXP);
        if (sessionRewardsRef.current.firstTryCorrect >= 3) {
          completeChapter(chapterKey, difficulty);
        }
        recordQuizCompletion();

        onCompleteQuiz({
          coinsEarned: totalCoins,
          xpEarned: totalXP,
          bonusCoins: 0,
          bonusXP: 0,
          perfectScore: false,
          chapterTitle,
          difficulty
        });
      }
    }, 400);
  };

  // Format timer as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Handle user selecting an answer
  const handleSelectOption = (index) => {
    if (isAdvancing || retryOptions.has(index)) return;

    setSelectedOption(index);
    const isFirstAttempt = retryOptions.size === 0;

    if (index === currentQ.correctIndex) {
      // ─── CORRECT ANSWER ───────────────────────────────────
      setFeedbackState('correct');
      setIsAdvancing(true);
      setCelebratePet(true);
      clearInterval(timerRef.current);
      playCorrect();

      const coinReward = COIN_REWARDS[difficulty] || 2;
      const xpReward = XP_REWARDS[difficulty] || 5;

      // Track streak bonus (+2 coins per streak day, max +10)
      const streakBonus = Math.min(10, (profile.streak || 0) * 2);
      const earnedCoins = isFirstAttempt ? coinReward + streakBonus : Math.ceil(coinReward / 2);
      const earnedXP = isFirstAttempt ? xpReward : Math.ceil(xpReward / 2);

      sessionRewardsRef.current.coins += earnedCoins;
      sessionRewardsRef.current.xp += earnedXP;
      if (isFirstAttempt) {
        sessionRewardsRef.current.firstTryCorrect += 1;
      }

      if (onTriggerCelebrate) onTriggerCelebrate();

      if (profile.comfortSettings?.readAloud) {
        speak('Great job!');
      }

      // Brief delay before advancing
      setTimeout(() => {
        if (currentIndex < questions.length - 1) {
          setCurrentIndex((prev) => prev + 1);
          setSelectedOption(null);
          setFeedbackState(null);
          setCelebratePet(false);
          setRetryOptions(new Set());
          setIsAdvancing(false);
          setHintText(null);
        } else {
          // Finished all questions!
          const perfect = sessionRewardsRef.current.firstTryCorrect === 5;
          const bonus = perfect ? PERFECT_BONUS[difficulty] || { coins: 5, xp: 5 } : { coins: 0, xp: 0 };

          const totalCoins = sessionRewardsRef.current.coins + bonus.coins;
          const totalXP = sessionRewardsRef.current.xp + bonus.xp;

          // Commit rewards to global profile context
          addCoins(totalCoins);
          addXP(totalXP);
          completeChapter(chapterKey, difficulty);
          recordQuizCompletion();

          onCompleteQuiz({
            coinsEarned: totalCoins,
            xpEarned: totalXP,
            bonusCoins: bonus.coins,
            bonusXP: bonus.xp,
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
      playRetry();

      if (profile.comfortSettings?.readAloud) {
        speak('Almost! Try counting again.');
      }
    }
  };

  // ─── KEYBOARD & SWITCH ACCESSIBILITY SHORTCUTS ─────────────────
  // Keys 1-4 for answers, H for hint, S for skip, Space for audio
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ignore when focused in text inputs
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target?.tagName)) return;

      if (['1', '2', '3', '4'].includes(e.key)) {
        const optIndex = parseInt(e.key, 10) - 1;
        if (currentQ && optIndex < currentQ.options.length) {
          e.preventDefault();
          handleSelectOption(optIndex);
        }
      } else if (e.key.toLowerCase() === 'h') {
        e.preventDefault();
        handleRequestHint();
      } else if (e.key.toLowerCase() === 's') {
        e.preventDefault();
        handleSkipQuestion();
      } else if (e.key === ' ' || e.key === 'Spacebar') {
        e.preventDefault();
        if (isSupported && currentQ) {
          speak(currentQ.questionText || currentQ.prompt);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentQ, isAdvancing, retryOptions, hintText, isSupported, speak, currentIndex]);

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

        {/* Timer & Coins */}
        <div className="quiz-top-right">
          <div className="quiz-timer" title="Time on this question">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            <span>{formatTime(elapsed)}</span>
          </div>
          <div className="quiz-session-coins">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" fill="#facc15" stroke="#ca8a04" strokeWidth="2" />
              <circle cx="12" cy="12" r="7" stroke="#eab308" strokeWidth="1.5" strokeDasharray="3 2" />
            </svg>
            <span>+{sessionRewardsRef.current.coins}</span>
          </div>
        </div>
      </div>

      {/* ─── Quiz Arena Main Row: Question Card + Cheering Companion ─── */}
      <div className="quiz-arena-row">
        {/* Main Question Card with Visual Counting Board */}
        <div className="quiz-play-card" aria-live="polite">
          {/* Interactive Visual Counter */}
          <MathVisualCounter questionText={currentQ.questionText || currentQ.prompt} />

          {/* Button Row: Read Aloud + Hint + Skip + Scratchpad */}
          <div className="quiz-assist-row">
            {isSupported && (
              <button
                type="button"
                className="speech-assist-btn"
                onClick={() => speak(currentQ.questionText)}
                aria-label="Read question out loud (Keyboard: Space)"
                title="Read out loud [Space]"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                  <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                  <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                </svg>
                <span>Listen</span>
              </button>
            )}

            <button
              type="button"
              className="hint-assist-btn"
              onClick={handleRequestHint}
              disabled={!!hintText}
              aria-label="Get a hint (Keyboard: H)"
              title="Get a hint [H]"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
              <span>{hintText ? 'Hint Given' : 'Get Hint'}</span>
            </button>

            <button
              type="button"
              className="skip-assist-btn"
              onClick={handleSkipQuestion}
              disabled={isAdvancing}
              aria-label="Skip this question (Keyboard: S)"
              title="Skip to next question [S]"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="5 4 15 12 5 20 5 4" />
                <line x1="19" y1="5" x2="19" y2="19" />
              </svg>
              <span>Skip</span>
            </button>

            <button
              type="button"
              className={`scratchpad-assist-btn ${showScratchpad ? 'active' : ''}`}
              onClick={() => {
                playClick();
                setShowScratchpad((prev) => !prev);
              }}
              aria-label="Toggle scratchpad drawing canvas"
              title="Draw math work & tally marks"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 20h9" />
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
              </svg>
              <span>{showScratchpad ? 'Close Pad' : 'Scratchpad'}</span>
            </button>
          </div>

          {/* In-Quiz Interactive Scratchpad */}
          <MathScratchpad isOpen={showScratchpad} onClose={() => setShowScratchpad(false)} />

          {/* Hint Display */}
          {hintText && (
            <div className="ai-hint-bubble" role="status">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="16" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12.01" y2="8" />
              </svg>
              <p>{hintText}</p>
            </div>
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
                  <span className="toy-key-badge" aria-hidden="true">{idx + 1}</span>
                  <span className="toy-option-text">{opt}</span>
                  {isCorrect && (
                    <span className="toy-option-icon check-icon" aria-hidden="true">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </span>
                  )}
                  {isRetried && (
                    <span className="toy-option-icon retry-icon" aria-hidden="true">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="1 4 1 10 7 10" />
                        <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
                      </svg>
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
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="16" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12.01" y2="8" />
              </svg>
              <span>Almost! Tap the items to count or try another answer!</span>
            </div>
          )}
        </div>

        {/* Cheering 3D Pet Companion Corner */}
        {profile.petType && (
          <aside className="quiz-companion-dock" aria-label="Your Cheering Companion">
            <div className="companion-speech-bubble">
              {feedbackState === 'correct'
                ? 'Yay! You got it right!'
                : feedbackState === 'retry'
                ? 'You can do it! Try again!'
                : 'I believe in you!'}
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
