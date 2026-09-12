# Pet Math Academy 🐾🎓

> An interactive, gamified K-5 mathematics learning adventure for children aged 5–10, featuring real-time 3D WebGL pet companions, rewarding progression loops, accessibility accommodations, and curriculum-aligned math challenges.

---

## Table of Contents
1. [Project Overview](#project-overview)
2. [Key Features](#key-features)
3. [Tech Stack](#tech-stack)
4. [Prerequisites](#prerequisites)
5. [Getting Started](#getting-started)
6. [Architecture & Design](#architecture--design)
   - [Directory Structure](#directory-structure)
   - [State Management & Data Flow](#state-management--data-flow)
   - [3D Pet Companion System](#3d-pet-companion-system)
   - [Data Model](#data-model)
7. [React Concepts & Learning Guide](#react-concepts--learning-guide)
   - [Why `useReducer` + `useContext` Beats `useState` Prop-Drilling](#1-why-usereducer--usecontext-beats-usestate-prop-drilling)
   - [Why Wrap `localStorage` in Custom Hooks (`useLocalStorage`)](#2-why-wrap-localstorage-in-custom-hooks-uselocalstorage)
   - [CSS Animation Replay & `useEffect` Cleanup](#3-css-animation-replay--useeffect-cleanup)
   - [WebGL 3D Rendering in React with Three.js](#4-webgl-3d-rendering-in-react-with-threejs)
8. [Curriculum & Math Engine](#curriculum--math-engine)
9. [Accessibility & Comfort Settings](#accessibility--comfort-settings)
10. [Available Scripts](#available-scripts)
11. [Testing & Verification](#testing--verification)
12. [Production Deployment](#production-deployment)
13. [Troubleshooting](#troubleshooting)
14. [License](#license)

---

## Project Overview

**Pet Math Academy** transforms essential early math practice into an engaging journey. Children adopt a virtual 3D pet companion (Playful Pup, Mystic Kitten, Snowy Penguin, or Starry Unicorn) that grows, wags its tail, tracks the cursor, and celebrates correct answers alongside the learner.

Designed from the ground up to follow modern, idiomatic React practices and strict educational accessibility standards, the project demonstrates how to build robust, maintainable web applications using functional components, custom hooks, and lightweight WebGL graphics without bloated dependencies.

---

## Key Features

- **Interactive 3D Companions**: Built using Three.js WebGL primitives with real-time lighting, cursor tracking, idle breathing, ear/tail animation, and click-to-play bounce reactions.
- **Layered 3D Accessories**: Real-time boutique where learners spend earned math coins to dress pets in 3D top hats, bowties, sunglasses, collars, bandanas, hair bows, and glowing particle auras.
- **K-5 Math Curriculum**: 4 comprehensive chapters spanning Kindergarten through 4th Grade with 3 calibrated difficulty tiers (Easy, Medium, Hard):
  1. *Counting & Number Sense* (Object counts, number sequence, skip counting, ordering)
  2. *Addition & Subtraction* (Within 10, within 20, within 100 with regrouping)
  3. *Multiplication & Division Basics* (Times tables 1-10, division facts, mental math)
  4. *Intro to Fractions* (Visual shaded shapes, comparing same denominators, equivalent fractions)
- **Growth & Evolution**: Cumulative XP powers pet growth across 4 developmental stages: **Baby** (0–49 XP), **Young** (50–149 XP), **Grown** (150–299 XP), and **Companion** (300+ XP).
- **Gamified Rewards**: Dynamic coin multipliers per difficulty (1x, 1.5x, 2x) plus 5/5 completion bonuses.
- **Child-Friendly Gentle Feedback**: Immediate visual celebrations on correct answers; friendly retries on mistakes without time pressure or penalty.
- **Deep Accessibility Suite**:
  - *Reduced Motion*: Disables continuous animations and replaces jumps with instantaneous feedback.
  - *High Contrast Mode*: Accessible dark palette with enhanced borders and high contrast ratios.
  - *Dyslexia-Friendly Typography*: Swappable Verdana typography with enhanced letter-spacing.
  - *Text Sizing*: Dynamic Small, Medium, Large typography scaling.
  - *Speech Synthesis Read-Aloud*: Speaks questions and answer choices using the Web Speech API.

---

## Tech Stack

| Domain | Technology | Justification |
|---|---|---|
| **Framework** | [React 18](https://react.dev/) | Functional components & hooks architecture |
| **Build Tool** | [Vite 5](https://vitejs.dev/) | Lightning-fast HMR and optimized production bundling |
| **3D Graphics** | [Three.js](https://threejs.org/) | Hardware-accelerated WebGL 3D pets and dynamic accessories |
| **State Management** | React Context API + `useReducer` | Predictable, atomic state mutations without Redux/Zustand bloat |
| **Persistence** | `localStorage` via `useLocalStorage` | Client-side reactive persistence keyed per learner profile |
| **Styling** | Vanilla CSS + CSS Custom Properties | Zero-dependency design system (`variables.css` & `App.css`) |
| **Test Runner** | [Vitest](https://vitest.dev/) | High-speed unit testing for math generators and state transitions |
| **Speech** | Web Speech API (`SpeechSynthesis`) | Native browser text-to-speech for accessible math learning |

---

## Prerequisites

- **Node.js**: Version `18.0.0` or higher (`20.x` or `24.x` recommended).
- **npm**: Version `9.0.0` or higher (bundled with Node).
- **Modern Web Browser**: Chrome, Edge, Firefox, or Safari with WebGL enabled.

---

## Getting Started

### 1. Clone & Enter Directory
```bash
git clone https://github.com/your-username/pet-math-academy.git
cd pet-math-academy
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start Development Server
```bash
npm run dev
```
Open your browser to [http://localhost:5173/](http://localhost:5173/).

### 4. Build for Production
```bash
npm run build
```
The optimized production bundle will be generated inside the `dist/` folder.

### 5. Run Unit Tests
```bash
npm test
```

---

## Architecture & Design

### Directory Structure

```
pet-game-learn/
├── index.html                    # HTML entry point (Google Fonts + #root mount)
├── package.json                  # Scripts & dependencies
├── vite.config.js                # Vite build configuration
├── vitest.config.js              # Vitest test runner configuration
├── public/
│   └── assets/                   # Public static assets & images
│       ├── dog.png
│       ├── cat.png
│       ├── penguin.png
│       ├── unicorn.png
│       └── items/                # Accessory artwork overlays
│           ├── hat.png
│           ├── bowtie.png
│           ├── glasses.png
│           ├── collar.png
│           ├── bandana.png
│           ├── bow.png
│           └── rainbow_glow.png
├── src/
│   ├── main.jsx                  # React DOM mount point + ProfileProvider
│   ├── App.jsx                   # Screen router, top navigation, & settings bridge
│   ├── styles/
│   │   ├── variables.css         # CSS tokens (pastels, high contrast, typography)
│   │   └── App.css               # Animations, layout, cards, buttons, & shop UI
│   ├── context/
│   │   ├── ProfileContext.jsx    # React Context provider & custom consumer hook
│   │   └── profileReducer.js     # Pure reducer & growth stage calculations
│   ├── hooks/
│   │   ├── useLocalStorage.js    # Reactive localStorage wrapper hook
│   │   └── useSpeechSynthesis.js # Web Speech API text-to-speech hook
│   ├── data/
│   │   ├── questions.js          # Pure K-5 math question generators
│   │   └── shopItems.js          # Item catalog & 3D/2D accessory metadata
│   └── components/
│       ├── Login.jsx             # Learner login / sign-in screen
│       ├── PetSelect.jsx         # 3D interactive pet adoption screen
│       ├── Dashboard.jsx         # Central hub: 3D pet, XP bar, & curriculum map
│       ├── PetDisplay.jsx        # Pet container wrapper bridging 3D WebGL
│       ├── PetCanvas3D.jsx       # Three.js WebGL canvas rendering 3D pets & gear
│       ├── ChapterMap.jsx        # Visual curriculum map with progression badges
│       ├── ChapterSelect.jsx     # Difficulty selector (Easy, Medium, Hard)
│       ├── QuestionScreen.jsx    # Focused 5-question test interface
│       ├── CompletionSummary.jsx # Victory screen, reward tally, & level-up celebration
│       ├── Shop.jsx              # Pet boutique with category tabs & live 3D preview
│       ├── ShopItem.jsx          # Individual item card with Buy/Equip actions
│       └── ComfortSettings.jsx   # Modal for accessibility toggles & text sizing
├── tests/
│   ├── questions.test.js         # Vitest suite for math correctness & distractors
│   └── reducer.test.js           # Vitest suite for reducer transitions & growth logic
└── README.md                     # Comprehensive documentation
```

### State Management & Data Flow

```
+-------------------------------------------------------------------+
|                        ProfileProvider                            |
|  - Holds state via useReducer(profileReducer)                     |
|  - Syncs to localStorage under key "petmath_" + username          |
|  - Exposes actions: selectPet, addCoins, addXP, buyItem, etc.     |
+---------------------------------+---------------------------------+
                                  |
               +------------------+------------------+
               |                                     |
               v                                     v
     +-------------------+                 +-------------------+
     |     Dashboard     |                 |  QuestionScreen   |
     | Reads:            |                 | Reads:            |
     | - profile.petType |                 | - comfortSettings |
     | - growthStage     |                 | Dispatches:       |
     | - totalXP         |                 | - addCoins(...)   |
     | - equippedItems   |                 | - addXP(...)      |
     | Renders:          |                 | - completeChapter |
     | - <PetCanvas3D /> |                 +-------------------+
     | - <ChapterMap />  |                           |
     +-------------------+                           v
               ^                           +-------------------+
               |                           | CompletionSummary |
               +---------------------------+ Reads:            |
                 Returns after quiz        | - updated coins   |
                                           | - growth evolution|
                                           +-------------------+
```

### 3D Pet Companion System

Unlike flat 2D sprites, pets in **Pet Math Academy** are rendered using a procedural Three.js WebGL scene inside `PetCanvas3D.jsx`:
1. **Procedural Geometry**: Custom stylized primitives (spheres, rounded cylinders, cones) define anatomical features (muzzle, wagging tail, floppy ears, paws).
2. **Interactive Cursor Tracking**: A lightweight mouse-movement listener calculates normalized device coordinates; the head and eyes smoothly interpolate (`lerp`) toward the learner's mouse.
3. **Dynamic 3D Accessories**: When hats, bowties, sunglasses, or collars are equipped, procedural 3D meshes are parented directly to the head or body bone groups, moving naturally in 3D space.
4. **Lighting & Shadows**: Directional key lights, soft blue fill lights, and a floor-projected radial shadow disc create a grounded, tactile toy aesthetic.

### Data Model

The state schema persisted in `localStorage` under `petmath_<username>`:

```typescript
interface ProfileState {
  petType: 'dog' | 'cat' | 'penguin' | 'unicorn' | null;
  totalXP: number;
  coins: number;
  growthStage: 'baby' | 'young' | 'grown' | 'companion';
  chapterProgress: {
    counting:  { easy: boolean; medium: boolean; hard: boolean };
    addSub:    { easy: boolean; medium: boolean; hard: boolean };
    multDiv:   { easy: boolean; medium: boolean; hard: boolean };
    fractions: { easy: boolean; medium: boolean; hard: boolean };
  };
  ownedItems: string[];     // Array of purchased item IDs
  equippedItems: string[];  // Array of active accessory / background IDs
  comfortSettings: {
    reducedMotion: boolean;
    highContrast: boolean;
    dyslexiaFont: boolean;
    textSize: 'small' | 'medium' | 'large';
    readAloud: boolean;
  };
}
```

---

## React Concepts & Learning Guide

This codebase was crafted to serve as an exemplary reference for learners mastering React. Below are the foundational design patterns implemented throughout the app:

### 1. Why `useReducer` + `useContext` Beats `useState` Prop-Drilling

**The Problem**:
When building an interactive app with coins, XP, developmental stages, and equipped gear, passing state down 4 levels (`App -> Dashboard -> ChapterMap -> Node`) creates **prop-drilling**. Furthermore, completing a quiz requires updating `coins`, `totalXP`, `growthStage`, and `chapterProgress` simultaneously. Managing 5 distinct `useState` setters across different screens invites out-of-sync race conditions and scattered logic.

**The Solution**:
- **`profileReducer.js`** centralizes all state mutations into a pure, testable function. Action dispatches like `dispatch({ type: 'ADD_XP', payload: 20 })` atomically recalculate cumulative XP and evaluate whether the growth stage advanced in a single pass.
- **`ProfileContext.jsx`** acts as a global broadcast channel. Any component can call `const { profile, addCoins } = useProfile()` to access state or dispatch changes directly, keeping intermediate components clean and decoupled.

### 2. Why Wrap `localStorage` in Custom Hooks (`useLocalStorage`)

**The Problem**:
Calling `localStorage.setItem()` directly from inside a component updates the browser's disk storage, but **does not trigger a React re-render**. The UI will remain stale until another event forces an update. Furthermore, `localStorage.getItem()` is synchronous disk I/O; calling it on every render hurts frame rates.

**The Solution**:
- `useLocalStorage` combines `useState` with `localStorage`.
- **Lazy Initialization**: `useState(() => window.localStorage.getItem(...))` runs only **once** on component mount, avoiding repeated disk reads during render cycles.
- **Reactivity**: Setting a value through the hook updates React state immediately (triggering a fast virtual DOM re-render) while saving JSON to disk behind the scenes.

### 3. CSS Animation Replay & `useEffect` Cleanup

**The Problem**:
In React, setting `className="celebrate"` will trigger a CSS `@keyframes` animation. But if the user gets the next question right and the component applies `"celebrate"` again, the DOM element's class attribute does not change, and the browser **will not replay** the completed keyframe animation!

**The Solution**:
In `PetDisplay.jsx`, when `animationTrigger` fires:
```javascript
setActiveAnim('celebrate');
const timer = setTimeout(() => {
  setActiveAnim(null); // Reset class back to default
}, 650);
return () => clearTimeout(timer); // Clean up if unmounted
```
By setting `activeAnim` back to `null` once the animation duration concludes, React cleans the DOM class, allowing the next correct answer to retrigger a crisp animation from frame zero.

### 4. WebGL 3D Rendering in React with Three.js

**The Problem**:
Three.js uses imperative DOM canvas rendering, while React uses a declarative virtual DOM. Naively creating Three.js scenes inside React components can lead to multiple canvas instances, WebGL context loss, and memory leaks.

**The Solution**:
In `PetCanvas3D.jsx`:
- A React `useRef` attaches to an empty container `<div>`.
- Inside `useEffect`, the Three.js `Scene`, `Camera`, `WebGLRenderer`, and animation loop (`requestAnimationFrame`) are instantiated once.
- The `useEffect` cleanup return function cancels the animation frame, detaches mouse listeners, and invokes `renderer.dispose()`, completely freeing GPU resources when navigating away.

---

## Curriculum & Math Engine

All math questions are generated dynamically via pure functions in `src/data/questions.js`:

| Chapter | Tier | Math Concepts Covered | Example Problem |
|---|---|---|---|
| **Ch 1: Counting** | Easy | 1–10 visual object counts | *"How many are there? 🍎 🍎 🍎"* |
| | Medium | Number before/after (1–20), magnitude comparison | *"What number comes after 14?"* |
| | Hard | Skip counting by 2s/5s to 50, ascending ordering | *"Skip count by 5s: 15, 20, 25, ___"* |
| **Ch 2: Add/Sub** | Easy | Addition and subtraction within 10 | *"What is 4 + 5 = ?"* |
| | Medium | Addition and subtraction within 20 | *"What is 16 - 7 = ?"* |
| | Hard | Within 100 with regrouping/borrowing | *"What is 48 + 27 = ?"* |
| **Ch 3: Mult/Div** | Easy | Times tables 1–5 | *"What is 4 × 6 = ?"* |
| | Medium | Times tables 6–10 + single-digit division | *"What is 42 ÷ 6 = ?"* |
| | Hard | Mixed multiplication & division within 100 | *"What is 8 × 9 = ?"* |
| **Ch 4: Fractions** | Easy | Identify parts of a whole (pizza/pie slices) | *"A pizza has 4 equal slices. You eat 1. What fraction did you eat?"* |
| | Medium | Comparing fractions with same denominator | *"Which fraction is larger: 3/5 or 1/5?"* |
| | Hard | Identifying equivalent fractions | *"Which fraction is equivalent to 1/2? (2/4)"* |

Each question generator produces 4 unique options with 1 randomized correct index.

---

## Accessibility & Comfort Settings

Accessibility is first-class in Pet Math Academy:
- **Reduced Motion**: Respects `prefers-reduced-motion` and custom in-app toggle to disable camera bobbing, jumps, and rotations.
- **High Contrast**: Swaps color tokens to high-contrast dark tones with minimum 7:1 contrast ratios.
- **Dyslexia Font**: Swaps `--font-family` to Verdana with increased letter-spacing and line height.
- **Text Size**: Scales root font size from 14px to 19px across all screens.
- **Speech Synthesis**: Accessible Web Speech API integration that speaks questions and answer options on demand.
- **Touch Targets**: All interactive elements maintain a minimum hit box of **60px height** for young fingers on tablets and touchscreens.

---

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Starts Vite local development server at `http://localhost:5173` |
| `npm run build` | Compiles and optimizes assets into `dist/` bundle |
| `npm run preview` | Locally serves the production `dist/` build |
| `npm test` | Executes the Vitest unit test suite |

---

## Testing & Verification

The project includes an automated test suite verifying mathematical integrity and state reducer logic.

Run tests:
```bash
npm test
```

### Test Coverage:
- `tests/questions.test.js`:
  - 100% of chapter generators (Counting, AddSub, MultDiv, Fractions) across Easy, Medium, and Hard.
  - Verifies presence of exactly 4 unique choices per question.
  - Verifies mathematical truth of the correct answer index.
- `tests/reducer.test.js`:
  - Validates XP growth stage thresholds (`baby`, `young`, `grown`, `companion`).
  - Verifies coin addition, item purchase deduction, item equip/unequip behavior, and chapter completion flags.

---

## Production Deployment

### Static Hosting (Vercel / Netlify / Cloudflare Pages)
Since Pet Math Academy compiles to standard static HTML/JS/CSS:
1. Set **Build Command**: `npm run build`
2. Set **Publish Directory**: `dist`
3. Zero environment variables required.

### Docker Deployment
Create a `Dockerfile` in the root:
```dockerfile
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

---

## Troubleshooting

### WebGL Not Supported in Browser
- **Symptom**: 3D pet canvas appears blank.
- **Fix**: Ensure hardware acceleration is enabled in browser settings (`chrome://settings/system`). Three.js automatically degrades gracefully.

### Speech Synthesis Has No Sound
- **Symptom**: "Listen" button doesn't produce speech.
- **Fix**: Modern browsers require a user interaction (click) before granting audio permissions. Click any button on the screen to initialize audio context.

### Clearing Learner Data
- **Symptom**: Need to reset learner progress from scratch.
- **Fix**: Open Developer Tools -> Application tab -> Local Storage -> Clear `petmath_*` keys, or click the logout icon 🚪 in the app header and sign in with a new name.

---

## License

MIT License © 2026 Pet Math Academy Team. Built for young learners everywhere.
