/**
 * src/components/ShopItem.jsx
 * 
 * Individual item card in the store.
 * Displays illustrated accessory previews or room background miniatures,
 * clear pricing tags, and tactile 3D action buttons.
 */

import React from 'react';

export default function ShopItem({
  item,
  isOwned,
  isEquipped,
  canAfford,
  onBuy,
  onEquip,
  onUnequip
}) {
  const isUnaffordable = !isOwned && !canAfford;

  return (
    <div
      className={`shop-item-card ${isUnaffordable ? 'unaffordable' : ''}`}
      role="article"
      aria-label={`${item.name} - ${item.price} coins`}
    >
      {/* Visual Item Display: Illustrated Accessory or Mini Room Theme */}
      {item.category === 'Backgrounds' ? (
        <div className={`shop-bg-mini-preview ${item.cssClass}`} aria-hidden="true">
          <span className="shop-bg-tag">Room</span>
        </div>
      ) : (
        <div className="shop-item-preview-podium" aria-hidden="true">
          {item.assetUrl ? (
            <img
              src={item.assetUrl}
              alt={item.name}
              className="shop-accessory-img"
            />
          ) : (
            <span className="shop-fallback-icon">{item.icon}</span>
          )}
        </div>
      )}

      <div className="shop-item-name">{item.name}</div>

      <div className="shop-item-category-tag">
        {item.category === 'Backgrounds' ? 'Room Theme' : 'Pet Accessory'}
      </div>

      {/* Prominent, readable cost badge */}
      <div className="shop-item-cost-badge" aria-label={`Cost: ${item.price} coins`}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="12" cy="12" r="10" fill="#facc15" stroke="#ca8a04" strokeWidth="1.5" />
          <polygon points="12,7 13.5,10.5 17,11 14.5,13.5 15.5,17 12,15 8.5,17 9.5,13.5 7,11 10.5,10.5" fill="#ca8a04" />
        </svg>
        <span>{item.price} Coins</span>
      </div>

      {isOwned ? (
        <button
          type="button"
          className={`item-action-btn ${isEquipped ? 'btn-unequip' : 'btn-equip'}`}
          onClick={() => (isEquipped ? onUnequip(item.id) : onEquip(item.id, item.category))}
        >
          {isEquipped ? 'Equipped ✓' : 'Equip Item'}
        </button>
      ) : (
        <button
          type="button"
          className="item-action-btn btn-buy"
          disabled={!canAfford}
          onClick={() => onBuy(item.id, item.price)}
          aria-label={`Buy ${item.name} for ${item.price} coins`}
        >
          {canAfford ? 'Buy Item' : 'Need More Coins'}
        </button>
      )}
    </div>
  );
}
