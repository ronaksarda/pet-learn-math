/**
 * questions.js — Question generation logic per chapter/difficulty.
 * Each generator returns { question, options, correctIndex }
 * where options is an array of 4 strings and correctIndex is 0-3.
 * A set generator returns an array of 5 question objects.
 */

// ─── Helpers ─────────────────────────────────────────────

/** Random int in [min, max] inclusive. */
function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/** Shuffle array in place (Fisher-Yates). */
function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = randInt(0, i);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/** Build 4 unique options around the correct answer, place correct randomly. */
function buildOptions(correct, generator) {
  const opts = new Set();
  opts.add(String(correct));
  let safety = 0;
  while (opts.size < 4 && safety < 50) {
    opts.add(String(generator()));
    safety++;
  }
  // ponytail: fallback fill if generator keeps colliding
  let fill = typeof correct === 'number' ? correct + 1 : 1;
  while (opts.size < 4) {
    opts.add(String(fill++));
  }
  const arr = shuffle([...opts]);
  return { options: arr, correctIndex: arr.indexOf(String(correct)) };
}

// ─── Chapter 1: Counting & Number Sense ──────────────────

/** Generate one counting/number-sense question at given difficulty. */
function generateCountingQuestion(difficulty) {
  if (difficulty === 'easy') {
    // Count objects 1-10
    const count = randInt(1, 10);
    const emoji = ['🍎', '⭐', '🌸', '🐟', '🎈'][randInt(0, 4)];
    const objects = emoji.repeat(count);
    const { options, correctIndex } = buildOptions(count, () => randInt(1, 10));
    return { question: `How many? ${objects}`, options, correctIndex };
  }
  if (difficulty === 'medium') {
    const type = randInt(0, 2);
    if (type === 0) {
      // What comes after
      const n = randInt(1, 19);
      const { options, correctIndex } = buildOptions(n + 1, () => randInt(1, 20));
      return { question: `What number comes after ${n}?`, options, correctIndex };
    }
    if (type === 1) {
      // What comes before
      const n = randInt(2, 20);
      const { options, correctIndex } = buildOptions(n - 1, () => randInt(1, 20));
      return { question: `What number comes before ${n}?`, options, correctIndex };
    }
    // Compare two numbers
    let a = randInt(1, 20), b = randInt(1, 20);
    while (a === b) b = randInt(1, 20);
    const bigger = Math.max(a, b);
    const { options, correctIndex } = buildOptions(bigger, () => randInt(1, 20));
    return { question: `Which is bigger: ${a} or ${b}?`, options, correctIndex };
  }
  // Hard
  const type = randInt(0, 1);
  if (type === 0) {
    // Skip counting
    const step = randInt(0, 1) === 0 ? 2 : 5;
    const start = randInt(0, 5) * step;
    const seq = [start, start + step, start + step * 2];
    const answer = start + step * 3;
    const { options, correctIndex } = buildOptions(answer, () => randInt(1, 50));
    return {
      question: `Skip count by ${step}s: ${seq.join(', ')}, ___`,
      options, correctIndex
    };
  }
  // Order 4 numbers smallest to largest
  const nums = [];
  while (nums.length < 4) {
    const n = randInt(1, 50);
    if (!nums.includes(n)) nums.push(n);
  }
  const sorted = [...nums].sort((a, b) => a - b);
  const answer = sorted.join(', ');
  // Build wrong orderings
  const wrongOrders = [];
  for (let i = 0; i < 10 && wrongOrders.length < 3; i++) {
    const s = shuffle([...nums]).join(', ');
    if (s !== answer && !wrongOrders.includes(s)) wrongOrders.push(s);
  }
  while (wrongOrders.length < 3) wrongOrders.push([...nums].sort((a, b) => b - a).join(', '));
  const allOpts = shuffle([answer, ...wrongOrders]);
  return {
    question: `Put in order, smallest to largest: ${nums.join(', ')}`,
    options: allOpts,
    correctIndex: allOpts.indexOf(answer)
  };
}

// ─── Chapter 2: Addition & Subtraction ───────────────────

/** Generate one addition/subtraction question at given difficulty. */
function generateAddSubQuestion(difficulty) {
  let a, b, answer, question;
  if (difficulty === 'easy') {
    // Within 10
    if (randInt(0, 1)) {
      a = randInt(0, 10); b = randInt(0, 10 - a);
      answer = a + b; question = `${a} + ${b} = ?`;
    } else {
      a = randInt(1, 10); b = randInt(0, a);
      answer = a - b; question = `${a} − ${b} = ?`;
    }
  } else if (difficulty === 'medium') {
    // Within 20
    if (randInt(0, 1)) {
      a = randInt(1, 20); b = randInt(0, 20 - a);
      answer = a + b; question = `${a} + ${b} = ?`;
    } else {
      a = randInt(1, 20); b = randInt(0, a);
      answer = a - b; question = `${a} − ${b} = ?`;
    }
  } else {
    // Within 100, including regrouping
    if (randInt(0, 1)) {
      a = randInt(10, 99); b = randInt(10, 100 - a);
      answer = a + b; question = `${a} + ${b} = ?`;
    } else {
      a = randInt(20, 99); b = randInt(10, a);
      answer = a - b; question = `${a} − ${b} = ?`;
    }
  }
  const range = difficulty === 'easy' ? 10 : difficulty === 'medium' ? 20 : 100;
  const { options, correctIndex } = buildOptions(answer, () => randInt(0, range));
  return { question, options, correctIndex };
}

