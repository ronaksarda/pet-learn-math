/**
 * src/data/shopItems.js
 * 
 * Catalog of items available in the Pet Math Academy store, along with
 * layered accessory positioning coordinates per pet type.
 */

/**
 * ACCESSORY_POSITIONS
 * 
 * Offsets used by PetDisplay.jsx to position layered accessory <img> elements
 * relative to the parent pet container.
 * 
 * NOTE: All percentage values are PLACEHOLDERS calibrated for standard 1:1 pet ratios.
 * After first render, manually adjust each value while watching the actual pet+accessory
 * combination on screen until visually aligned. This is expected manual tuning, not a bug.
 */
export const ACCESSORY_POSITIONS = {
  dog: {
    hat:     { top: '4%',  left: '26%', width: '48%' },
    bowtie:  { top: '68%', left: '33%', width: '34%' },
    glasses: { top: '34%', left: '23%', width: '54%' },
    collar:  { top: '65%', left: '28%', width: '44%' },
    bandana: { top: '62%', left: '24%', width: '52%' },
    bow:     { top: '10%', left: '46%', width: '26%' }
  },
  cat: {
    hat:     { top: '2%',  left: '26%', width: '48%' },
    bowtie:  { top: '56%', left: '35%', width: '30%' },
    glasses: { top: '27%', left: '22%', width: '56%' },
    collar:  { top: '52%', left: '28%', width: '44%' },
    bandana: { top: '50%', left: '25%', width: '50%' },
    bow:     { top: '6%',  left: '42%', width: '24%' }
  },
  penguin: {
    hat:     { top: '2%',  left: '28%', width: '44%' },
    bowtie:  { top: '52%', left: '34%', width: '32%' },
    glasses: { top: '26%', left: '25%', width: '50%' },
    collar:  { top: '48%', left: '28%', width: '44%' },
    bandana: { top: '48%', left: '26%', width: '48%' },
    bow:     { top: '6%',  left: '44%', width: '22%' }
  },
  unicorn: {
    hat:          { top: '3%',  left: '26%', width: '48%' },
    bowtie:       { top: '64%', left: '34%', width: '32%' },
    glasses:      { top: '38%', left: '24%', width: '52%' },
    collar:       { top: '60%', left: '28%', width: '44%' },
    bandana:      { top: '58%', left: '26%', width: '48%' },
    bow:          { top: '16%', left: '44%', width: '24%' },
    rainbow_glow: { top: '0%',  left: '0%',  width: '100%' }
  }
};

/**
 * SHOP_ITEMS
 * 
 * Each item has:
 * - id: unique string identifier
 * - name: user-facing display label
 * - category: 'Accessories' or 'Backgrounds'
 * - price: coin cost
 * - icon: emoji or thumbnail indicator
 * - petTypes: array of pets allowed to purchase
 * - accessoryType: matching key in ACCESSORY_POSITIONS (for Accessories)
 * - assetUrl: image URL for pet accessory layer
 */
