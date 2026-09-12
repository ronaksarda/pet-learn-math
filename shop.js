/**
 * shop.js — Shop items catalog, pricing, purchase, and equip logic.
 * Items are filtered by selected pet type. Categories: Accessories, Backgrounds.
 * All persistence goes through storage.js helpers.
 */

/** Full item catalog. Each item has: id, name, category, price, emoji, petTypes (which pets can buy it). */
const SHOP_ITEMS = [
  // ─── Dog Accessories ──────────────────
  { id: 'dog-collar',   name: 'Golden Collar',   category: 'Accessories', price: 150, emoji: 'collar',  petTypes: ['dog'] },
  { id: 'dog-hat',      name: 'Dapper Top Hat',  category: 'Accessories', price: 380, emoji: 'hat',     petTypes: ['dog'] },
  { id: 'dog-bandana',  name: 'Adventurer Scarf',category: 'Accessories', price: 190, emoji: 'bandana', petTypes: ['dog'] },
  { id: 'dog-glasses',  name: 'Cool Shades',     category: 'Accessories', price: 240, emoji: 'glasses', petTypes: ['dog'] },
  { id: 'dog-bow',      name: 'Cheery Hair Bow', category: 'Accessories', price: 120, emoji: 'bow',     petTypes: ['dog'] },
  { id: 'dog-bowtie',   name: 'Ruby Bowtie',     category: 'Accessories', price: 140, emoji: 'bowtie',  petTypes: ['dog'] },

  // ─── Cat Accessories ──────────────────
  { id: 'cat-collar',   name: 'Bell Chime Collar',category: 'Accessories', price: 150, emoji: 'collar',  petTypes: ['cat'] },
  { id: 'cat-hat',      name: 'Magical Hat',      category: 'Accessories', price: 380, emoji: 'hat',     petTypes: ['cat'] },
  { id: 'cat-bandana',  name: 'Warm Bandana',     category: 'Accessories', price: 190, emoji: 'bandana', petTypes: ['cat'] },
  { id: 'cat-glasses',  name: 'Scholar Specs',    category: 'Accessories', price: 240, emoji: 'glasses', petTypes: ['cat'] },
  { id: 'cat-bow',      name: 'Sweet Ribbon',     category: 'Accessories', price: 120, emoji: 'bow',     petTypes: ['cat'] },
  { id: 'cat-bowtie',   name: 'Midnight Bowtie',  category: 'Accessories', price: 140, emoji: 'bowtie',  petTypes: ['cat'] },

  // ─── Penguin Accessories ──────────────
  { id: 'peng-collar',  name: 'Frosty Collar',   category: 'Accessories', price: 150, emoji: 'collar',  petTypes: ['penguin'] },
  { id: 'peng-hat',     name: 'Party Top Hat',   category: 'Accessories', price: 380, emoji: 'hat',     petTypes: ['penguin'] },
  { id: 'peng-bandana', name: 'Arctic Scarf',    category: 'Accessories', price: 190, emoji: 'bandana', petTypes: ['penguin'] },
  { id: 'peng-glasses', name: 'Ski Goggles',     category: 'Accessories', price: 240, emoji: 'glasses', petTypes: ['penguin'] },
  { id: 'peng-bow',     name: 'Coral Ribbon',    category: 'Accessories', price: 120, emoji: 'bow',     petTypes: ['penguin'] },
  { id: 'peng-bowtie',  name: 'Tuxedo Bowtie',   category: 'Accessories', price: 140, emoji: 'bowtie',  petTypes: ['penguin'] },

  // ─── Unicorn Accessories ──────────────
  { id: 'uni-collar',   name: 'Jeweled Collar',   category: 'Accessories', price: 150, emoji: 'collar',   petTypes: ['unicorn'] },
  { id: 'uni-hat',      name: 'Wizard Crown Hat', category: 'Accessories', price: 380, emoji: 'hat',      petTypes: ['unicorn'] },
  { id: 'uni-bandana',  name: 'Mystic Cape',      category: 'Accessories', price: 190, emoji: 'bandana',  petTypes: ['unicorn'] },
  { id: 'uni-glasses',  name: 'Star Shades',      category: 'Accessories', price: 240, emoji: 'glasses',  petTypes: ['unicorn'] },
  { id: 'uni-bow',      name: 'Pastel Dream Bow', category: 'Accessories', price: 120, emoji: 'bow',      petTypes: ['unicorn'] },
  { id: 'uni-rainbow_glow', name: 'Rainbow Mane Glow', category: 'Accessories', price: 950, emoji: 'rainbow_glow', petTypes: ['unicorn'] },

  // ─── Backgrounds (shared, all pets) ───
  { id: 'bg-park',   name: 'Sunny Park',   category: 'Backgrounds', price: 500, emoji: 'park',  petTypes: ['dog','cat','penguin','unicorn'] },
  { id: 'bg-beach',  name: 'Beach',        category: 'Backgrounds', price: 550, emoji: 'beach', petTypes: ['dog','cat','penguin','unicorn'] },
  { id: 'bg-space',  name: 'Outer Space',  category: 'Backgrounds', price: 750, emoji: 'space', petTypes: ['dog','cat','penguin','unicorn'] },
  { id: 'bg-cozy',   name: 'Cozy Room',    category: 'Backgrounds', price: 480, emoji: 'cozy',  petTypes: ['dog','cat','penguin','unicorn'] },
];

/** Get items available for a specific pet type. */
function getShopItemsForPet(petType) {
  return SHOP_ITEMS.filter(item => item.petTypes.includes(petType));
}

/** Look up a single item by id. */
function getItemById(id) {
  return SHOP_ITEMS.find(item => item.id === id) || null;
}

/** Attempt to purchase an item. Returns { success, message }. */
function purchaseItem(username, itemId) {
  const profile = getProfile(username);
  if (!profile) return { success: false, message: 'No profile found.' };
  const item = getItemById(itemId);
  if (!item) return { success: false, message: 'Item not found.' };
  if (profile.ownedItems.includes(itemId)) return { success: false, message: 'Already owned!' };
  if (profile.coins < item.price) return { success: false, message: 'Not enough coins!' };

  profile.coins -= item.price;
  profile.ownedItems.push(itemId);
  saveProfile(username, profile);
  return { success: true, message: `Got ${item.name}!` };
}

/** Toggle equip state of an owned item. Returns new equipped list. */
function toggleEquip(username, itemId) {
  const profile = getProfile(username);
  if (!profile || !profile.ownedItems.includes(itemId)) return null;
  const item = getItemById(itemId);
  if (!item) return null;

  const idx = profile.equippedItems.indexOf(itemId);
  if (idx >= 0) {
    // Unequip
    profile.equippedItems.splice(idx, 1);
  } else {
    // For backgrounds, unequip any other background first
    if (item.category === 'Backgrounds') {
      profile.equippedItems = profile.equippedItems.filter(id => {
        const i = getItemById(id);
        return i && i.category !== 'Backgrounds';
      });
    }
    profile.equippedItems.push(itemId);
  }
  saveProfile(username, profile);
  return profile.equippedItems;
}
