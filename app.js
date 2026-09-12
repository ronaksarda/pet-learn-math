/**
 * app.js — Main application flow: screen switching, event wiring, game loop.
 * Depends on: storage.js, questions.js, shop.js (loaded before this file).
 */

// ─── Constants ───────────────────────────────────────────

/** Pet emoji map by type and growth stage. */
const PET_EMOJIS = {
  dog:     { baby: '🐶', young: '🐕', grown: '🦮', companion: '🐕‍🦺' },
  cat:     { baby: '🐱', young: '🐈', grown: '🐈‍⬛', companion: '😺' },
  penguin: { baby: '🐧', young: '🐧', grown: '🐧', companion: '🐧' },
  unicorn: { baby: '🦄', young: '🦄', grown: '🦄', companion: '🦄' }
};

/** XP thresholds for growth stages. */
const STAGES = [
  { name: 'Baby',      minXP: 0 },
  { name: 'Young',     minXP: 50 },
  { name: 'Grown',     minXP: 150 },
  { name: 'Companion', minXP: 300 }
];

/** Chapter metadata in order. */
const CHAPTERS = [
  { key: 'counting',  title: 'Counting & Number Sense', icon: '🔢', grades: 'K-1' },
  { key: 'addSub',    title: 'Addition & Subtraction',  icon: '➕', grades: '1-2' },
  { key: 'multDiv',   title: 'Multiply & Divide',       icon: '✖️', grades: '3'   },
  { key: 'fractions', title: 'Intro to Fractions',       icon: '🍕', grades: '3-4' }
];

/** Base coins per correct answer. */
const BASE_COINS = 5;
/** XP per correct answer. */
const BASE_XP = 4;
/** Bonus coins for completing a full set (5/5). */
const COMPLETION_BONUS_COINS = 10;
/** Bonus XP for full set. */
const COMPLETION_BONUS_XP = 8;
/** Difficulty multipliers for coin rewards. */
const DIFF_MULT = { easy: 1, medium: 1.5, hard: 2 };

// ─── State ───────────────────────────────────────────────

let currentUser = null;      // username string
let currentProfile = null;   // profile object
let currentChapter = null;   // chapter key
let currentDifficulty = null;
let currentQuestions = [];    // array of 5 question objects
let currentQIndex = 0;       // 0-4
let sessionCoins = 0;        // coins earned this round
let sessionXP = 0;
let sessionCorrect = 0;      // correct count this round
let oldStage = null;         // stage name before round, for level-up check

// ─── Screen Switching ────────────────────────────────────

/** Show one screen, hide all others. */
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const target = document.getElementById(id);
  if (target) target.classList.add('active');
}

// ─── Growth Stage Helper ─────────────────────────────────

/** Get the current growth stage object from total XP. */
function getStage(xp) {
  let stage = STAGES[0];
  for (const s of STAGES) {
    if (xp >= s.minXP) stage = s;
  }
  return stage;
}

/** Get XP needed for next stage. Returns null at max. */
function getNextStageXP(xp) {
  for (const s of STAGES) {
    if (xp < s.minXP) return s.minXP;
  }
  return null;
}

// ─── Comfort Settings Application ────────────────────────

/** Apply comfort settings from profile to the DOM body classes. */
function applyComfortSettings(settings) {
  const body = document.body;
  body.classList.toggle('reduced-motion', !!settings.reducedMotion);
  body.classList.toggle('high-contrast', !!settings.highContrast);
  body.classList.toggle('dyslexia-font', !!settings.dyslexiaFont);
  body.classList.remove('text-small', 'text-medium', 'text-large');
  if (settings.textSize === 'small') body.classList.add('text-small');
  if (settings.textSize === 'large') body.classList.add('text-large');
  // text-medium is the default (no extra class)
}

// ─── Chapter Unlock Logic ────────────────────────────────

/** Chapter N is unlocked if N===0 or chapter N-1 has at least easy completed. */
function isChapterUnlocked(profile, chapterIndex) {
  if (chapterIndex === 0) return true;
  const prevKey = CHAPTERS[chapterIndex - 1].key;
  const prev = profile.chapterProgress[prevKey];
  return prev && prev.easy;
}