export const SHOP_ITEMS = [
  // ─── Common / Pet-Specific Accessories ─────────────
  // Dog
  { id: 'dog-hat',     name: 'Dapper Top Hat',   category: 'Accessories', price: 380, icon: 'hat',     petTypes: ['dog'], accessoryType: 'hat',     assetUrl: '/assets/items/hat.png' },
  { id: 'dog-bowtie',  name: 'Ruby Bowtie',      category: 'Accessories', price: 140, icon: 'bowtie',  petTypes: ['dog'], accessoryType: 'bowtie',  assetUrl: '/assets/items/bowtie.png' },
  { id: 'dog-glasses', name: 'Cool Shades',      category: 'Accessories', price: 240, icon: 'glasses', petTypes: ['dog'], accessoryType: 'glasses', assetUrl: '/assets/items/glasses.png' },
  { id: 'dog-collar',  name: 'Golden Collar',    category: 'Accessories', price: 150, icon: 'collar',  petTypes: ['dog'], accessoryType: 'collar',  assetUrl: '/assets/items/collar.png' },
  { id: 'dog-bandana', name: 'Adventurer Scarf', category: 'Accessories', price: 190, icon: 'bandana', petTypes: ['dog'], accessoryType: 'bandana', assetUrl: '/assets/items/bandana.png' },
  { id: 'dog-bow',     name: 'Cheery Hair Bow',  category: 'Accessories', price: 120, icon: 'bow',     petTypes: ['dog'], accessoryType: 'bow',     assetUrl: '/assets/items/bow.png' },

  // Cat
  { id: 'cat-hat',     name: 'Magical Hat',      category: 'Accessories', price: 380, icon: 'hat',     petTypes: ['cat'], accessoryType: 'hat',     assetUrl: '/assets/items/hat.png' },
  { id: 'cat-bowtie',  name: 'Midnight Bowtie',  category: 'Accessories', price: 140, icon: 'bowtie',  petTypes: ['cat'], accessoryType: 'bowtie',  assetUrl: '/assets/items/bowtie.png' },
  { id: 'cat-glasses', name: 'Scholar Specs',    category: 'Accessories', price: 240, icon: 'glasses', petTypes: ['cat'], accessoryType: 'glasses', assetUrl: '/assets/items/glasses.png' },
  { id: 'cat-collar',  name: 'Bell Chime Collar',category: 'Accessories', price: 150, icon: 'collar',  petTypes: ['cat'], accessoryType: 'collar',  assetUrl: '/assets/items/collar.png' },
  { id: 'cat-bandana', name: 'Warm Bandana',     category: 'Accessories', price: 190, icon: 'bandana', petTypes: ['cat'], accessoryType: 'bandana', assetUrl: '/assets/items/bandana.png' },
  { id: 'cat-bow',     name: 'Sweet Ribbon',     category: 'Accessories', price: 120, icon: 'bow',     petTypes: ['cat'], accessoryType: 'bow',     assetUrl: '/assets/items/bow.png' },

  // Penguin
  { id: 'peng-hat',     name: 'Party Top Hat',   category: 'Accessories', price: 380, icon: 'hat',     petTypes: ['penguin'], accessoryType: 'hat',     assetUrl: '/assets/items/hat.png' },
  { id: 'peng-bowtie',  name: 'Tuxedo Bowtie',   category: 'Accessories', price: 140, icon: 'bowtie',  petTypes: ['penguin'], accessoryType: 'bowtie',  assetUrl: '/assets/items/bowtie.png' },
  { id: 'peng-glasses', name: 'Ski Goggles',     category: 'Accessories', price: 240, icon: 'glasses', petTypes: ['penguin'], accessoryType: 'glasses', assetUrl: '/assets/items/glasses.png' },
  { id: 'peng-collar',  name: 'Frosty Collar',   category: 'Accessories', price: 150, icon: 'collar',  petTypes: ['penguin'], accessoryType: 'collar',  assetUrl: '/assets/items/collar.png' },
  { id: 'peng-bandana', name: 'Arctic Scarf',    category: 'Accessories', price: 190, icon: 'bandana', petTypes: ['penguin'], accessoryType: 'bandana', assetUrl: '/assets/items/bandana.png' },
  { id: 'peng-bow',     name: 'Coral Ribbon',    category: 'Accessories', price: 120, icon: 'bow',     petTypes: ['penguin'], accessoryType: 'bow',     assetUrl: '/assets/items/bow.png' },

  // Unicorn
  { id: 'uni-hat',          name: 'Wizard Crown Hat', category: 'Accessories', price: 380, icon: 'hat',          petTypes: ['unicorn'], accessoryType: 'hat',          assetUrl: '/assets/items/hat.png' },
  { id: 'uni-bowtie',       name: 'Starlight Bowtie', category: 'Accessories', price: 140, icon: 'bowtie',       petTypes: ['unicorn'], accessoryType: 'bowtie',       assetUrl: '/assets/items/bowtie.png' },
  { id: 'uni-glasses',      name: 'Star Shades',      category: 'Accessories', price: 240, icon: 'glasses',      petTypes: ['unicorn'], accessoryType: 'glasses',      assetUrl: '/assets/items/glasses.png' },
  { id: 'uni-collar',       name: 'Jeweled Collar',   category: 'Accessories', price: 150, icon: 'collar',       petTypes: ['unicorn'], accessoryType: 'collar',       assetUrl: '/assets/items/collar.png' },
  { id: 'uni-bandana',      name: 'Mystic Cape',      category: 'Accessories', price: 190, icon: 'bandana',      petTypes: ['unicorn'], accessoryType: 'bandana',      assetUrl: '/assets/items/bandana.png' },
  { id: 'uni-bow',          name: 'Pastel Dream Bow', category: 'Accessories', price: 120, icon: 'bow',          petTypes: ['unicorn'], accessoryType: 'bow',          assetUrl: '/assets/items/bow.png' },
  { id: 'uni-rainbow_glow', name: 'Rainbow Mane Glow', category: 'Accessories', price: 950, icon: 'rainbow_glow', petTypes: ['unicorn'], accessoryType: 'rainbow_glow', assetUrl: '/assets/items/rainbow_glow.png' },

  // ─── Backgrounds (Available to all pets) ───────────
  { id: 'bg-park',  name: 'Sunny Park',   category: 'Backgrounds', price: 500, icon: 'park',  petTypes: ['dog', 'cat', 'penguin', 'unicorn'], cssClass: 'bg-park' },
  { id: 'bg-beach', name: 'Sandy Beach',  category: 'Backgrounds', price: 550, icon: 'beach', petTypes: ['dog', 'cat', 'penguin', 'unicorn'], cssClass: 'bg-beach' },
  { id: 'bg-space', name: 'Cosmic Space', category: 'Backgrounds', price: 750, icon: 'space', petTypes: ['dog', 'cat', 'penguin', 'unicorn'], cssClass: 'bg-space' },
  { id: 'bg-cozy',  name: 'Cozy Room',    category: 'Backgrounds', price: 480, icon: 'cozy',  petTypes: ['dog', 'cat', 'penguin', 'unicorn'], cssClass: 'bg-cozy' }
];

/** Retrieve all items purchasable by a specific pet type */
export function getShopItemsForPet(petType) {
  if (!petType) return [];
  return SHOP_ITEMS.filter((item) => item.petTypes.includes(petType));
}

/** Look up an item by its ID */
export function getItemById(id) {
  return SHOP_ITEMS.find((item) => item.id === id) || null;
}
