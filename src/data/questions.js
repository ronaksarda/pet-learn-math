/**
 * src/data/questions.js
 * 
 * Pure question generator functions for K-5 Mathematics.
 * Every generator returns an immutable object:
 * {
 *   questionText: string,
 *   options: [string, string, string, string], // exactly 4 unique strings
 *   correctIndex: number                      // 0 to 3
 * }
 */

// ─── Utility Helpers ─────────────────────────────────────

/** Generate random integer in [min, max] inclusive */
export function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/** Shuffle array in-place using Fisher-Yates algorithm */
export function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = randInt(0, i);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Build 4 unique string options containing the correct answer and 3 distinct distractors.
 * @param {string|number} correct - The correct answer value
 * @param {Function} distractorGen - Function that returns plausible candidate distractors
 */
export function buildOptions(correct, distractorGen) {
  const correctStr = String(correct);
  const opts = new Set([correctStr]);

  let safety = 0;
  while (opts.size < 4 && safety < 100) {
    const candidate = String(distractorGen());
    if (candidate !== correctStr && candidate !== '') {
      opts.add(candidate);
    }
    safety++;
  }

  // Fallback if random distractor generator collides repeatedly
  let fallback = typeof correct === 'number' ? correct + 1 : 1;
  while (opts.size < 4) {
    opts.add(String(fallback++));
  }

  const shuffled = shuffle([...opts]);
  return {
    options: shuffled,
    correctIndex: shuffled.indexOf(correctStr)
  };
}

// ─── Chapter 1: Counting & Number Sense (K-1) ─────────────

export function generateCountingQuestion(difficulty) {
  if (difficulty === 'easy') {
    // Easy: count objects 1-10
    const count = randInt(1, 10);
    const icons = ['🍎', '⭐', '🎈', '🐠', '🍪', '🐶', '🌸'];
    const icon = icons[randInt(0, icons.length - 1)];
    const visual = Array(count).fill(icon).join(' ');
    
    const { options, correctIndex } = buildOptions(count, () => randInt(1, 10));
    return {
      questionText: `How many are there?\n${visual}`,
      options,
      correctIndex
    };
  }

  if (difficulty === 'medium') {
    // Medium: number before/after (1-20) or compare two numbers
    const mode = randInt(0, 2);
    if (mode === 0) {
      // Number after
      const n = randInt(1, 19);
      const ans = n + 1;
      const { options, correctIndex } = buildOptions(ans, () => randInt(1, 20));
      return {
        questionText: `What number comes after ${n}?`,
        options,
        correctIndex
      };
    } else if (mode === 1) {
      // Number before
      const n = randInt(2, 20);
      const ans = n - 1;
      const { options, correctIndex } = buildOptions(ans, () => randInt(1, 20));
      return {
        questionText: `What number comes before ${n}?`,
        options,
        correctIndex
      };
    } else {
      // Compare two numbers (which is larger)
      const a = randInt(1, 20);
      let b = randInt(1, 20);
      while (b === a) b = randInt(1, 20);
      const ans = Math.max(a, b);
      const { options, correctIndex } = buildOptions(ans, () => randInt(1, 20));
      return {
        questionText: `Which number is larger: ${a} or ${b}?`,
        options,
        correctIndex
      };
    }
  }

  // Hard: skip counting by 2s/5s to 50, or order 4 numbers
  const mode = randInt(0, 1);
  if (mode === 0) {
    const step = randInt(0, 1) === 0 ? 2 : 5;
    const start = randInt(0, 4) * step + (step === 2 ? 2 : 5);
    const seq = [start, start + step, start + step * 2];
    const ans = start + step * 3;
    const { options, correctIndex } = buildOptions(ans, () => {
      return ans + (randInt(-3, 3) * step || step);
    });
    return {
      questionText: `Skip count by ${step}s: ${seq.join(', ')}, ___`,
      options,
      correctIndex
    };
  } else {
    // Order 4 numbers smallest to largest
    const nums = [];
    while (nums.length < 4) {
      const val = randInt(1, 50);
      if (!nums.includes(val)) nums.push(val);
    }
    const sorted = [...nums].sort((a, b) => a - b);
    const ans = sorted.join(', ');

    // Distractors: wrong permutations
    const distractors = [
      [...sorted].reverse().join(', '),
      [sorted[1], sorted[0], sorted[2], sorted[3]].join(', '),
      [sorted[0], sorted[2], sorted[1], sorted[3]].join(', '),
      [sorted[0], sorted[1], sorted[3], sorted[2]].join(', ')
    ];
    let distIdx = 0;
    const { options, correctIndex } = buildOptions(ans, () => distractors[distIdx++ % distractors.length]);
    return {
      questionText: `Order smallest to largest: ${shuffle(nums).join(', ')}`,
      options,
      correctIndex
    };
  }
}