/** Get completion status text for a chapter. */
function chapterStatusText(progress) {
  if (!progress) return 'Not started';
  const done = [progress.easy, progress.medium, progress.hard].filter(Boolean).length;
  if (done === 3) return 'All complete ✓';
  if (done === 0) return 'Not started';
  return `${done}/3 difficulties done`;
}

// ─── Login ───────────────────────────────────────────────

/** Handle login form submit. */
function handleLogin() {
  const input = document.getElementById('login-name');
  const name = input.value.trim();
  if (!name) return;

  currentUser = name;
  let profile = getProfile(name);

  if (!profile) {
    // New user — create default profile, go to pet select
    profile = defaultProfile();
    saveProfile(name, profile);
    currentProfile = profile;
    showScreen('screen-pet-select');
  } else if (!profile.petType) {
    // Profile exists but no pet chosen yet
    currentProfile = profile;
    showScreen('screen-pet-select');
  } else {
    currentProfile = profile;
    applyComfortSettings(profile.comfortSettings);
    renderDashboard();
    showScreen('screen-dashboard');
  }
}

// ─── Pet Selection ───────────────────────────────────────

/** Handle pet card click. Permanent choice. */
function selectPet(petType) {
  currentProfile = updateProfile(currentUser, { petType });
  applyComfortSettings(currentProfile.comfortSettings);
  renderDashboard();
  showScreen('screen-dashboard');
}

// ─── Dashboard Rendering ─────────────────────────────────

/** Refresh all dashboard UI from current profile. */
function renderDashboard() {
  const p = currentProfile;

  // Coin display
  document.getElementById('coin-count').textContent = p.coins;

  // Pet display
  const stage = getStage(p.totalXP);
  const stageKey = stage.name.toLowerCase();
  const emoji = PET_EMOJIS[p.petType]?.[stageKey] || PET_EMOJIS[p.petType]?.baby || '🐾';
  document.getElementById('pet-emoji').textContent = emoji;
  document.getElementById('pet-stage').textContent = `${stage.name} ${p.petType.charAt(0).toUpperCase() + p.petType.slice(1)}`;

  // Equipped accessories
  const accContainer = document.getElementById('pet-accessories');
  accContainer.innerHTML = '';
  (p.equippedItems || []).forEach(id => {
    const item = getItemById(id);
    if (item && item.category === 'Accessories') {
      const span = document.createElement('span');
      span.textContent = item.emoji;
      span.setAttribute('aria-label', item.name);
      accContainer.appendChild(span);
    }
  });

  // Background
  const petDisplay = document.getElementById('pet-display');
  petDisplay.className = 'pet-display';
  const bgItem = (p.equippedItems || []).find(id => {
    const item = getItemById(id);
    return item && item.category === 'Backgrounds';
  });
  if (bgItem) {
    // Map item id to CSS class
    const bgMap = { 'bg-park': 'bg-park', 'bg-beach': 'bg-beach', 'bg-space': 'bg-space', 'bg-cozy': 'bg-cozy' };
    petDisplay.classList.add(bgMap[bgItem] || 'bg-none');
  } else {
    petDisplay.classList.add('bg-none');
  }

  // XP bar
  const nextXP = getNextStageXP(p.totalXP);
  const currentStageXP = stage.minXP;
  let xpText, percent;
  if (nextXP === null) {
    xpText = `${p.totalXP} XP — Max Level!`;
    percent = 100;
  } else {
    xpText = `${p.totalXP} / ${nextXP} XP`;
    percent = Math.min(100, ((p.totalXP - currentStageXP) / (nextXP - currentStageXP)) * 100);
  }
  document.getElementById('xp-label').textContent = xpText;
  document.getElementById('xp-fill').style.width = percent + '%';

  // Chapter map
  renderChapterMap();
}

