/**
 * src/hooks/useLocalStorage.js
 * 
 * Custom React hook for synchronizing state with browser localStorage.
 * 
 * ──────────────────────────────────────────────────────────────────────────
 * WHY WRAP localStorage IN A CUSTOM HOOK?
 * ──────────────────────────────────────────────────────────────────────────
 * 1. Reactivity & Re-rendering:
 *    Calling `localStorage.setItem()` directly in a component changes the browser's
 *    storage, but DOES NOT trigger a React re-render. If another component (or even
 *    the same component) relies on that stored data, the UI will become desynchronized.
 *    By wrapping it in a custom hook that couples `useState` with `localStorage`,
 *    any update triggers a standard React state update, keeping the UI completely reactive.
 * 
 * 2. Performance (Lazy Initialization):
 *    Reading from `localStorage.getItem()` is a synchronous, blocking disk I/O
 *    operation. If you call `localStorage.getItem()` inside the body of a component,
 *    it runs on EVERY single re-render. By using `useState(() => ...)` (a state
 *    initializer function), React only reads from disk ONCE during component mount.
 * 
 * 3. Error Handling & SSR/Cross-tab Safety:
 *    If the user has disabled cookies/storage, or is in strict private browsing,
 *    `localStorage` calls can throw uncaught security errors. Wrapping this in
 *    a try/catch block ensures your application degrades gracefully without crashing.
 * 
 * 4. Single Source of Truth & DRY:
 *    Instead of repeating JSON serialization (`JSON.stringify` / `JSON.parse`)
 *    in every component, the hook abstracts the serialization layer cleanly.
 */

import { useState, useEffect, useCallback } from 'react';

export function useLocalStorage(key, initialValue) {
  // 1. Lazy initializer: Only runs once when the component mounts
  const [storedValue, setStoredValue] = useState(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      // Parse stored JSON or return initialValue if none exists
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`[useLocalStorage] Error reading key "${key}":`, error);
      return initialValue;
    }
  });

  // 2. Setter function: Updates both React state and localStorage
  const setValue = useCallback(
    (value) => {
      try {
        // Allow value to be a function so we have the same API as useState: setValue(prev => ...)
        setStoredValue((prevValue) => {
          const valueToStore = value instanceof Function ? value(prevValue) : value;
          if (typeof window !== 'undefined') {
            window.localStorage.setItem(key, JSON.stringify(valueToStore));
          }
          return valueToStore;
        });
      } catch (error) {
        console.warn(`[useLocalStorage] Error saving key "${key}":`, error);
      }
    },
    [key]
  );

  // 3. Keep state in sync if the key itself changes (e.g. switching user profiles)
  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key);
      setStoredValue(item ? JSON.parse(item) : initialValue);
    } catch (error) {
      console.warn(`[useLocalStorage] Error syncing key "${key}":`, error);
      setStoredValue(initialValue);
    }
  }, [key]);

  return [storedValue, setValue];
}