// ─── Chapter 2: Addition & Subtraction (Grades 1-2) ─────────

export function generateAddSubQuestion(difficulty) {
  const isAdd = randInt(0, 1) === 1;

  if (difficulty === 'easy') {
    // Within 10
    if (isAdd) {
      const a = randInt(1, 5);
      const b = randInt(1, 5);
      const ans = a + b;
      const { options, correctIndex } = buildOptions(ans, () => randInt(1, 10));
      return {
        questionText: `What is ${a} + ${b} = ?`,
        options,
        correctIndex
      };
    } else {
      const a = randInt(2, 10);
      const b = randInt(1, a);
      const ans = a - b;
      const { options, correctIndex } = buildOptions(ans, () => randInt(0, 10));
      return {
        questionText: `What is ${a} - ${b} = ?`,
        options,
        correctIndex
      };
    }
  }

  if (difficulty === 'medium') {
    // Within 20
    if (isAdd) {
      const a = randInt(5, 12);
      const b = randInt(3, 8);
      const ans = a + b;
      const { options, correctIndex } = buildOptions(ans, () => randInt(5, 20));
      return {
        questionText: `What is ${a} + ${b} = ?`,
        options,
        correctIndex
      };
    } else {
      const a = randInt(11, 20);
      const b = randInt(3, 10);
      const ans = a - b;
      const { options, correctIndex } = buildOptions(ans, () => randInt(1, 17));
      return {
        questionText: `What is ${a} - ${b} = ?`,
        options,
        correctIndex
      };
    }
  }

  // Hard: within 100 with regrouping
  if (isAdd) {
    // Ensure regrouping: ones digits sum >= 10
    const aOnes = randInt(5, 9);
    const bOnes = randInt(10 - aOnes, 9);
    const a = randInt(1, 4) * 10 + aOnes;
    const b = randInt(1, 4) * 10 + bOnes;
    const ans = a + b;
    const { options, correctIndex } = buildOptions(ans, () => {
      const offset = [-10, 10, -1, 1, -2, 2][randInt(0, 5)];
      return Math.max(10, ans + offset);
    });
    return {
      questionText: `What is ${a} + ${b} = ?`,
      options,
      correctIndex
    };
  } else {
    // Subtraction with borrowing (aOnes < bOnes)
    const aOnes = randInt(0, 4);
    const bOnes = randInt(aOnes + 1, 9);
    const a = randInt(3, 8) * 10 + aOnes;
    const b = randInt(1, 2) * 10 + bOnes;
    const ans = a - b;
    const { options, correctIndex } = buildOptions(ans, () => {
      const offset = [-10, 10, -1, 1, -2, 2][randInt(0, 5)];
      return Math.max(1, ans + offset);
    });
    return {
      questionText: `What is ${a} - ${b} = ?`,
      options,
      correctIndex
    };
  }
}

// ─── Chapter 3: Multiplication & Division Basics (Grade 3) ──

export function generateMultDivQuestion(difficulty) {
  if (difficulty === 'easy') {
    // Tables 1-5
    const a = randInt(1, 5);
    const b = randInt(1, 10);
    const ans = a * b;
    const { options, correctIndex } = buildOptions(ans, () => {
      const offset = [-a, a, -1, 1, 2, -2][randInt(0, 5)];
      return Math.max(1, ans + offset);
    });
    return {
      questionText: `What is ${a} × ${b} = ?`,
      options,
      correctIndex
    };
  }

  if (difficulty === 'medium') {
    // Tables 6-10 + simple division
    const isMult = randInt(0, 1) === 1;
    if (isMult) {
      const a = randInt(6, 10);
      const b = randInt(2, 9);
      const ans = a * b;
      const { options, correctIndex } = buildOptions(ans, () => {
        const offset = [-a, a, -10, 10, 2, -2][randInt(0, 5)];
        return Math.max(10, ans + offset);
      });
      return {
        questionText: `What is ${a} × ${b} = ?`,
        options,
        correctIndex
      };
    } else {
      // Division: b * c = a -> a ÷ b = c
      const c = randInt(2, 9);
      const b = randInt(2, 5);
      const a = b * c;
      const ans = c;
      const { options, correctIndex } = buildOptions(ans, () => randInt(1, 10));
      return {
        questionText: `What is ${a} ÷ ${b} = ?`,
        options,
        correctIndex
      };
    }
  }

  // Hard: mixed mult/div within 100
  const isMult = randInt(0, 1) === 1;
  if (isMult) {
    const a = randInt(6, 12);
    const b = randInt(6, 9);
    const ans = a * b;
    const { options, correctIndex } = buildOptions(ans, () => {
      const offset = [-a, a, -1, 1, -10, 10][randInt(0, 5)];
      return Math.max(10, ans + offset);
    });
    return {
      questionText: `What is ${a} × ${b} = ?`,
      options,
      correctIndex
    };
  } else {
    const c = randInt(6, 10);
    const b = randInt(6, 10);
    const a = b * c;
    const ans = c;
    const { options, correctIndex } = buildOptions(ans, () => randInt(2, 12));
    return {
      questionText: `What is ${a} ÷ ${b} = ?`,
      options,
      correctIndex
    };
  }
}