/** Render the chapter node list. */
function renderChapterMap() {
  const container = document.getElementById('chapter-map');
  container.innerHTML = '';

  CHAPTERS.forEach((ch, i) => {
    const unlocked = isChapterUnlocked(currentProfile, i);
    const progress = currentProfile.chapterProgress[ch.key];
    const allDone = progress && progress.easy && progress.medium && progress.hard;

    const node = document.createElement('div');
    node.className = 'chapter-node' + (unlocked ? '' : ' locked');
    node.tabIndex = unlocked ? 0 : -1;
    node.setAttribute('role', 'button');
    node.setAttribute('aria-label', `${ch.title}${unlocked ? '' : ' (locked)'}`);
    node.innerHTML = `
      <span class="chapter-icon">${ch.icon}</span>
      <div class="chapter-info">
        <div class="chapter-title">${ch.title}</div>
        <div class="chapter-status">${unlocked ? chapterStatusText(progress) : '🔒 Locked'}</div>
      </div>
      <span class="chapter-badge">${allDone ? '⭐' : unlocked ? '▶' : '🔒'}</span>
    `;

    if (unlocked) {
      node.addEventListener('click', () => openDifficultySelect(ch.key, i));
      node.addEventListener('keydown', e => { if (e.key === 'Enter') openDifficultySelect(ch.key, i); });
    }
    container.appendChild(node);
  });
}

// ─── Difficulty Selection ────────────────────────────────

/** Show difficulty selection for a chapter. */
function openDifficultySelect(chapterKey, chapterIndex) {
  currentChapter = chapterKey;
  const ch = CHAPTERS[chapterIndex];
  document.getElementById('diff-chapter-title').textContent = ch.title;

  const container = document.getElementById('diff-buttons');
  container.innerHTML = '';
  const progress = currentProfile.chapterProgress[chapterKey];

  ['easy', 'medium', 'hard'].forEach(diff => {
    const done = progress && progress[diff];
    const mult = DIFF_MULT[diff];
    const btn = document.createElement('button');
    btn.className = 'btn btn-primary diff-btn' + (done ? ' completed' : '');
    btn.innerHTML = `
      <span class="diff-label">
        <span>${diff.charAt(0).toUpperCase() + diff.slice(1)}</span>
        <span class="diff-coins">🪙 ×${mult}</span>
      </span>
    `;
    btn.addEventListener('click', () => startQuiz(chapterKey, diff));
    container.appendChild(btn);
  });

  showScreen('screen-difficulty');
}

// ─── Quiz Flow ───────────────────────────────────────────

/** Start a quiz for a chapter + difficulty. */
function startQuiz(chapter, difficulty) {
  currentChapter = chapter;
  currentDifficulty = difficulty;
  currentQuestions = generateQuestionSet(chapter, difficulty);
  currentQIndex = 0;
  sessionCoins = 0;
  sessionXP = 0;
  sessionCorrect = 0;
  oldStage = getStage(currentProfile.totalXP).name;
  showQuestion();
  showScreen('screen-question');
}

/** Display the current question. */
function showQuestion() {
  const q = currentQuestions[currentQIndex];
  document.getElementById('q-progress').textContent = `Question ${currentQIndex + 1} of 5`;
  document.getElementById('q-progress-fill').style.width = ((currentQIndex) / 5 * 100) + '%';
  document.getElementById('q-text').textContent = q.question;
  document.getElementById('q-feedback').textContent = '';
  document.getElementById('q-feedback').className = 'feedback-msg';

  const grid = document.getElementById('answer-grid');
  grid.innerHTML = '';
  q.options.forEach((opt, idx) => {
    const btn = document.createElement('button');
    btn.className = 'answer-btn';
    btn.textContent = opt;
    btn.addEventListener('click', () => handleAnswer(btn, idx, q.correctIndex));
    grid.appendChild(btn);
  });

  // Read aloud if enabled
  if (currentProfile.comfortSettings.readAloud) {
    readAloud(q.question);
  }
}

/** Handle an answer button click. */
function handleAnswer(btn, selectedIdx, correctIdx) {
  const feedback = document.getElementById('q-feedback');

  if (selectedIdx === correctIdx) {
    // Correct
    btn.classList.add('correct');
    feedback.textContent = '✅ Correct!';
    feedback.style.color = 'var(--clr-correct)';

    // Award coins + XP
    const mult = DIFF_MULT[currentDifficulty];
    sessionCoins += Math.round(BASE_COINS * mult);
    sessionXP += Math.round(BASE_XP * mult);
    sessionCorrect++;

    // Disable all buttons
    document.querySelectorAll('.answer-btn').forEach(b => b.style.pointerEvents = 'none');

    // Advance after short delay
    setTimeout(() => {
      currentQIndex++;
      if (currentQIndex >= 5) {
        finishQuiz();
      } else {
        showQuestion();
      }
    }, 900);
  } else {
    // Incorrect — allow retry
    btn.classList.add('incorrect');
    feedback.textContent = '🔄 Almost! Try again';
    feedback.style.color = 'var(--clr-incorrect)';
    // Remove incorrect class after animation
    setTimeout(() => btn.classList.remove('incorrect'), 400);
  }
}

