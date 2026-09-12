/**
 * src/context/profileReducer.js
 * 
 * Pure reducer and state calculation functions for the Pet Math Academy profile.
 * 
 * WHY useReducer instead of multiple useState calls?
 * 1. Co-located State Transitions: Multiple fields (totalXP, growthStage, coins)
 *    often update simultaneously (e.g. answering a question). With separate useState
 *    calls, multiple renders might be scheduled or intermediate invalid states could
 *    exist. With useReducer, every transition is atomic and predictable.
 * 2. Maintainability & Testability: A pure reducer function has no dependencies on
 *    React hooks or DOM, meaning it can be thoroughly unit-tested in isolation (as
 *    demonstrated in tests/reducer.test.js).
 * 3. Simplified Component API: Components only need to know "what happened" (dispatch
 *    an action) rather than "how to calculate next state", keeping UI components clean.
 */

export const GROWTH_THRESHOLDS = [
  { stage: 'baby', minXP: 0 },
  { stage: 'young', minXP: 50 },
  { stage: 'grown', minXP: 150 },
  { stage: 'companion', minXP: 300 }
];

/**
 * Pure helper to compute current pet growth stage from cumulative XP.
 * Thresholds:
 *   0  .. 49  -> 'baby'
 *   50 .. 149 -> 'young'
 *   150.. 299 -> 'grown'
 *   300+      -> 'companion'
 */
export function calculateGrowthStage(xp = 0) {
  let activeStage = 'baby';
  for (const item of GROWTH_THRESHOLDS) {
    if (xp >= item.minXP) {
      activeStage = item.stage;
    }
  }
  return activeStage;
}

/** Initial default learner profile */
export const initialProfileState = {
  petType: null,
  totalXP: 0,
  coins: 0,
  growthStage: 'baby',
  chapterProgress: {
    counting: { easy: false, medium: false, hard: false },
    addSub: { easy: false, medium: false, hard: false },
    multDiv: { easy: false, medium: false, hard: false },
    fractions: { easy: false, medium: false, hard: false }
  },
  ownedItems: [],
  equippedItems: [],
  comfortSettings: {
    reducedMotion: false,
    highContrast: false,
    dyslexiaFont: false,
    textSize: 'medium',
    readAloud: false
  }
};

/**
 * Reducer function managing all learner profile state mutations.
 */
export function profileReducer(state, action) {
  switch (action.type) {
    case 'SET_PROFILE': {
      const incoming = action.payload || initialProfileState;
      const totalXP = incoming.totalXP || 0;
      return {
        ...initialProfileState,
        ...incoming,
        chapterProgress: {
          ...initialProfileState.chapterProgress,
          ...(incoming.chapterProgress || {})
        },
        comfortSettings: {
          ...initialProfileState.comfortSettings,
          ...(incoming.comfortSettings || {})
        },
        growthStage: calculateGrowthStage(totalXP)
      };
    }

    case 'SELECT_PET': {
      return {
        ...state,
        petType: action.payload
      };
    }

    case 'ADD_COINS': {
      const coinsToAdd = Math.round(action.payload) || 0;
      return {
        ...state,
        coins: Math.max(0, state.coins + coinsToAdd)
      };
    }

    case 'ADD_XP': {
      const xpToAdd = Math.round(action.payload) || 0;
      const nextXP = Math.max(0, state.totalXP + xpToAdd);
      return {
        ...state,
        totalXP: nextXP,
        growthStage: calculateGrowthStage(nextXP)
      };
    }

    case 'BUY_ITEM': {
      const { itemId, price } = action.payload;
      if (state.coins < price || state.ownedItems.includes(itemId)) {
        return state;
      }
      return {
        ...state,
        coins: state.coins - price,
        ownedItems: [...state.ownedItems, itemId]
      };
    }

    case 'EQUIP_ITEM': {
      const { itemId, category } = action.payload;
      if (!state.ownedItems.includes(itemId)) {
        return state;
      }

      let updatedEquipped = [...state.equippedItems];

      // If equipping a background, remove any existing background first
      if (category === 'Backgrounds') {
        updatedEquipped = updatedEquipped.filter((id) => !id.startsWith('bg-'));
      }

      if (!updatedEquipped.includes(itemId)) {
        updatedEquipped.push(itemId);
      }

      return {
        ...state,
        equippedItems: updatedEquipped
      };
    }

    case 'UNEQUIP_ITEM': {
      const { itemId } = action.payload;
      return {
        ...state,
        equippedItems: state.equippedItems.filter((id) => id !== itemId)
      };
    }

    case 'COMPLETE_CHAPTER': {
      const { chapterKey, difficulty } = action.payload;
      const currentChapter = state.chapterProgress[chapterKey] || {
        easy: false,
        medium: false,
        hard: false
      };

      return {
        ...state,
        chapterProgress: {
          ...state.chapterProgress,
          [chapterKey]: {
            ...currentChapter,
            [difficulty]: true
          }
        }
      };
    }

    case 'UPDATE_SETTINGS': {
      return {
        ...state,
        comfortSettings: {
          ...state.comfortSettings,
          ...action.payload
        }
      };
    }

    case 'RESET_PROFILE': {
      return { ...initialProfileState };
    }

    default:
      return state;
  }
}
