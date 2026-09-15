/**
 * src/context/ProfileContext.jsx
 * 
 * Global state container for Pet Math Academy.
 * Combines React Context API + useReducer + useLocalStorage.
 * 
 * ──────────────────────────────────────────────────────────────────────────
 * HOW CONTEXT + useReducer AVOIDS "PROP-DRILLING"
 * ──────────────────────────────────────────────────────────────────────────
 * In React, data normally flows downwards via props. In an app with a deep component
 * hierarchy (e.g., App -> Dashboard -> ChapterMap -> ChapterNode), sharing the learner's
 * coin balance or pet type would require passing those props through every intermediate
 * component, even if those components don't care about the coins or pet. This is called
 * "prop-drilling", and it makes refactoring painful and components fragile.
 * 
 * React Context creates a "teleportation tunnel":
 * - `ProfileContext.Provider` wraps the top of the tree and holds the state and dispatch.
 * - Any child component at ANY depth can call `useProfile()` to immediately read state
 *   or trigger actions, without intermediate components needing to know anything about it.
 * 
 * Coupling Context with `useReducer` gives us:
 * 1. Predictable state transitions defined in a centralized pure function (`profileReducer`).
 * 2. Stable action dispatchers wrapped with `useCallback` to prevent unnecessary re-renders.
 * 3. Automatic synchronization with localStorage whenever state changes.
 */

import React, { createContext, useContext, useEffect, useReducer, useState, useCallback } from 'react';
import { profileReducer, initialProfileState, calculateGrowthStage } from './profileReducer.js';

const ProfileContext = createContext(null);

export function ProfileProvider({ children }) {
  // Currently authenticated learner username
  const [currentUser, setCurrentUser] = useState(() => {
    return localStorage.getItem('petmath_active_user') || '';
  });

  // Calculate storage key from active learner name
  const storageKey = currentUser ? `petmath_${currentUser.trim().toLowerCase()}` : null;

  // Initialize reducer with stored data or defaults
  const [profile, dispatch] = useReducer(profileReducer, initialProfileState, () => {
    if (!currentUser) return initialProfileState;
    try {
      const raw = localStorage.getItem(`petmath_${currentUser.trim().toLowerCase()}`);
      if (raw) {
        const parsed = JSON.parse(raw);
        return {
          ...initialProfileState,
          ...parsed,
          growthStage: calculateGrowthStage(parsed.totalXP || 0)
        };
      }
    } catch (e) {
      console.warn('[ProfileProvider] Failed to load initial profile:', e);
    }
    return initialProfileState;
  });

  // When profile state changes, persist to localStorage
  useEffect(() => {
    if (!storageKey || !currentUser) return;
    try {
      localStorage.setItem(storageKey, JSON.stringify(profile));
    } catch (err) {
      console.warn('[ProfileProvider] Failed to save profile to localStorage:', err);
    }
  }, [profile, storageKey, currentUser]);

  // Handle switching learner profile
  const loginProfile = useCallback((name) => {
    const trimmed = name.trim().toLowerCase();
    if (!trimmed) return;

    localStorage.setItem('petmath_active_user', trimmed);
    setCurrentUser(trimmed);

    const key = `petmath_${trimmed}`;
    let loadedProfile = initialProfileState;
    try {
      const raw = localStorage.getItem(key);
      if (raw) {
        loadedProfile = JSON.parse(raw);
      } else {
        localStorage.setItem(key, JSON.stringify(initialProfileState));
      }
    } catch (e) {
      console.warn('[ProfileProvider] Error loading profile for', trimmed, e);
    }

    dispatch({ type: 'SET_PROFILE', payload: loadedProfile });
  }, []);

  // Handle logging out
  const logout = useCallback(() => {
    localStorage.removeItem('petmath_active_user');
    setCurrentUser('');
    dispatch({ type: 'RESET_PROFILE' });
  }, []);

  // Helper action dispatchers
  const selectPet = useCallback((petType) => {
    dispatch({ type: 'SELECT_PET', payload: petType });
  }, []);

  const addCoins = useCallback((amount) => {
    dispatch({ type: 'ADD_COINS', payload: amount });
  }, []);

  const addXP = useCallback((amount) => {
    dispatch({ type: 'ADD_XP', payload: amount });
  }, []);

  const buyItem = useCallback((itemId, price) => {
    dispatch({ type: 'BUY_ITEM', payload: { itemId, price } });
  }, []);

  const equipItem = useCallback((itemId, category) => {
    dispatch({ type: 'EQUIP_ITEM', payload: { itemId, category } });
  }, []);

  const unequipItem = useCallback((itemId) => {
    dispatch({ type: 'UNEQUIP_ITEM', payload: { itemId } });
  }, []);

  const completeChapter = useCallback((chapterKey, difficulty) => {
    dispatch({ type: 'COMPLETE_CHAPTER', payload: { chapterKey, difficulty } });
  }, []);

  const updateSettings = useCallback((partialSettings) => {
    dispatch({ type: 'UPDATE_SETTINGS', payload: partialSettings });
  }, []);

  const setGrade = useCallback((grade) => {
    dispatch({ type: 'SET_GRADE', payload: grade });
  }, []);

  const recordQuizCompletion = useCallback(() => {
    dispatch({ type: 'RECORD_QUIZ_COMPLETION' });
  }, []);

  const value = {
    currentUser,
    profile,
    dispatch,
    loginProfile,
    logout,
    selectPet,
    addCoins,
    addXP,
    buyItem,
    equipItem,
    unequipItem,
    completeChapter,
    updateSettings,
    setGrade,
    recordQuizCompletion
  };

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
}

/**
 * Custom hook to consume the ProfileContext.
 * Throws a helpful error if called outside of a ProfileProvider.
 */
export function useProfile() {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
}
