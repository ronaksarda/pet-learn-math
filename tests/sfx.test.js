import { describe, it, expect, vi } from 'vitest';
import { playCorrect, playRetry, playFanfare, playClick, initAudio } from '../src/utils/sfx.js';

describe('SFX Web Audio System', () => {
  it('handles environment without AudioContext gracefully without throwing', () => {
    // In node/vitest, AudioContext is undefined by default
    expect(() => playCorrect()).not.toThrow();
    expect(() => playRetry()).not.toThrow();
    expect(() => playFanfare()).not.toThrow();
    expect(() => playClick()).not.toThrow();
  });

  it('plays sounds when mock AudioContext is present', () => {
    const mockOscillator = {
      connect: vi.fn(),
      start: vi.fn(),
      stop: vi.fn(),
      frequency: { setValueAtTime: vi.fn(), exponentialRampToValueAtTime: vi.fn() },
      type: 'sine'
    };

    const mockGain = {
      connect: vi.fn(),
      gain: {
        setValueAtTime: vi.fn(),
        linearRampToValueAtTime: vi.fn(),
        exponentialRampToValueAtTime: vi.fn()
      }
    };

    const mockCtx = {
      currentTime: 0,
      state: 'running',
      resume: vi.fn().mockResolvedValue(),
      createOscillator: vi.fn().mockReturnValue(mockOscillator),
      createGain: vi.fn().mockReturnValue(mockGain),
      destination: {}
    };

    global.window = global.window || {};
    global.window.AudioContext = vi.fn().mockImplementation(() => mockCtx);

    initAudio();
    expect(() => playCorrect()).not.toThrow();
    expect(() => playRetry()).not.toThrow();
    expect(() => playFanfare()).not.toThrow();
    expect(() => playClick()).not.toThrow();

    expect(mockCtx.createOscillator).toHaveBeenCalled();
  });
});
