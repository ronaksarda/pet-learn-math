/**
 * src/utils/sfx.js
 * 
 * Zero-dependency kid-friendly synthesized sound effects using native Web Audio API.
 * Instant response, works offline, no external audio assets required.
 */

let audioCtx = null;
let soundEnabled = true;

export function setSoundEnabled(enabled) {
  soundEnabled = !!enabled;
}

export function isSoundEnabled() {
  return soundEnabled;
}

export function getAudioContext() {
  if (typeof window === 'undefined') return null;
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return null;

  if (!audioCtx) {
    try {
      audioCtx = new AudioContextClass();
    } catch {
      return null;
    }
  }

  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }

  return audioCtx;
}

export function initAudio() {
  return getAudioContext();
}

/**
 * Play a friendly single tone
 */
function playTone({ freq, duration = 0.15, type = 'sine', startTime = 0, gainLevel = 0.15 }) {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const t = ctx.currentTime + startTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, t);

    // Smooth envelope to prevent audio clipping / clicks
    gain.gain.setValueAtTime(0.001, t);
    gain.gain.linearRampToValueAtTime(gainLevel, t + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(t);
    osc.stop(t + duration);
  } catch {
    // AudioContext blocked or not allowed
  }
}

/**
 * Cheerful ascending chime for correct answer (C5 -> E5 -> G5)
 */
export function playCorrect() {
  if (!soundEnabled) return;
  const notes = [523.25, 659.25, 783.99]; // C5, E5, G5
  notes.forEach((freq, i) => {
    playTone({ freq, duration: 0.22, type: 'triangle', startTime: i * 0.08, gainLevel: 0.18 });
  });
}

/**
 * Soft, encouraging boing for retry (gentle, not harsh or penalizing)
 */
export function playRetry() {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(320, t);
    osc.frequency.exponentialRampToValueAtTime(220, t + 0.25);

    gain.gain.setValueAtTime(0.12, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.25);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(t);
    osc.stop(t + 0.25);
  } catch {}
}

/**
 * Grand fanfare when a chapter quiz is completed (C5 -> E5 -> G5 -> C6)
 */
export function playFanfare() {
  if (!soundEnabled) return;
  const notes = [
    { freq: 523.25, time: 0.0, dur: 0.18 }, // C5
    { freq: 659.25, time: 0.12, dur: 0.18 }, // E5
    { freq: 783.99, time: 0.24, dur: 0.22 }, // G5
    { freq: 1046.50, time: 0.40, dur: 0.55 } // C6 (long finish)
  ];
  notes.forEach(({ freq, time, dur }) => {
    playTone({ freq, duration: dur, type: 'triangle', startTime: time, gainLevel: 0.22 });
  });
}

/**
 * Subtle tactile tap sound for button presses
 */
export function playClick() {
  if (!soundEnabled) return;
  playTone({ freq: 440, duration: 0.04, type: 'sine', gainLevel: 0.08 });
}
