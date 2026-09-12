/**
 * src/components/Shop.jsx
 * 
 * Shop screen displaying items filtered by current pet type.
 * Categorized into Accessories and Backgrounds.
 * Real-time PetDisplay preview reflects item equips immediately.
 */

import React, { useState, useMemo } from 'react';
import { useProfile } from '../context/ProfileContext.jsx';
import { getShopItemsForPet, getItemById } from '../data/shopItems.js';
import PetDisplay from './PetDisplay.jsx';
import ShopItem from './ShopItem.jsx';

export default function Shop({ onClose }) {
  const { profile, buyItem, equipItem, unequipItem } = useProfile();
  const [selectedCategory, setSelectedCategory] = useState('Accessories');
  const [petAnim, setPetAnim] = useState(null);

  // Determine active background CSS class from equipped items
  const backgroundClass = useMemo(() => {
    const bgItem = (profile.equippedItems || []).find((id) => id.startsWith('bg-'));
    if (!bgItem) return 'bg-default';
    const item = getItemById(bgItem);
    return item?.cssClass || 'bg-default';
  }, [profile.equippedItems]);

  // Items filtered to current learner's pet type
  const availableItems = useMemo(() => {
    return getShopItemsForPet(profile.petType);
  }, [profile.petType]);

  const filteredItems = useMemo(() => {
    return availableItems.filter((item) => item.category === selectedCategory);
  }, [availableItems, selectedCategory]);

  const handleEquip = (itemId, category) => {
    equipItem(itemId, category);
    // Trigger celebration bounce when equipping
    setPetAnim('celebrate');
  };

  const handleUnequip = (itemId) => {
    unequipItem(itemId);
  };

  const handleBuy = (itemId, price) => {
    buyItem(itemId, price);
  };

  return (
    <div className="shop-container" role="main">
      {/* Header with Navigation and Coins */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div className="boutique-header-badge">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
          </div>
          <div>
            <h2 className="shop-title">Pet Boutique</h2>
            <p style={{ color: 'var(--color-text-muted)', fontWeight: 600 }}>
              Style your {profile.petType} with custom hats, bowties, and room themes!
            </p>
          </div>
        </div>

        <button
          type="button"
          className="icon-btn"
          onClick={onClose}
          aria-label="Close boutique"
        >
          ✕
        </button>
      </div>

      {/* Live Pet Preview in Shop with dynamic background */}
      <div className={`shop-pet-preview-box ${backgroundClass}`}>
        <PetDisplay
          animationTrigger={petAnim}
          onAnimationEnd={() => setPetAnim(null)}
          isDashboard={false}
          size={240}
        />
      </div>

      {/* Category Tabs: Accessories vs Backgrounds */}
      <div className="shop-category-tabs" role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={selectedCategory === 'Accessories'}
          className={`tab-btn ${selectedCategory === 'Accessories' ? 'active' : ''}`}
          onClick={() => setSelectedCategory('Accessories')}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M4 19h16 M7 19V9a5 5 0 0 1 10 0v10" />
            <rect x="7" y="14" width="10" height="2" fill="currentColor" />
          </svg>
          <span>Accessories</span>
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={selectedCategory === 'Backgrounds'}
          className={`tab-btn ${selectedCategory === 'Backgrounds' ? 'active' : ''}`}
          onClick={() => setSelectedCategory('Backgrounds')}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
          </svg>
          <span>Backgrounds</span>
        </button>
      </div>

      {/* Items Grid */}
      <div className="shop-grid">
        {filteredItems.map((item) => {
          const isOwned = (profile.ownedItems || []).includes(item.id);
          const isEquipped = (profile.equippedItems || []).includes(item.id);
          const canAfford = profile.coins >= item.price;

          return (
            <ShopItem
              key={item.id}
              item={item}
              isOwned={isOwned}
              isEquipped={isEquipped}
              canAfford={canAfford}
              onBuy={handleBuy}
              onEquip={handleEquip}
              onUnequip={handleUnequip}
            />
          );
        })}
      </div>
    </div>
  );
}