// ─── Chapter 3: Multiplication & Division ────────────────

/** Generate one multiplication/division question at given difficulty. */
function generateMultDivQuestion(difficulty) {
  let a, b, answer, question;
  if (difficulty === 'easy') {
    // Tables 1-5
    a = randInt(1, 5); b = randInt(1, 9);
    answer = a * b; question = `${a} × ${b} = ?`;
  } else if (difficulty === 'medium') {
    if (randInt(0, 1)) {
      // Tables 6-10
      a = randInt(6, 10); b = randInt(1, 9);
      answer = a * b; question = `${a} × ${b} = ?`;
    } else {
      // Division inverse of 1-5 tables
      a = randInt(1, 5); b = randInt(1, 9);
      const product = a * b;
      answer = b; question = `${product} ÷ ${a} = ?`;
    }
  } else {
    // Mixed within 100
    if (randInt(0, 1)) {
      a = randInt(2, 10); b = randInt(2, 10);
      answer = a * b; question = `${a} × ${b} = ?`;
    } else {
      a = randInt(2, 10); b = randInt(2, 10);
      const product = a * b;
      answer = b; question = `${product} ÷ ${a} = ?`;
    }
  }
  const { options, correctIndex } = buildOptions(answer, () => randInt(1, 100));
  return { question, options, correctIndex };
}

// ─── Chapter 4: Fractions ────────────────────────────────

/** Generate one fraction question at given difficulty. */
function generateFractionQuestion(difficulty) {
  if (difficulty === 'easy') {
    // Identify shaded fraction (halves/quarters)
    const fractions = [
      { num: 1, den: 2 }, { num: 1, den: 4 },
      { num: 2, den: 4 }, { num: 3, den: 4 }
    ];
    const frac = fractions[randInt(0, fractions.length - 1)];
    const answer = `${frac.num}/${frac.den}`;
    // Visual: use block chars to show shading
    const totalParts = frac.den;
    const shadedParts = frac.num;
    const visual = '◼'.repeat(shadedParts) + '◻'.repeat(totalParts - shadedParts);
    const { options, correctIndex } = buildOptions(answer, () => {
      const f = fractions[randInt(0, fractions.length - 1)];
      return `${f.num}/${f.den}`;
    });
    return {
      question: `What fraction is shaded? [${visual}]`,
      options, correctIndex
    };
  }
  if (difficulty === 'medium') {
    // Compare fractions same denominator
    const den = [2, 3, 4, 5, 6, 8][randInt(0, 5)];
    let a = randInt(1, den - 1), b = randInt(1, den - 1);
    while (a === b) b = randInt(1, den - 1);
    const bigger = Math.max(a, b);
    const answer = `${bigger}/${den}`;
    const smaller = `${Math.min(a, b)}/${den}`;
    const opts = shuffle([answer, smaller, `${randInt(1, den)}/${den + 1}`, `${randInt(1, den)}/${den + 2}`]);
    // Ensure answer is in there
    if (!opts.includes(answer)) opts[0] = answer;
    return {
      question: `Which is bigger: ${a}/${den} or ${b}/${den}?`,
      options: opts,
      correctIndex: opts.indexOf(answer)
    };
  }
  // Hard: equivalent fractions
  const bases = [
    { num: 1, den: 2, equivs: ['2/4', '3/6', '4/8', '5/10'] },
    { num: 1, den: 3, equivs: ['2/6', '3/9'] },
    { num: 1, den: 4, equivs: ['2/8', '3/12'] },
    { num: 2, den: 3, equivs: ['4/6', '6/9'] },
    { num: 3, den: 4, equivs: ['6/8', '9/12'] }
  ];
  const base = bases[randInt(0, bases.length - 1)];
  const answer = base.equivs[randInt(0, base.equivs.length - 1)];
  // Build wrong options that are NOT equivalent
  const wrongs = new Set();
  let safety = 0;
  while (wrongs.size < 3 && safety < 30) {
    const n = randInt(1, 9), d = randInt(2, 12);
    const cand = `${n}/${d}`;
    if (!base.equivs.includes(cand) && cand !== `${base.num}/${base.den}`) {
      wrongs.add(cand);
    }
    safety++;
  }
  const opts = shuffle([answer, ...wrongs]);
  return {
    question: `Which fraction equals ${base.num}/${base.den}?`,
    options: opts,
    correctIndex: opts.indexOf(answer)
  };
}

// ─── Public: Generate a set of 5 questions ───────────────

/** Map chapter key to its generator function. */
const GENERATORS = {
  counting:  generateCountingQuestion,
  addSub:    generateAddSubQuestion,
  multDiv:   generateMultDivQuestion,
  fractions: generateFractionQuestion
};

/** Generate 5 questions for a chapter + difficulty combo. */
function generateQuestionSet(chapter, difficulty) {
  const gen = GENERATORS[chapter];
  if (!gen) throw new Error(`Unknown chapter: ${chapter}`);
  return Array.from({ length: 5 }, () => gen(difficulty));
}
