/**
 * src/hooks/useSpeechSynthesis.js
 * 
 * Custom hook providing an interface to the Web Speech API (window.speechSynthesis).
 * 
 * WHY USE A CUSTOM HOOK FOR WEB APIs?
 * 1. Encapsulation: Handles browser differences, missing browser support, and cancellation
 *    safely without cluttering visual components.
 * 2. Cleanup: Cancels any active speech when components unmount to prevent ghostly audio
 *    playing in the background when the user navigates away.
 */

import { useCallback, useEffect, useRef } from 'react';

export function useSpeechSynthesis() {
  const isSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;
  const isSpeakingRef = useRef(false);

  const speak = useCallback((text) => {
    if (!isSupported || !text) return;

    try {
      // Cancel any ongoing speech before starting new sentence
      window.speechSynthesis.cancel();

      // Filter out raw emojis from spoken text for better audio clarity
      const cleanText = text
        .replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, '')
        .replace(/×/g, 'times')
        .replace(/÷/g, 'divided by')
        .replace(/\+/g, 'plus')
        .replace(/-/g, 'minus')
        .replace(/=/g, 'equals')
        .replace(/\//g, ' over ');

      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = 0.9; // Slightly slower, friendly pace for kids
      utterance.pitch = 1.1; // Warm, friendly tone

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
      console.warn('[useSpeechSynthesis] Speech failed:', err);
    }
  }, [isSupported]);

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
