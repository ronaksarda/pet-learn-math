import { describe, it, expect } from 'vitest';
import { SHOP_ITEMS, getShopItemsForPet } from '../src/data/shopItems.js';

describe('Pet Math Academy Economy Calibration (TDD)', () => {
  // Coin rewards per question and perfect bonus
  const QUIZ_ECONOMY = {
    easy: { perQuestion: 2, count: 5, perfectBonus: 5 },
    medium: { perQuestion: 4, count: 5, perfectBonus: 8 },
    hard: { perQuestion: 6, count: 5, perfectBonus: 12 }
  };

  const maxSingleHardQuestionCoins = QUIZ_ECONOMY.hard.perQuestion;
  const maxSingleHardQuizTotal = (QUIZ_ECONOMY.hard.perQuestion * QUIZ_ECONOMY.hard.count) + QUIZ_ECONOMY.hard.perfectBonus;

  it('ensures no shop item costs less than 120 coins', () => {
    SHOP_ITEMS.forEach((item) => {
      expect(item.price).toBeGreaterThanOrEqual(120);
    });
  });

  it('guarantees a single hard question can NEVER afford any shop item', () => {
    SHOP_ITEMS.forEach((item) => {
      expect(maxSingleHardQuestionCoins).toBeLessThan(item.price);
    });
  });

  it('guarantees even a full perfect hard quiz cannot instantly buy any shop item without multiple sessions', () => {
    // 6 * 5 + 12 = 42 coins. The cheapest item must be at least 120 coins (requires ~3 quizzes).
    SHOP_ITEMS.forEach((item) => {
      expect(maxSingleHardQuizTotal).toBeLessThan(item.price);
    });
  });

  it('verifies background room themes cost at least 450 coins', () => {
    const backgrounds = SHOP_ITEMS.filter(item => item.category === 'Backgrounds');
    expect(backgrounds.length).toBeGreaterThan(0);
    backgrounds.forEach((bg) => {
      expect(bg.price).toBeGreaterThanOrEqual(450);
    });
  });

  it('verifies legendary items cost at least 800 coins', () => {
    const legendary = SHOP_ITEMS.filter(item => item.id.includes('rainbow_glow'));
    expect(legendary.length).toBeGreaterThan(0);
    legendary.forEach((item) => {
      expect(item.price).toBeGreaterThanOrEqual(800);
    });
  });

  it('ensures every pet has balanced accessory tiers', () => {
    ['dog', 'cat', 'penguin', 'unicorn'].forEach((petType) => {
      const items = getShopItemsForPet(petType).filter(i => i.category === 'Accessories');
      expect(items.length).toBeGreaterThanOrEqual(5);
      const prices = items.map(i => i.price);
      expect(Math.min(...prices)).toBeGreaterThanOrEqual(120);
      expect(Math.max(...prices)).toBeGreaterThanOrEqual(350);
    });
  });
});