// ─── Chapter 4: Intro to Fractions (Grades 3-4) ────────────

export function generateFractionQuestion(difficulty) {
  if (difficulty === 'easy') {
    // Identify fraction from shaded shape description or parts
    const totalParts = [2, 3, 4, 6, 8][randInt(0, 4)];
    const shadedParts = randInt(1, totalParts - 1);
    const ans = `${shadedParts}/${totalParts}`;

    const { options, correctIndex } = buildOptions(ans, () => {
      const p = [2, 3, 4, 6, 8][randInt(0, 4)];
      const s = randInt(1, p - 1);
      return `${s}/${p}`;
    });

    const shapes = ['circle 🟡', 'pizza 🍕', 'pie 🥧', 'bar 🍫'];
    const shape = shapes[randInt(0, shapes.length - 1)];

    return {
      questionText: `A ${shape} is cut into ${totalParts} equal slices. You eat ${shadedParts}. What fraction did you eat?`,
      options,
      correctIndex
    };
  }

  if (difficulty === 'medium') {
    // Compare same-denominator fractions
    const denom = [4, 5, 6, 8, 10][randInt(0, 4)];
    const num1 = randInt(1, denom - 1);
    let num2 = randInt(1, denom - 1);
    while (num2 === num1) num2 = randInt(1, denom - 1);

    const larger = Math.max(num1, num2);
    const ans = `${larger}/${denom}`;

    const { options, correctIndex } = buildOptions(ans, () => {
      const d = denom;
      const n = randInt(1, d - 1);
      return `${n}/${d}`;
    });

    return {
      questionText: `Which fraction is larger: ${num1}/${denom} or ${num2}/${denom}?`,
      options,
      correctIndex
    };
  }

  // Hard: identify equivalent fractions
  const baseFractions = [
    { base: '1/2', equivalents: ['2/4', '3/6', '4/8', '5/10'] },
    { base: '1/3', equivalents: ['2/6', '3/9', '4/12'] },
    { base: '2/3', equivalents: ['4/6', '6/9'] },
    { base: '1/4', equivalents: ['2/8', '3/12'] },
    { base: '3/4', equivalents: ['6/8', '9/12'] }
  ];
  const item = baseFractions[randInt(0, baseFractions.length - 1)];
  const ans = item.equivalents[randInt(0, item.equivalents.length - 1)];

  const { options, correctIndex } = buildOptions(ans, () => {
    const denoms = [3, 4, 5, 6, 7, 8, 10];
    const d = denoms[randInt(0, denoms.length - 1)];
    const n = randInt(1, d - 1);
    return `${n}/${d}`;
  });

  return {
    questionText: `Which fraction is equivalent (equal) to ${item.base}?`,
    options,
    correctIndex
  };
}

import questionsBank from './questionsBank.json';

// ─── Chapter Dispatcher ──────────────────────────────────

/**
 * Generate a set of questions for a chosen chapter and difficulty.
 * Pulls from the curated 240-question questionsBank.json with pure generator fallback.
 * @param {'counting'|'addSub'|'multDiv'|'fractions'} chapterKey
 * @param {'easy'|'medium'|'hard'} difficulty
 * @param {number} count Default: 5
 */
export function generateChapterQuestions(chapterKey, difficulty, count = 5) {
  const bankList = questionsBank[chapterKey]?.[difficulty];
  if (bankList && bankList.length >= count) {
    const shuffledBank = shuffle([...bankList]);
    return shuffledBank.slice(0, count);
  }

  const generators = {
    counting: generateCountingQuestion,
    addSub: generateAddSubQuestion,
    multDiv: generateMultDivQuestion,
    fractions: generateFractionQuestion
  };

  const gen = generators[chapterKey] || generateCountingQuestion;
  const questions = [];
  for (let i = 0; i < count; i++) {
    questions.push(gen(difficulty));
  }
  return questions;
}