/** Complete the quiz and show results. */
function finishQuiz() {
  // Bonus for 5/5
  if (sessionCorrect === 5) {
    sessionCoins += COMPLETION_BONUS_COINS;
    sessionXP += COMPLETION_BONUS_XP;
  }

  // Update profile
  currentProfile.coins += sessionCoins;
  currentProfile.totalXP += sessionXP;

  // Mark difficulty as completed if 5/5
  if (sessionCorrect === 5) {
    if (!currentProfile.chapterProgress[currentChapter]) {
      currentProfile.chapterProgress[currentChapter] = { easy: false, medium: false, hard: false };
    }
    currentProfile.chapterProgress[currentChapter][currentDifficulty] = true;
  }

  saveProfile(currentUser, currentProfile);

  // Render completion screen
  const newStage = getStage(currentProfile.totalXP).name;
  const leveledUp = newStage !== oldStage;

  document.getElementById('complete-score').textContent = `${sessionCorrect} / 5 Correct`;
  document.getElementById('complete-coins').textContent = `🪙 +${sessionCoins} coins`;
  document.getElementById('complete-xp').textContent = `⭐ +${sessionXP} XP`;

  const levelEl = document.getElementById('complete-levelup');
  if (leveledUp) {
    levelEl.textContent = `🎉 Your pet grew into a ${newStage}!`;
    levelEl.style.display = 'block';
  } else {
    levelEl.style.display = 'none';
  }

  if (sessionCorrect < 5) {
    document.getElementById('complete-hint').textContent = 'Get 5/5 to unlock the next difficulty!';
    document.getElementById('complete-hint').style.display = 'block';
  } else {
    document.getElementById('complete-hint').textContent = '';
    document.getElementById('complete-hint').style.display = 'none';
  }

  showScreen('screen-complete');
}

// ─── Shop Rendering ──────────────────────────────────────

/** Render the shop screen filtered for current pet. */
function renderShop() {
  const p = currentProfile;
  document.getElementById('shop-coins').textContent = p.coins;
  const items = getShopItemsForPet(p.petType);

  const categories = ['Accessories', 'Backgrounds'];
  const container = document.getElementById('shop-items');
  container.innerHTML = '';

  categories.forEach(cat => {
    const catItems = items.filter(i => i.category === cat);
    if (catItems.length === 0) return;

    const title = document.createElement('div');
    title.className = 'shop-category-title';
    title.textContent = cat;
    container.appendChild(title);

    const grid = document.createElement('div');
    grid.className = 'shop-grid';

    catItems.forEach(item => {
      const owned = p.ownedItems.includes(item.id);
      const equipped = p.equippedItems.includes(item.id);
      const canAfford = p.coins >= item.price;

      const el = document.createElement('div');
      el.className = 'shop-item';
      el.tabIndex = 0;
      el.setAttribute('role', 'button');
      if (owned) el.classList.add('owned');
      if (equipped) el.classList.add('equipped');
      if (!owned && !canAfford) el.classList.add('unaffordable');

      let statusText = '';
      if (equipped) statusText = '✓ Worn';
      else if (owned) statusText = 'Tap to wear';
      else if (!canAfford) statusText = 'Need more 🪙';

      el.innerHTML = `
        <span class="shop-item-emoji">${item.emoji}</span>
        <div class="shop-item-name">${item.name}</div>
        <div class="shop-item-price">${owned ? 'Owned' : '🪙 ' + item.price}</div>
        <div class="shop-item-status">${statusText}</div>
      `;

      el.addEventListener('click', () => handleShopClick(item.id));
      el.addEventListener('keydown', e => { if (e.key === 'Enter') handleShopClick(item.id); });
      grid.appendChild(el);
    });

    container.appendChild(grid);
  });
}

