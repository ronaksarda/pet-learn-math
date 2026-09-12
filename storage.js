/**
 * storage.js — All localStorage read/write helpers.
 * Every other file accesses persistence ONLY through these functions.
 * Profile key format: "petmath_" + username (lowercased, trimmed).
 */

/** Build the localStorage key for a given username. */
function profileKey(name) {
  return 'petmath_' + name.trim().toLowerCase();
}

/** Return default profile shape for a brand-new user. */
function defaultProfile() {
  return {
    petType: null,
    totalXP: 0,
    coins: 0,
    chapterProgress: {
      counting:  { easy: false, medium: false, hard: false },
      addSub:    { easy: false, medium: false, hard: false },
      multDiv:   { easy: false, medium: false, hard: false },
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
}

/** Get full profile object. Returns null if no profile exists. */
function getProfile(name) {
  const raw = localStorage.getItem(profileKey(name));
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

/** Save a complete profile object. */
function saveProfile(name, data) {
  localStorage.setItem(profileKey(name), JSON.stringify(data));
}

/** Merge partial updates into an existing profile and save. */
function updateProfile(name, partialData) {
  const current = getProfile(name) || defaultProfile();
  const merged = deepMerge(current, partialData);
  saveProfile(name, merged);
  return merged;
}

/** Deep-merge helper — handles nested objects, replaces arrays outright. */
function deepMerge(target, source) {
  const out = { ...target };
  for (const key of Object.keys(source)) {
    if (
      source[key] !== null &&
      typeof source[key] === 'object' &&
      !Array.isArray(source[key]) &&
      typeof target[key] === 'object' &&
      !Array.isArray(target[key])
    ) {
      out[key] = deepMerge(target[key], source[key]);
    } else {
      out[key] = source[key];
    }
  }
  return out;
}
