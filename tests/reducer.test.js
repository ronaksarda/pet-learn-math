import { describe, it, expect } from 'vitest';
import {
  calculateGrowthStage,
  profileReducer,
  initialProfileState
} from '../src/context/profileReducer.js';

describe('Profile Reducer & Growth Stages (TDD)', () => {
  describe('calculateGrowthStage', () => {
    it('returns "baby" for XP in 0..49', () => {
      expect(calculateGrowthStage(0)).toBe('baby');
      expect(calculateGrowthStage(25)).toBe('baby');
      expect(calculateGrowthStage(49)).toBe('baby');
    });

    it('returns "young" for XP in 50..149', () => {
      expect(calculateGrowthStage(50)).toBe('young');
      expect(calculateGrowthStage(100)).toBe('young');
      expect(calculateGrowthStage(149)).toBe('young');
    });

    it('returns "grown" for XP in 150..299', () => {
      expect(calculateGrowthStage(150)).toBe('grown');
      expect(calculateGrowthStage(220)).toBe('grown');
      expect(calculateGrowthStage(299)).toBe('grown');
    });

    it('returns "companion" for XP >= 300', () => {
      expect(calculateGrowthStage(300)).toBe('companion');
      expect(calculateGrowthStage(500)).toBe('companion');
    });
  });

  describe('profileReducer Actions', () => {
    it('SELECT_PET sets the petType permanently', () => {
      const state = initialProfileState;
      const next = profileReducer(state, { type: 'SELECT_PET', payload: 'dog' });
      expect(next.petType).toBe('dog');
    });

    it('ADD_COINS increases coin balance correctly', () => {
      const state = { ...initialProfileState, coins: 20 };
      const next = profileReducer(state, { type: 'ADD_COINS', payload: 15 });
      expect(next.coins).toBe(35);
    });

    it('ADD_XP increases XP and recalculates growthStage', () => {
      const state = { ...initialProfileState, totalXP: 45, growthStage: 'baby' };
      const next = profileReducer(state, { type: 'ADD_XP', payload: 10 });
      expect(next.totalXP).toBe(55);
      expect(next.growthStage).toBe('young');
    });

    it('BUY_ITEM deducts coins and appends item id to ownedItems', () => {
      const state = { ...initialProfileState, coins: 50, ownedItems: [] };
      const next = profileReducer(state, {
        type: 'BUY_ITEM',
        payload: { itemId: 'dog-hat', price: 25 }
      });
      expect(next.coins).toBe(25);
      expect(next.ownedItems).toContain('dog-hat');
    });

    it('EQUIP_ITEM and UNEQUIP_ITEM manage accessories and backgrounds', () => {
      let state = {
        ...initialProfileState,
        ownedItems: ['dog-hat', 'bg-park', 'bg-space'],
        equippedItems: []
      };

      // Equip hat
      state = profileReducer(state, {
        type: 'EQUIP_ITEM',
        payload: { itemId: 'dog-hat', category: 'Accessories' }
      });
      expect(state.equippedItems).toContain('dog-hat');

      // Equip background 1
      state = profileReducer(state, {
        type: 'EQUIP_ITEM',
        payload: { itemId: 'bg-park', category: 'Backgrounds' }
      });
      expect(state.equippedItems).toContain('bg-park');

      // Equip background 2 replaces background 1
      state = profileReducer(state, {
        type: 'EQUIP_ITEM',
        payload: { itemId: 'bg-space', category: 'Backgrounds' }
      });
      expect(state.equippedItems).toContain('bg-space');
      expect(state.equippedItems).not.toContain('bg-park');
      expect(state.equippedItems).toContain('dog-hat');

      // Unequip hat
      state = profileReducer(state, {
        type: 'UNEQUIP_ITEM',
        payload: { itemId: 'dog-hat' }
      });
      expect(state.equippedItems).not.toContain('dog-hat');
    });

    it('COMPLETE_CHAPTER marks difficulty as completed', () => {
      const state = initialProfileState;
      const next = profileReducer(state, {
        type: 'COMPLETE_CHAPTER',
        payload: { chapterKey: 'counting', difficulty: 'easy' }
      });
      expect(next.chapterProgress.counting.easy).toBe(true);
      expect(next.chapterProgress.counting.medium).toBe(false);
    });

    it('UPDATE_SETTINGS merges comfort settings', () => {
      const state = initialProfileState;
      const next = profileReducer(state, {
        type: 'UPDATE_SETTINGS',
        payload: { highContrast: true, textSize: 'large' }
      });
      expect(next.comfortSettings.highContrast).toBe(true);
      expect(next.comfortSettings.textSize).toBe('large');
      expect(next.comfortSettings.reducedMotion).toBe(false); // remains unchanged
    });

    it('SET_GRADE stores the selected grade level', () => {
      const state = initialProfileState;
      const next = profileReducer(state, { type: 'SET_GRADE', payload: '3' });
      expect(next.grade).toBe('3');
    });

    it('SET_GRADE can be set to null for all grades', () => {
      const state = { ...initialProfileState, grade: '2' };
      const next = profileReducer(state, { type: 'SET_GRADE', payload: null });
      expect(next.grade).toBe(null);
    });

    it('RECORD_QUIZ_COMPLETION sets streak to 1 on first play', () => {
      const state = initialProfileState;
      const next = profileReducer(state, { type: 'RECORD_QUIZ_COMPLETION' });
      expect(next.streak).toBe(1);
      expect(next.totalQuizzes).toBe(1);
      expect(next.lastPlayDate).toBeTruthy();
    });

    it('RECORD_QUIZ_COMPLETION keeps streak on same-day play', () => {
      const today = new Date().toISOString().slice(0, 10);
      const state = { ...initialProfileState, streak: 3, lastPlayDate: today, totalQuizzes: 5 };
      const next = profileReducer(state, { type: 'RECORD_QUIZ_COMPLETION' });
      expect(next.streak).toBe(3); // same day, no increment
      expect(next.totalQuizzes).toBe(6);
    });

    it('RECORD_QUIZ_COMPLETION resets streak after gap', () => {
      const state = { ...initialProfileState, streak: 5, lastPlayDate: '2024-01-01', totalQuizzes: 10 };
      const next = profileReducer(state, { type: 'RECORD_QUIZ_COMPLETION' });
      expect(next.streak).toBe(1); // gap > 1 day
      expect(next.totalQuizzes).toBe(11);
    });
  });
});
