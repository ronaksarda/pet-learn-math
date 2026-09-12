import { describe, it, expect } from 'vitest';
import { ACCESSORY_POSITIONS, SHOP_ITEMS } from '../src/data/shopItems.js';

describe('Pet Display & Accessory Configurations (TDD)', () => {
  const PET_TYPES = ['dog', 'cat', 'penguin', 'unicorn'];

  it('defines valid accessory positions for all 4 supported pets', () => {
    PET_TYPES.forEach((pet) => {
      expect(ACCESSORY_POSITIONS[pet]).toBeDefined();
      expect(ACCESSORY_POSITIONS[pet].hat).toBeDefined();
      expect(ACCESSORY_POSITIONS[pet].hat.top).toMatch(/%/);
      expect(ACCESSORY_POSITIONS[pet].hat.left).toMatch(/%/);
      expect(ACCESSORY_POSITIONS[pet].hat.width).toMatch(/%/);
    });
  });

  it('ensures all shop items of category Accessories map to valid positions for their pet types', () => {
    const accessories = SHOP_ITEMS.filter((item) => item.category === 'Accessories');
    accessories.forEach((item) => {
      item.petTypes.forEach((petType) => {
        const petConfig = ACCESSORY_POSITIONS[petType];
        expect(petConfig).toBeDefined();
        expect(petConfig[item.accessoryType]).toBeDefined();
        expect(petConfig[item.accessoryType].top).toBeDefined();
        expect(petConfig[item.accessoryType].left).toBeDefined();
        expect(petConfig[item.accessoryType].width).toBeDefined();
      });
    });
  });

  it('ensures every accessory item has a valid assetUrl', () => {
    const accessories = SHOP_ITEMS.filter((item) => item.category === 'Accessories');
    accessories.forEach((item) => {
      expect(item.assetUrl).toBeDefined();
      expect(item.assetUrl.startsWith('/assets/items/')).toBe(true);
    });
  });
});