/** Handle click on a shop item — buy or toggle equip. */
function handleShopClick(itemId) {
  const p = currentProfile;
  const msgEl = document.getElementById('shop-msg');

  if (p.ownedItems.includes(itemId)) {
    // Toggle equip
    toggleEquip(currentUser, itemId);
    currentProfile = getProfile(currentUser);
    msgEl.textContent = '';
    renderShop();
  } else {
    // Try purchase
    const result = purchaseItem(currentUser, itemId);
    msgEl.textContent = result.message;
    if (result.success) {
      currentProfile = getProfile(currentUser);
    }
    renderShop();
  }
}

// ─── Settings Rendering & Handling ───────────────────────

/** Render settings screen from current profile. */
function renderSettings() {
  const s = currentProfile.comfortSettings;
  document.getElementById('set-reduced-motion').checked = s.reducedMotion;
  document.getElementById('set-high-contrast').checked = s.highContrast;
  document.getElementById('set-dyslexia-font').checked = s.dyslexiaFont;
  document.getElementById('set-read-aloud').checked = s.readAloud;

  // Text size radio
  document.querySelectorAll('input[name="text-size"]').forEach(r => {
    r.checked = r.value === s.textSize;
  });
}

/** Save a comfort setting change. */
function updateSetting(key, value) {
  currentProfile.comfortSettings[key] = value;
  saveProfile(currentUser, currentProfile);
  applyComfortSettings(currentProfile.comfortSettings);
}

// ─── Read Aloud ──────────────────────────────────────────

/** Use SpeechSynthesis to read text aloud. */
function readAloud(text) {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  utter.rate = 0.85;
  utter.pitch = 1.1;
  window.speechSynthesis.speak(utter);
}

// ─── Event Wiring (runs on DOMContentLoaded) ─────────────

document.addEventListener('DOMContentLoaded', () => {
  // Login
  document.getElementById('login-btn').addEventListener('click', handleLogin);
  document.getElementById('login-name').addEventListener('keydown', e => {
    if (e.key === 'Enter') handleLogin();
  });

  // Pet selection
  document.querySelectorAll('.pet-card').forEach(card => {
    card.addEventListener('click', () => selectPet(card.dataset.pet));
    card.addEventListener('keydown', e => { if (e.key === 'Enter') selectPet(card.dataset.pet); });
  });

  // Dashboard buttons
  document.getElementById('btn-shop').addEventListener('click', () => {
    renderShop();
    document.getElementById('shop-msg').textContent = '';
    showScreen('screen-shop');
  });
  document.getElementById('btn-settings').addEventListener('click', () => {
    renderSettings();
    showScreen('screen-settings');
  });

  // Back buttons
  document.getElementById('diff-back').addEventListener('click', () => {
    renderDashboard();
    showScreen('screen-dashboard');
  });
  document.getElementById('shop-back').addEventListener('click', () => {
    renderDashboard();
    showScreen('screen-dashboard');
  });
  document.getElementById('settings-back').addEventListener('click', () => {
    renderDashboard();
    showScreen('screen-dashboard');
  });
  document.getElementById('complete-back').addEventListener('click', () => {
    renderDashboard();
    showScreen('screen-dashboard');
  });

  // Settings toggles
  document.getElementById('set-reduced-motion').addEventListener('change', e => updateSetting('reducedMotion', e.target.checked));
  document.getElementById('set-high-contrast').addEventListener('change', e => updateSetting('highContrast', e.target.checked));
  document.getElementById('set-dyslexia-font').addEventListener('change', e => updateSetting('dyslexiaFont', e.target.checked));
  document.getElementById('set-read-aloud').addEventListener('change', e => updateSetting('readAloud', e.target.checked));
  document.querySelectorAll('input[name="text-size"]').forEach(r => {
    r.addEventListener('change', e => updateSetting('textSize', e.target.value));
  });

  // Read-aloud button on question screen
  document.getElementById('q-read-btn').addEventListener('click', () => {
    const text = document.getElementById('q-text').textContent;
    readAloud(text);
  });

  // Show login screen initially
  showScreen('screen-login');
});
