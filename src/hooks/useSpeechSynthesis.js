/**
 * src/hooks/useSpeechSynthesis.js
 * 
 * High-quality Speech Synthesis hook for early childhood & accessible math learning.
 * Features:
 * - Natural human voice auto-discovery (filters for Google US English, Samantha, Natural, Premium).
 * - Comprehensive math phonetics translator (converts fractions, formulas, money, and operations into warm spoken English).
 * - Calibrated, non-robotic pitch (1.0) and comfortable cadence (0.92) designed for kids & ADHD/auditory learners.
 * - Automatic voice cleanup on unmount to eliminate ghost audio.
 */

import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Phonetically translates math strings into natural spoken child-friendly English.
 */
export function formatMathForSpeech(text) {
  if (!text) return '';

  let spoken = String(text);

  // 1. Remove visual emojis
  spoken = spoken.replace(
    /([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g,
    ''
  );

  // 2. Clean punctuation placeholders
  spoken = spoken
    .replace(/\[\s*\?\s*\]/g, 'blank')
    .replace(/___+/g, 'blank')
    .replace(/\n+/g, '. ')
    .replace(/\s+/g, ' ');

  // 3. Formula expansions
  spoken = spoken
    .replace(/\(P\s*=\s*2l\s*\+\s*2w\)/gi, 'Perimeter equals 2 times length plus 2 times width')
    .replace(/\(V\s*=\s*l\s*[×*]\s*w\s*[×*]\s*h\)/gi, 'Volume equals length times width times height')
    .replace(/\(Area\s*=\s*length\s*[×*]\s*width\)/gi, 'Area equals length times width')
    .replace(/\((\d+),\s*(\d+)\)/g, 'coordinates $1, $2');

  // 4. Units & Currency
  spoken = spoken
    .replace(/(\d+)\s*¢/g, '$1 cents')
    .replace(/\$(\d+(?:\.\d{2})?)/g, '$1 dollars')
    .replace(/sq units/gi, 'square units')
    .replace(/cubic cm/gi, 'cubic centimeters');

  // 5. Common Early-grade Fractions
  const fractionMap = {
    '1/2': 'one half',
    '1/3': 'one third',
    '2/3': 'two thirds',
    '1/4': 'one fourth',
    '2/4': 'two fourths',
    '3/4': 'three fourths',
    '1/5': 'one fifth',
    '2/5': 'two fifths',
    '3/5': 'three fifths',
    '4/5': 'four fifths',
    '1/6': 'one sixth',
    '2/6': 'two sixths',
    '3/6': 'three sixths',
    '4/6': 'four sixths',
    '5/6': 'five sixths',
    '1/8': 'one eighth',
    '2/8': 'two eighths',
    '3/8': 'three eighths',
    '4/8': 'four eighths',
    '5/8': 'five eighths',
    '6/8': 'six eighths',
    '7/8': 'seven eighths',
    '1/10': 'one tenth',
    '2/10': 'two tenths',
    '3/10': 'three tenths',
    '4/10': 'four tenths',
    '5/10': 'five tenths',
    '7/10': 'seven tenths',
    '9/10': 'nine tenths',
    '1/12': 'one twelfth',
    '2/12': 'two twelfths',
    '3/12': 'three twelfths',
    '4/12': 'four twelfths',
    '6/12': 'six twelfths',
    '9/12': 'nine twelfths'
  };

  // Mixed numbers like "2 1/3" -> "2 and one third"
  spoken = spoken.replace(/(\d+)\s+(\d+\/\d+)/g, (match, whole, frac) => {
    return `${whole} and ${fractionMap[frac] || frac.replace('/', ' over ')}`;
  });

  // Standalone fractions
  Object.keys(fractionMap).forEach((frac) => {
    const regex = new RegExp(`\\b${frac}\\b`, 'g');
    spoken = spoken.replace(regex, fractionMap[frac]);
  });

  // Remaining generic fractions: "a/b" -> "a over b"
  spoken = spoken.replace(/(\d+)\/(\d+)/g, '$1 over $2');

  // 6. Math Operators
  spoken = spoken
    .replace(/[×*]/g, ' times ')
    .replace(/÷/g, ' divided by ')
    .replace(/\+/g, ' plus ')
    .replace(/-/g, ' minus ')
    .replace(/=/g, ' equals ')
    .replace(/</g, ' is less than ')
    .replace(/>/g, ' is greater than ');

  return spoken.replace(/\s+/g, ' ').trim();
}

export function useSpeechSynthesis() {
  const isSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;
  const isSpeakingRef = useRef(false);
  const [preferredVoice, setPreferredVoice] = useState(null);

  // Discover highest-quality warm English voice
  useEffect(() => {
    if (!isSupported) return;

    const pickBestVoice = () => {
      const voices = window.speechSynthesis.getVoices();
      if (!voices || voices.length === 0) return;

      // Priority list of warm, clear, friendly English voices
      const voicePreference = [
        (v) => v.lang.startsWith('en') && /Google.*English/i.test(v.name),
        (v) => v.lang.startsWith('en') && /Samantha/i.test(v.name),
        (v) => v.lang.startsWith('en') && /Victoria/i.test(v.name),
        (v) => v.lang.startsWith('en') && /Jenny|Aria|Guy|Natural/i.test(v.name),
        (v) => v.lang.startsWith('en') && /Karen|Daniel/i.test(v.name),
        (v) => v.lang === 'en-US',
        (v) => v.lang.startsWith('en')
      ];

      for (const matcher of voicePreference) {
        const found = voices.find(matcher);
        if (found) {
          setPreferredVoice(found);
          break;
        }
      }
    };

    pickBestVoice();
    window.speechSynthesis.onvoiceschanged = pickBestVoice;

    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.onvoiceschanged = null;
      }
    };
  }, [isSupported]);

  const speak = useCallback(
    (text) => {
      if (!isSupported || !text) return;

      try {
        window.speechSynthesis.cancel();

        const cleanSpokenText = formatMathForSpeech(text);
        if (!cleanSpokenText) return;

        const utterance = new SpeechSynthesisUtterance(cleanSpokenText);

        if (preferredVoice) {
          utterance.voice = preferredVoice;
        }

        // Child-friendly warm acoustic calibration
        utterance.rate = 0.92; // Slightly measured, distinct pronunciation
        utterance.pitch = 1.0; // Natural warm pitch (no robotic screech)
        utterance.volume = 1.0;

        utterance.onstart = () => {
          isSpeakingRef.current = true;
        };
        utterance.onend = () => {
          isSpeakingRef.current = false;
        };
        utterance.onerror = () => {
          isSpeakingRef.current = false;
        };

        window.speechSynthesis.speak(utterance);
      } catch (err) {
        console.warn('[useSpeechSynthesis] Speech synthesis failed:', err);
      }
    },
    [isSupported, preferredVoice]
  );

  const cancel = useCallback(() => {
    if (isSupported) {
      window.speechSynthesis.cancel();
      isSpeakingRef.current = false;
    }
  }, [isSupported]);

  // Clean up on component unmount
  useEffect(() => {
    return () => {
      if (isSupported) {
        window.speechSynthesis.cancel();
      }
    };
  }, [isSupported]);

  return { speak, cancel, isSupported };
}
