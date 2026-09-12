/**
 * src/components/PetDisplay.jsx
 * 
 * Interactive 3D Companion Display.
 * Renders an interactive 3D WebGL pet (Dog, Cat, Penguin, Unicorn)
 * using Three.js via <PetCanvas3D />.
 * 
 * Features:
 * - Real 3D character with soft studio lighting and drop shadow
 * - Interactive cursor tracking (pet's head follows mouse)
 * - Click-to-jump interaction
 * - 3D attached accessories (Hat, Bowtie, Glasses, Collar, Bandana, Bow, Rainbow Glow)
 * - Celebrate bounce and 360-degree victory spin animations
 * - Developmental growth stages (Baby, Young, Grown, Companion)
 */

import React from 'react';
import { useProfile } from '../context/ProfileContext.jsx';
import PetCanvas3D from './PetCanvas3D.jsx';

export default function PetDisplay({
  petTypeOverride = null,
  animationTrigger = null, // 'celebrate' | 'spin-full' | null
  onAnimationEnd = null,
  isDashboard = true,
  size = 260
}) {
  const { profile } = useProfile();

  const activePetType = petTypeOverride || profile.petType || 'dog';
  const growthStage = profile.growthStage || 'baby';
  const equippedItems = profile.equippedItems || [];
  const isReducedMotion = profile.comfortSettings?.reducedMotion || false;

  return (
    <div
      className="pet-display-wrapper"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative'
      }}
    >
      <PetCanvas3D
        petType={activePetType}
        growthStage={growthStage}
        equippedItems={equippedItems}
        animationTrigger={animationTrigger}
        onAnimationEnd={onAnimationEnd}
        reducedMotion={isReducedMotion}
        width={size}
        height={size}
        interactive={true}
      />
    </div>
  );
}
