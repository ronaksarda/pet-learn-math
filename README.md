# Pet Math Academy 🐾🎓

> An interactive, gamified K-5 mathematics learning adventure for children aged 5–11, featuring real-time 3D WebGL pet companions, grade-aligned curriculum chapters (K through 5th Grade), tactile progression loops, accessibility accommodations, and 100% client-side static execution.

---

## Table of Contents
1. [Project Overview](#project-overview)
2. [Key Features](#key-features)
3. [Tech Stack](#tech-stack)
4. [K-5 Curriculum & Math Engine](#k-5-curriculum--math-engine)
5. [Getting Started & Local Development](#getting-started--local-development)
6. [Architecture & Design](#architecture--design)
   - [Directory Structure](#directory-structure)
   - [State Management & Data Flow](#state-management--data-flow)
   - [3D Pet Companion System](#3d-pet-companion-system)
   - [Data Model & Persistence](#data-model--persistence)
7. [React Concepts & Learning Guide](#react-concepts--learning-guide)
   - [Why `useReducer` + `useContext` Beats `useState` Prop-Drilling](#1-why-usereducer--usecontext-beats-usestate-prop-drilling)
   - [Why Wrap `localStorage` in Custom Hooks (`useLocalStorage`)](#2-why-wrap-localstorage-in-custom-hooks-uselocalstorage)
   - [CSS Animation Replay & `useEffect` Cleanup](#3-css-animation-replay--useeffect-cleanup)
   - [WebGL 3D Rendering in React with Three.js](#4-webgl-3d-rendering-in-react-with-threejs)
8. [Accessibility & Comfort Settings](#accessibility--comfort-settings)
9. [Available Scripts](#available-scripts)
10. [Testing & Verification](#testing--verification)
11. [Production Deployment](#production-deployment)
12. [License](#license)

---

## Project Overview

**Pet Math Academy** transforms early math practice into an engaging journey. Children adopt a virtual 3D pet companion (Playful Pup, Mystic Kitten, Snowy Penguin, or Starry Unicorn) that grows, wags its tail, tracks the cursor, and celebrates correct answers alongside the learner.

Designed to follow modern, idiomatic React practices and educational accessibility standards, the project runs **100% statically in the browser** without external API keys or server dependencies.

---

## Key Features

- **Interactive 3D Companions**: Built using Three.js WebGL primitives with real-time lighting, cursor tracking, idle breathing, ear/tail animation, and click-to-play bounce reactions.
- **Layered 3D Accessories**: Real-time boutique where learners spend earned math coins to dress pets in 3D top hats, bowties, sunglasses, collars, bandanas, hair bows, and glowing particle auras.
- **Grade-Aligned K-5 Curriculum**: 12 dedicated chapters spanning Kindergarten through 5th Grade with dynamic procedural question generators and 3 difficulty tiers (Easy, Medium, Hard).
- **Grade Filtering System**: Grade selector (Kindergarten, Grade 1 to 5) filters quests to appropriate developmental levels while allowing exploration of all grades.
- **Growth & Evolution**: Cumulative XP powers pet growth across 4 developmental stages: **Baby** (0–49 XP), **Young** (50–149 XP), **Grown** (150–299 XP), and **Companion** (300+ XP).
- **Gamified Rewards & Streaks**: Daily login streak tracking, dynamic coin multipliers per difficulty tier (1x, 1.5x, 2x), and streak bonus rewards.
- **Child-Friendly Gentle Feedback**: Immediate visual celebrations on correct answers, celebratory confetti bursts, contextual hints, and friendly retries on mistakes without time pressure or penalty.
- **Deep Accessibility Suite**:
  - *Reduced Motion*: Disables continuous animations and replaces jumps with instantaneous feedback.
  - *High Contrast Mode*: Accessible dark palette with enhanced borders and high contrast ratios.
  - *Dyslexia-Friendly Typography*: Swappable Verdana typography with enhanced letter-spacing.
  - *Text Sizing*: Dynamic Small, Medium, Large typography scaling.
  - *Speech Synthesis Read-Aloud*: Speaks questions and answer choices using native browser Speech Synthesis.

---

## Tech Stack

| Domain | Technology | Justification |
|---|---|---|
| **Framework** | [React 18](https://react.dev/) | Functional components & hooks architecture |
| **Build Tool** | [Vite 5](https://vitejs.dev/) | Lightning-fast HMR and optimized production bundling with chunk splitting |
| **3D Graphics** | [Three.js](https://threejs.org/) | Hardware-accelerated WebGL 3D pets and dynamic accessories |
| **State Management** | React Context API + `useReducer` | Predictable, atomic state mutations without Redux/Zustand bloat |
| **Persistence** | `localStorage` via `useLocalStorage` | Client-side reactive persistence keyed per learner profile |
| **Styling** | Vanilla CSS + CSS Custom Properties | Zero-dependency design system (`variables.css` & `App.css`) |
| **Test Runner** | [Vitest](https://vitest.dev/) | High-speed unit testing for math generators and state transitions (87 tests) |
| **Speech** | Web Speech API (`SpeechSynthesis`) | Native browser text-to-speech for accessible math learning |

---

## K-5 Curriculum & Math Engine

Every chapter features procedural question generation with randomized parameters, ensuring infinite variety with zero question repetition.

### Kindergarten (Grade K)
1. **Counting Kingdom (`k_counting`)**: Object counting (1–10) with visual emoji sets, number sequences, 10-frames, and quantity comparisons.
2. **Shape Island (`k_shapes_patterns`)**: 2D shape identification (Circle, Triangle, Square, Rectangle), corner/side counts, size/weight comparisons, and visual patterns.

### 1st Grade (Grade 1)
3. **Math Safari (`g1_add_sub`)**: Single-digit and teen addition & subtraction within 20, doubles facts, missing addends (`7 + ? = 15`), and single-step word problems.
4. **Clockwork Castle (`g1_place_time`)**: Tens and ones place value, number comparisons (`<`, `>`, `=`), skip-counting by 10s, and analog clocks to the hour and half-hour.

### 2nd Grade (Grade 2)
5. **Dragon Mountain (`g2_2digit_math`)**: 2-digit addition and subtraction without and with regrouping (carrying & borrowing), 3-addend addition, and mental math to 100.
6. **Treasure Cove (`g2_money_measure`)**: Penny, nickel, dime, quarter coin totals, making change from $1.00, inches vs. feet, and analog clocks to 5-minute intervals.

### 3rd Grade (Grade 3)
7. **Space Galaxy (`g3_mult_div`)**: Multiplication tables (1–12), equal groups and arrays, division facts, missing factors (`7 × ? = 63`), and 2-step word problems.
8. **Geometry Jungle (`g3_fractions_geom`)**: Unit fractions (`1/2` to `1/8`), shaded fractional models, rectangle perimeter (`P = 2l + 2w`), and rectangle area.

### 4th Grade (Grade 4)
9. **Factor Forest (`g4_multidigit_factors`)**: Multi-digit multiplication (2-digit × 2-digit), long division quotients, factors, multiples, and prime vs. composite numbers.
10. **Decimal Dunes (`g4_fractions_decimals`)**: Fraction addition & subtraction with like denominators, mixed numbers to improper fractions, and decimals to tenths & hundredths.

### 5th Grade (Grade 5)
11. **Cosmic Nebula (`g5_adv_fractions_decimals`)**: Fraction addition & subtraction with unlike denominators, fraction multiplication, and decimal arithmetic.
12. **Quantum Matrix (`g5_pemdas_volume_coords`)**: Order of Operations (PEMDAS), expressions with parentheses, 3D rectangular prism volume (`V = l × w × h`), and Cartesian coordinate plotting (`x, y`).

---

## Getting Started & Local Development

### 1. Clone & Enter Directory
```bash
git clone https://github.com/ronaksarda/pet-learn-math.git
cd pet-learn-math
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start Development Server
```bash
npm run dev
```
Open `http://localhost:5173` in your web browser.

---

## Architecture & Design

### Directory Structure
```
pet-game-learn/
├── public/
├── src/
│   ├── components/
│   │   ├── ChapterMap.jsx          # K-5 curriculum roadmap & grade filtering
│   │   ├── ChapterSelect.jsx       # Difficulty selection modal (Easy, Med, Hard)
│   │   ├── ComfortSettings.jsx     # Accessibility modal (motion, contrast, font, size)
│   │   ├── CompletionSummary.jsx   # Quiz victory screen, stars & confetti
│   │   ├── Dashboard.jsx           # Main hub (3D pet, stats, XP bar, streaks)
│   │   ├── Login.jsx               # Profile picker & grade selection
│   │   ├── MathVisualCounter.jsx   # Interactive tactile counting grid
│   │   ├── PetCanvas3D.jsx         # WebGL Three.js 3D companion & accessories
│   │   ├── PetSelect.jsx           # Initial pet adoption screen
│   │   ├── QuestionScreen.jsx      # Math quiz arena, timer, hints & pet companion
│   │   └── Shop.jsx                # 3D Accessory & background boutique
│   ├── context/
│   │   ├── ProfileContext.jsx      # React Context provider & dispatch hooks
│   │   └── profileReducer.js       # Atomic reducer & growth stage calculations
│   ├── data/
│   │   ├── accessories.js          # Catalog of wearable 3D items & backgrounds
│   │   ├── questions.js            # Pure procedural math generators (K-5)
│   │   └── questionsBank.json      # Curated question banks
│   ├── hooks/
│   │   ├── useLocalStorage.js      # Reactive localStorage synchronization
│   │   └── useSpeechSynthesis.js   # Native Web Speech API integration
│   ├── styles/
│   │   ├── App.css                 # Core design system & responsive styling
│   │   └── variables.css           # CSS design tokens, HSL colors & theme values
│   ├── App.jsx                     # Screen router & root shell
│   └── main.jsx                    # Application entry point
├── tests/
│   ├── economy.test.js             # Coin reward & shop transaction tests
│   ├── petDisplay.test.js          # Pet rendering & 3D canvas tests
│   ├── questions.test.js           # Math generator tests for all 12 chapters
│   └── reducer.test.js             # Reducer actions, streaks & growth tests
├── vite.config.js                  # Vite config with manual chunk splitting
└── package.json
```

---

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Starts the local Vite development server at `http://localhost:5173` |
| `npm test` | Runs all 87 unit tests via Vitest |
| `npm run test:watch` | Runs Vitest in interactive watch mode |
| `npm run build` | Compiles the production build into `/dist` with Three.js chunk splitting |
| `npm run preview` | Previews the production build locally |

---

## Testing & Verification

The project includes an 87-test test suite covering state transitions, pet growth math, coin economy, and all 12 math curriculum generators.

Run the test suite:
```bash
npm test
```

Sample output:
```
 ✓ tests/economy.test.js (6 tests)
 ✓ tests/petDisplay.test.js (3 tests)
 ✓ tests/reducer.test.js (16 tests)
 ✓ tests/questions.test.js (62 tests)

 Test Files  4 passed (4)
      Tests  87 passed (87)
```

---

## Production Deployment

This project is a 100% static Single Page Application (SPA). It can be deployed to any static hosting service in seconds.

### Deploy to GitHub Pages
1. Build the production assets:
   ```bash
   npm run build
   ```
2. Deploy the `dist/` directory to GitHub Pages, Vercel, Netlify, or Cloudflare Pages.

### Deploy to Vercel / Netlify
Connect the GitHub repository:
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

---

## License

MIT License © 2026 Pet Math Academy Team.
