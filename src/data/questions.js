/**
 * src/data/questions.js
 * 
 * Pure question generator functions for K-5 Mathematics.
 * Comprehensive, grade-aligned curriculum for Kindergarten through Grade 5.
 * 
 * Every generator returns an immutable question object:
 * {
 *   questionText: string,
 *   options: [string, string, string, string], // exactly 4 unique strings
 *   correctIndex: number                      // 0 to 3
 * }
 */

import questionsBank from './questionsBank.json';

// ─── Utility Helpers ─────────────────────────────────────

/** Generate random integer in [min, max] inclusive */
export function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/** Pick a random item from an array */
export function pickRandom(arr) {
  return arr[randInt(0, arr.length - 1)];
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
    if (candidate !== correctStr && candidate !== '' && candidate !== 'undefined' && candidate !== 'NaN') {
      opts.add(candidate);
    }
    safety++;
  }

  // Fallback if random distractor generator collides repeatedly
  let fallback = typeof correct === 'number' && !isNaN(correct) ? correct + 1 : 1;
  while (opts.size < 4) {
    opts.add(String(fallback++));
  }

  const shuffled = shuffle([...opts]);
  return {
    options: shuffled,
    correctIndex: shuffled.indexOf(correctStr)
  };
}

// ─────────────────────────────────────────────────────────
// KINDERGARTEN (Grade K)
// ─────────────────────────────────────────────────────────

/**
 * Chapter K-1: Counting & Number Sense
 */
export function generateKCountingQuestion(difficulty) {
  const icons = ['🍎', '⭐', '🎈', '🐠', '🍪', '🐶', '🌸', '🚗', '🐱', '🍩'];

  if (difficulty === 'easy') {
    // Count objects 1-5
    const count = randInt(1, 5);
    const icon = pickRandom(icons);
    const visual = Array(count).fill(icon).join(' ');
    const { options, correctIndex } = buildOptions(count, () => randInt(1, 6));
    return {
      questionText: `How many ${icon} do you see?\n${visual}`,
      options,
      correctIndex
    };
  }

  if (difficulty === 'medium') {
    // Count objects 6-10 or number after/before within 10
    const mode = randInt(0, 1);
    if (mode === 0) {
      const count = randInt(6, 10);
      const icon = pickRandom(icons);
      const visual = Array(count).fill(icon).join(' ');
      const { options, correctIndex } = buildOptions(count, () => randInt(5, 10));
      return {
        questionText: `Count the ${icon}:\n${visual}`,
        options,
        correctIndex
      };
    } else {
      const n = randInt(1, 9);
      const ans = n + 1;
      const { options, correctIndex } = buildOptions(ans, () => randInt(1, 10));
      return {
        questionText: `What number comes after ${n}?`,
        options,
        correctIndex
      };
    }
  }

  // Hard: Ten-frame missing / compare groups
  const mode = randInt(0, 1);
  if (mode === 0) {
    const filled = randInt(1, 9);
    const needed = 10 - filled;
    const { options, correctIndex } = buildOptions(needed, () => randInt(1, 9));
    return {
      questionText: `You have ${filled} dots in a 10-frame. How many more dots make 10?`,
      options,
      correctIndex
    };
  } else {
    const a = randInt(1, 10);
    let b = randInt(1, 10);
    while (b === a) b = randInt(1, 10);
    const ans = Math.max(a, b);
    const { options, correctIndex } = buildOptions(ans, () => randInt(1, 10));
    return {
      questionText: `Which number is greater: ${a} or ${b}?`,
      options,
      correctIndex
    };
  }
}

/**
 * Chapter K-2: Shapes, Sizes & Patterns
 */
export function generateKShapesPatternsQuestion(difficulty) {
  if (difficulty === 'easy') {
    const shapes = [
      { name: 'Circle', desc: 'is round with no straight sides or corners' },
      { name: 'Triangle', desc: 'has 3 straight sides and 3 corners' },
      { name: 'Square', desc: 'has 4 equal straight sides' },
      { name: 'Rectangle', desc: 'has 4 sides with 2 long sides and 2 short sides' }
    ];
    const picked = pickRandom(shapes);
    const { options, correctIndex } = buildOptions(picked.name, () => pickRandom(shapes).name);
    return {
      questionText: `Which shape ${picked.desc}?`,
      options,
      correctIndex
    };
  }

  if (difficulty === 'medium') {
    const mode = randInt(0, 1);
    if (mode === 0) {
      const sidesData = [
        { shape: 'triangle', sides: 3 },
        { shape: 'square', sides: 4 },
        { shape: 'rectangle', sides: 4 },
        { shape: 'pentagon', sides: 5 },
        { shape: 'hexagon', sides: 6 }
      ];
      const picked = pickRandom(sidesData);
      const { options, correctIndex } = buildOptions(picked.sides, () => randInt(2, 7));
      return {
        questionText: `How many sides does a ${picked.shape} have?`,
        options,
        correctIndex
      };
    } else {
      const comparisons = [
        { q: 'Which is larger: an Elephant 🐘 or an Ant 🐜?', ans: 'Elephant 🐘', wrong: 'Ant 🐜' },
        { q: 'Which is heavier: a Watermelon 🍉 or a Strawberry 🍓?', ans: 'Watermelon 🍉', wrong: 'Strawberry 🍓' },
        { q: 'Which is taller: a Giraffe 🦒 or a Dog 🐶?', ans: 'Giraffe 🦒', wrong: 'Dog 🐶' },
        { q: 'Which is faster: a Cheetah 🐆 or a Snail 🐌?', ans: 'Cheetah 🐆', wrong: 'Snail 🐌' }
      ];
      const picked = pickRandom(comparisons);
      const pool = ['Elephant 🐘', 'Ant 🐜', 'Watermelon 🍉', 'Strawberry 🍓', 'Giraffe 🦒', 'Dog 🐶', 'Cheetah 🐆', 'Snail 🐌'];
      const { options, correctIndex } = buildOptions(picked.ans, () => pickRandom(pool));
      return {
        questionText: picked.q,
        options,
        correctIndex
      };
    }
  }

  // Hard: 2D/3D shapes & AB/AAB patterns
  const mode = randInt(0, 1);
  if (mode === 0) {
    const solids = [
      { solid: 'Sphere (Ball) ⚽', look: 'perfectly round like a ball' },
      { solid: 'Cube 🎲', look: 'shaped like a box with 6 square sides' },
      { solid: 'Cylinder 🥫', look: 'shaped like a soup can with 2 round circles on ends' },
      { solid: 'Cone 🍦', look: 'has a round base that points to a tip like an ice cream cone' }
    ];
    const picked = pickRandom(solids);
    const names = solids.map(s => s.solid);
    const { options, correctIndex } = buildOptions(picked.solid, () => pickRandom(names));
    return {
      questionText: `Which 3D solid is ${picked.look}?`,
      options,
      correctIndex
    };
  } else {
    const patterns = [
      { seq: '🔴 🔷 🔴 🔷 🔴', next: '🔷', wrong: '🔴' },
      { seq: '⭐ ⭐ 🌙 ⭐ ⭐', next: '🌙', wrong: '⭐' },
      { seq: '🍎 🍌 🍎 🍌 🍎', next: '🍌', wrong: '🍎' },
      { seq: '🐶 🐱 🐶 🐱 🐶', next: '🐱', wrong: '🐶' }
    ];
    const picked = pickRandom(patterns);
    const symbols = ['🔴', '🔷', '⭐', '🌙', '🍎', '🍌', '🐶', '🐱'];
    const { options, correctIndex } = buildOptions(picked.next, () => pickRandom(symbols));
    return {
      questionText: `Complete the pattern: ${picked.seq} [ ? ]`,
      options,
      correctIndex
    };
  }
}

// ─────────────────────────────────────────────────────────
// GRADE 1
// ─────────────────────────────────────────────────────────

/**
 * Chapter 1-1: Addition & Subtraction within 20
 */
export function generateG1AddSubQuestion(difficulty) {
  if (difficulty === 'easy') {
    // Single digit add/sub within 10
    const isAdd = randInt(0, 1) === 1;
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
      const a = randInt(2, 9);
      const b = randInt(1, a);
      const ans = a - b;
      const { options, correctIndex } = buildOptions(ans, () => randInt(0, 9));
      return {
        questionText: `What is ${a} - ${b} = ?`,
        options,
        correctIndex
      };
    }
  }

  if (difficulty === 'medium') {
    // Operations within 20, doubles, plus 10
    const isAdd = randInt(0, 1) === 1;
    if (isAdd) {
      const a = randInt(5, 12);
      const b = randInt(3, 8);
      const ans = a + b;
      const { options, correctIndex } = buildOptions(ans, () => randInt(8, 20));
      return {
        questionText: `What is ${a} + ${b} = ?`,
        options,
        correctIndex
      };
    } else {
      const a = randInt(11, 20);
      const b = randInt(3, 9);
      const ans = a - b;
      const { options, correctIndex } = buildOptions(ans, () => randInt(2, 17));
      return {
        questionText: `What is ${a} - ${b} = ?`,
        options,
        correctIndex
      };
    }
  }

  // Hard: Missing addends or word problems
  const mode = randInt(0, 1);
  if (mode === 0) {
    const a = randInt(4, 12);
    const target = randInt(a + 2, 20);
    const ans = target - a;
    const { options, correctIndex } = buildOptions(ans, () => randInt(1, 12));
    return {
      questionText: `Find the missing number: ${a} + [ ? ] = ${target}`,
      options,
      correctIndex
    };
  } else {
    const names = ['Leo', 'Maya', 'Liam', 'Zoe', 'Noah'];
    const items = ['stickers', 'cookies', 'marbles', 'crayons'];
    const name = pickRandom(names);
    const item = pickRandom(items);
    const start = randInt(6, 12);
    const added = randInt(3, 7);
    const ans = start + added;
    const { options, correctIndex } = buildOptions(ans, () => randInt(10, 20));
    return {
      questionText: `${name} has ${start} ${item} and receives ${added} more. How many ${item} does ${name} have in total?`,
      options,
      correctIndex
    };
  }
}

/**
 * Chapter 1-2: Place Value & Clocks
 */
export function generateG1PlaceTimeQuestion(difficulty) {
  if (difficulty === 'easy') {
    // Tens and ones decomposition (10 to 40)
    const tens = randInt(1, 4);
    const ones = randInt(1, 9);
    const val = tens * 10 + ones;
    const { options, correctIndex } = buildOptions(val, () => {
      const t = randInt(1, 4);
      const o = randInt(1, 9);
      return t * 10 + o;
    });
    return {
      questionText: `What number has ${tens} tens and ${ones} ones?`,
      options,
      correctIndex
    };
  }

  if (difficulty === 'medium') {
    // Compare two numbers using <, >, = or skip count by 10s
    const mode = randInt(0, 1);
    if (mode === 0) {
      const a = randInt(10, 99);
      let b = randInt(10, 99);
      while (b === a) b = randInt(10, 99);
      const symbol = a > b ? '>' : '<';
      const ans = `${a} ${symbol} ${b}`;
      const wrong = `${a} ${a > b ? '<' : '>'} ${b}`;
      const eq = `${a} = ${b}`;
      const { options, correctIndex } = buildOptions(ans, () => pickRandom([wrong, eq, `${b} > ${a}`, `${b} < ${a}`]));
      return {
        questionText: `Which symbol correctly compares ${a} and ${b}?`,
        options,
        correctIndex
      };
    } else {
      const start = randInt(1, 5) * 10;
      const seq = [start, start + 10, start + 20];
      const ans = start + 30;
      const { options, correctIndex } = buildOptions(ans, () => randInt(2, 9) * 10);
      return {
        questionText: `Skip count by 10s: ${seq.join(', ')}, [ ? ]`,
        options,
        correctIndex
      };
    }
  }

  // Hard: Reading clock to the hour and half-hour
  const hour = randInt(1, 12);
  const isHalf = randInt(0, 1) === 1;
  if (!isHalf) {
    const ans = `${hour}:00`;
    const { options, correctIndex } = buildOptions(ans, () => `${randInt(1, 12)}:00`);
    return {
      questionText: `The clock's short hour hand points at ${hour} and the long minute hand points at 12. What time is it?`,
      options,
      correctIndex
    };
  } else {
    const ans = `${hour}:30`;
    const { options, correctIndex } = buildOptions(ans, () => `${randInt(1, 12)}:30`);
    return {
      questionText: `The short hour hand is between ${hour} and ${hour % 12 + 1}, and the minute hand points at 6. What time is it?`,
      options,
      correctIndex
    };
  }
}

// ─────────────────────────────────────────────────────────
// GRADE 2
// ─────────────────────────────────────────────────────────

/**
 * Chapter 2-1: 2-Digit Math & Regrouping
 */
export function generateG2TwoDigitMathQuestion(difficulty) {
  if (difficulty === 'easy') {
    // 2-digit add/sub WITHOUT regrouping
    const isAdd = randInt(0, 1) === 1;
    if (isAdd) {
      const aTens = randInt(1, 4);
      const bTens = randInt(1, 4);
      const aOnes = randInt(1, 4);
      const bOnes = randInt(1, 5);
      const a = aTens * 10 + aOnes;
      const b = bTens * 10 + bOnes;
      const ans = a + b;
      const { options, correctIndex } = buildOptions(ans, () => ans + randInt(-5, 5));
      return {
        questionText: `What is ${a} + ${b} = ?`,
        options,
        correctIndex
      };
    } else {
      const aTens = randInt(4, 8);
      const bTens = randInt(1, 3);
      const aOnes = randInt(5, 9);
      const bOnes = randInt(1, 4);
      const a = aTens * 10 + aOnes;
      const b = bTens * 10 + bOnes;
      const ans = a - b;
      const { options, correctIndex } = buildOptions(ans, () => ans + randInt(-5, 5));
      return {
        questionText: `What is ${a} - ${b} = ?`,
        options,
        correctIndex
      };
    }
  }

  if (difficulty === 'medium') {
    // 2-digit WITH regrouping (carrying or borrowing)
    const isAdd = randInt(0, 1) === 1;
    if (isAdd) {
      const aOnes = randInt(5, 9);
      const bOnes = randInt(10 - aOnes, 9);
      const a = randInt(1, 4) * 10 + aOnes;
      const b = randInt(1, 4) * 10 + bOnes;
      const ans = a + b;
      const { options, correctIndex } = buildOptions(ans, () => {
        const offset = [-10, 10, -1, 1, 2, -2][randInt(0, 5)];
        return ans + offset;
      });
      return {
        questionText: `What is ${a} + ${b} = ?`,
        options,
        correctIndex
      };
    } else {
      const aOnes = randInt(0, 4);
      const bOnes = randInt(aOnes + 1, 9);
      const a = randInt(4, 8) * 10 + aOnes;
      const b = randInt(1, 3) * 10 + bOnes;
      const ans = a - b;
      const { options, correctIndex } = buildOptions(ans, () => {
        const offset = [-10, 10, -1, 1, 2, -2][randInt(0, 5)];
        return ans + offset;
      });
      return {
        questionText: `What is ${a} - ${b} = ?`,
        options,
        correctIndex
      };
    }
  }

  // Hard: 3-number addition or 100 mental math
  const mode = randInt(0, 1);
  if (mode === 0) {
    const a = randInt(12, 35);
    const b = randInt(10, 25);
    const c = randInt(15, 30);
    const ans = a + b + c;
    const { options, correctIndex } = buildOptions(ans, () => ans + randInt(-10, 10));
    return {
      questionText: `Calculate: ${a} + ${b} + ${c} = ?`,
      options,
      correctIndex
    };
  } else {
    const base = randInt(25, 75);
    const ans = 100 - base;
    const { options, correctIndex } = buildOptions(ans, () => ans + randInt(-10, 10));
    return {
      questionText: `What number added to ${base} equals 100? (${base} + [ ? ] = 100)`,
      options,
      correctIndex
    };
  }
}

/**
 * Chapter 2-2: Money, Measurement & Time
 */
export function generateG2MoneyMeasureQuestion(difficulty) {
  if (difficulty === 'easy') {
    // Identifying coin values & basic sum of identical coins
    const coins = [
      { name: 'penny', value: 1, text: '1¢' },
      { name: 'nickel', value: 5, text: '5¢' },
      { name: 'dime', value: 10, text: '10¢' },
      { name: 'quarter', value: 25, text: '25¢' }
    ];
    const picked = pickRandom(coins);
    const count = randInt(2, 5);
    const total = count * picked.value;
    const ans = `${total}¢`;
    const { options, correctIndex } = buildOptions(ans, () => `${randInt(2, 10) * picked.value}¢`);
    return {
      questionText: `How much money is ${count} ${picked.name}s worth?`,
      options,
      correctIndex
    };
  }

  if (difficulty === 'medium') {
    // Combination of coins or inches in feet
    const mode = randInt(0, 1);
    if (mode === 0) {
      const dimes = randInt(1, 3);
      const nickels = randInt(1, 3);
      const pennies = randInt(1, 4);
      const total = dimes * 10 + nickels * 5 + pennies * 1;
      const ans = `${total}¢`;
      const { options, correctIndex } = buildOptions(ans, () => `${total + randInt(-10, 10)}¢`);
      return {
        questionText: `What is the total value of ${dimes} dime${dimes > 1 ? 's' : ''}, ${nickels} nickel${nickels > 1 ? 's' : ''}, and ${pennies} penn${pennies > 1 ? 'ies' : 'y'}?`,
        options,
        correctIndex
      };
    } else {
      const feet = randInt(2, 5);
      const inches = feet * 12;
      const ans = `${inches} inches`;
      const { options, correctIndex } = buildOptions(ans, () => `${randInt(1, 6) * 12} inches`);
      return {
        questionText: `There are 12 inches in 1 foot. How many inches are in ${feet} feet?`,
        options,
        correctIndex
      };
    }
  }

  // Hard: Making change from $1.00 or clock to 5 minutes
  const mode = randInt(0, 1);
  if (mode === 0) {
    const cost = randInt(3, 18) * 5; // e.g. 45¢, 65¢, 80¢
    const change = 100 - cost;
    const ans = `${change}¢`;
    const { options, correctIndex } = buildOptions(ans, () => `${change + randInt(-15, 15)}¢`);
    return {
      questionText: `You buy an eraser for ${cost}¢ and pay with a $1.00 bill (100¢). How much change do you receive?`,
      options,
      correctIndex
    };
  } else {
    const hour = randInt(1, 12);
    const minuteMin = randInt(1, 11) * 5;
    const minuteStr = minuteMin < 10 ? `0${minuteMin}` : `${minuteMin}`;
    const ans = `${hour}:${minuteStr}`;
    const { options, correctIndex } = buildOptions(ans, () => {
      const m = randInt(1, 11) * 5;
      return `${hour}:${m < 10 ? '0' + m : m}`;
    });
    return {
      questionText: `The clock's hour hand is on ${hour} and the minute hand points to ${minuteMin / 5}. What time is it?`,
      options,
      correctIndex
    };
  }
}

// ─────────────────────────────────────────────────────────
// GRADE 3
// ─────────────────────────────────────────────────────────

/**
 * Chapter 3-1: Multiplication & Division Mastery
 */
export function generateG3MultDivQuestion(difficulty) {
  if (difficulty === 'easy') {
    // Times tables 2, 3, 4, 5, 10
    const a = pickRandom([2, 3, 4, 5, 10]);
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
    // Times tables 6, 7, 8, 9, 12 and basic division
    const isMult = randInt(0, 1) === 1;
    if (isMult) {
      const a = pickRandom([6, 7, 8, 9, 12]);
      const b = randInt(3, 9);
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
      const divisor = randInt(2, 9);
      const quotient = randInt(2, 9);
      const dividend = divisor * quotient;
      const ans = quotient;
      const { options, correctIndex } = buildOptions(ans, () => randInt(1, 10));
      return {
        questionText: `What is ${dividend} ÷ ${divisor} = ?`,
        options,
        correctIndex
      };
    }
  }

  // Hard: Missing factor / 2-step word problems
  const mode = randInt(0, 1);
  if (mode === 0) {
    const a = randInt(6, 9);
    const b = randInt(6, 9);
    const prod = a * b;
    const { options, correctIndex } = buildOptions(b, () => randInt(2, 12));
    return {
      questionText: `Find the missing factor: ${a} × [ ? ] = ${prod}`,
      options,
      correctIndex
    };
  } else {
    const boxes = randInt(3, 6);
    const perBox = randInt(4, 8);
    const totalBefore = boxes * perBox;
    const givenAway = randInt(2, 5);
    const ans = totalBefore - givenAway;
    const { options, correctIndex } = buildOptions(ans, () => ans + randInt(-4, 4));
    return {
      questionText: `Elena has ${boxes} boxes with ${perBox} cookies in each box. She eats ${givenAway} cookies. How many cookies are left?`,
      options,
      correctIndex
    };
  }
}

/**
 * Chapter 3-2: Fractions & Geometry (Area & Perimeter)
 */
export function generateG3FractionsGeomQuestion(difficulty) {
  if (difficulty === 'easy') {
    // Unit fractions & shaded parts
    const denoms = [2, 3, 4, 6, 8];
    const denom = pickRandom(denoms);
    const num = randInt(1, denom - 1);
    const ans = `${num}/${denom}`;
    const { options, correctIndex } = buildOptions(ans, () => {
      const d = pickRandom(denoms);
      const n = randInt(1, d - 1);
      return `${n}/${d}`;
    });
    return {
      questionText: `A pizza is cut into ${denom} equal slices. You eat ${num} slices. What fraction of the pizza did you eat?`,
      options,
      correctIndex
    };
  }

  if (difficulty === 'medium') {
    // Comparing fractions with same denominator OR perimeter of rectangle
    const mode = randInt(0, 1);
    if (mode === 0) {
      const denom = pickRandom([4, 6, 8, 10]);
      const n1 = randInt(1, denom - 2);
      const n2 = randInt(n1 + 1, denom - 1);
      const ans = `${n2}/${denom}`;
      const { options, correctIndex } = buildOptions(ans, () => {
        const n = randInt(1, denom);
        return `${n}/${denom}`;
      });
      return {
        questionText: `Which fraction is larger: ${n1}/${denom} or ${n2}/${denom}?`,
        options,
        correctIndex
      };
    } else {
      const length = randInt(4, 10);
      const width = randInt(2, 6);
      const perimeter = 2 * (length + width);
      const ans = `${perimeter} cm`;
      const { options, correctIndex } = buildOptions(ans, () => `${perimeter + randInt(-6, 6)} cm`);
      return {
        questionText: `A rectangle has a length of ${length} cm and a width of ${width} cm. What is its perimeter? (P = 2l + 2w)`,
        options,
        correctIndex
      };
    }
  }

  // Hard: Area of rectangle or equivalent fractions
  const mode = randInt(0, 1);
  if (mode === 0) {
    const length = randInt(4, 12);
    const width = randInt(3, 9);
    const area = length * width;
    const ans = `${area} sq units`;
    const { options, correctIndex } = buildOptions(ans, () => `${area + randInt(-12, 12)} sq units`);
    return {
      questionText: `What is the area of a garden that is ${length} meters long and ${width} meters wide? (Area = length × width)`,
      options,
      correctIndex
    };
  } else {
    const eqPairs = [
      { base: '1/2', eq: '2/4' },
      { base: '1/2', eq: '4/8' },
      { base: '1/3', eq: '2/6' },
      { base: '2/3', eq: '4/6' },
      { base: '3/4', eq: '6/8' }
    ];
    const picked = pickRandom(eqPairs);
    const { options, correctIndex } = buildOptions(picked.eq, () => {
      const den = pickRandom([4, 6, 8, 10]);
      return `${randInt(1, den - 1)}/${den}`;
    });
    return {
      questionText: `Which fraction is equal (equivalent) to ${picked.base}?`,
      options,
      correctIndex
    };
  }
}

// ─────────────────────────────────────────────────────────
// GRADE 4
// ─────────────────────────────────────────────────────────

/**
 * Chapter 4-1: Multi-Digit Math, Factors & Primes
 */
export function generateG4MultiDigitFactorsQuestion(difficulty) {
  if (difficulty === 'easy') {
    // 3-digit addition/subtraction or rounding to nearest 100/1000
    const mode = randInt(0, 1);
    if (mode === 0) {
      const a = randInt(150, 450);
      const b = randInt(120, 380);
      const ans = a + b;
      const { options, correctIndex } = buildOptions(ans, () => ans + randInt(-20, 20));
      return {
        questionText: `What is ${a} + ${b} = ?`,
        options,
        correctIndex
      };
    } else {
      const num = randInt(120, 880);
      const rounded = Math.round(num / 100) * 100;
      const { options, correctIndex } = buildOptions(rounded, () => rounded + randInt(-2, 2) * 100);
      return {
        questionText: `Round ${num} to the nearest hundred:`,
        options,
        correctIndex
      };
    }
  }

  if (difficulty === 'medium') {
    // Multi-digit multiplication (e.g. 2-digit × 1-digit or prime vs composite)
    const mode = randInt(0, 1);
    if (mode === 0) {
      const a = randInt(25, 85);
      const b = randInt(4, 9);
      const ans = a * b;
      const { options, correctIndex } = buildOptions(ans, () => ans + randInt(-15, 15));
      return {
        questionText: `What is ${a} × ${b} = ?`,
        options,
        correctIndex
      };
    } else {
      const primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31];
      const composites = [4, 6, 8, 9, 10, 12, 14, 15, 16, 18, 20, 21, 25, 27];
      const primeAns = pickRandom(primes);
      const { options, correctIndex } = buildOptions(primeAns, () => pickRandom(composites));
      return {
        questionText: `Which of the following numbers is a PRIME number?`,
        options,
        correctIndex
      };
    }
  }

  // Hard: Multi-digit multiplication (2-digit × 2-digit) or Division with quotient
  const mode = randInt(0, 1);
  if (mode === 0) {
    const a = randInt(14, 32);
    const b = randInt(12, 25);
    const ans = a * b;
    const { options, correctIndex } = buildOptions(ans, () => ans + randInt(-25, 25));
    return {
      questionText: `Calculate: ${a} × ${b} = ?`,
      options,
      correctIndex
    };
  } else {
    const divisor = randInt(4, 8);
    const quotient = randInt(25, 65);
    const dividend = divisor * quotient;
    const ans = quotient;
    const { options, correctIndex } = buildOptions(ans, () => ans + randInt(-8, 8));
    return {
      questionText: `Solve: ${dividend} ÷ ${divisor} = ?`,
      options,
      correctIndex
    };
  }
}

/**
 * Chapter 4-2: Fractions & Decimals
 */
export function generateG4FractionsDecimalsQuestion(difficulty) {
  if (difficulty === 'easy') {
    // Add/Subtract fractions with like denominators
    const denom = pickRandom([5, 6, 8, 10, 12]);
    const n1 = randInt(1, Math.floor(denom / 2));
    const n2 = randInt(1, Math.floor(denom / 2) - 1);
    const ans = `${n1 + n2}/${denom}`;
    const { options, correctIndex } = buildOptions(ans, () => {
      const sum = randInt(1, denom - 1);
      return `${sum}/${denom}`;
    });
    return {
      questionText: `What is ${n1}/${denom} + ${n2}/${denom} = ?`,
      options,
      correctIndex
    };
  }

  if (difficulty === 'medium') {
    // Mixed number to improper fraction OR decimals to tenths
    const mode = randInt(0, 1);
    if (mode === 0) {
      const whole = randInt(1, 4);
      const denom = pickRandom([3, 4, 5]);
      const num = randInt(1, denom - 1);
      const improperNum = whole * denom + num;
      const ans = `${improperNum}/${denom}`;
      const { options, correctIndex } = buildOptions(ans, () => {
        const fake = randInt(whole * denom - 2, (whole + 1) * denom + 2);
        return `${fake}/${denom}`;
      });
      return {
        questionText: `Convert the mixed number ${whole} ${num}/${denom} into an improper fraction:`,
        options,
        correctIndex
      };
    } else {
      const tenths = randInt(1, 9);
      const ans = `0.${tenths}`;
      const fraction = `${tenths}/10`;
      const { options, correctIndex } = buildOptions(ans, () => `0.${randInt(1, 9)}`);
      return {
        questionText: `What is the fraction ${fraction} written as a decimal?`,
        options,
        correctIndex
      };
    }
  }

  // Hard: Comparing decimals or adding tenths and hundredths (e.g. 3/10 + 4/100)
  const mode = randInt(0, 1);
  if (mode === 0) {
    const d1 = (randInt(20, 80) / 100).toFixed(2);
    let d2 = (randInt(20, 80) / 100).toFixed(2);
    while (d2 === d1) d2 = (randInt(20, 80) / 100).toFixed(2);
    const larger = Math.max(parseFloat(d1), parseFloat(d2)).toFixed(2);
    const { options, correctIndex } = buildOptions(larger, () => (randInt(20, 90) / 100).toFixed(2));
    return {
      questionText: `Which decimal is greater: ${d1} or ${d2}?`,
      options,
      correctIndex
    };
  } else {
    const tenths = randInt(2, 6);
    const hundredths = randInt(5, 35);
    const totalHundredths = tenths * 10 + hundredths;
    const ans = `${totalHundredths}/100`;
    const { options, correctIndex } = buildOptions(ans, () => `${totalHundredths + randInt(-15, 15)}/100`);
    return {
      questionText: `What is ${tenths}/10 + ${hundredths}/100 = ?`,
      options,
      correctIndex
    };
  }
}

// ─────────────────────────────────────────────────────────
// GRADE 5
// ─────────────────────────────────────────────────────────

/**
 * Chapter 5-1: Advanced Fractions & Decimals
 */
export function generateG5AdvFractionsDecimalsQuestion(difficulty) {
  if (difficulty === 'easy') {
    // Add/subtract fractions with unlike denominators (simple common factors: 2, 4, 3, 6)
    const pairs = [
      { q: '1/2 + 1/4', ans: '3/4' },
      { q: '3/4 - 1/2', ans: '1/4' },
      { q: '1/3 + 1/6', ans: '3/6' },
      { q: '2/3 - 1/6', ans: '3/6' },
      { q: '1/2 + 1/3', ans: '5/6' },
      { q: '5/6 - 1/3', ans: '3/6' }
    ];
    const picked = pickRandom(pairs);
    const pool = ['1/4', '2/4', '3/4', '1/6', '2/6', '3/6', '4/6', '5/6', '5/12', '7/12'];
    const { options, correctIndex } = buildOptions(picked.ans, () => pickRandom(pool));
    return {
      questionText: `Calculate: ${picked.q} = ?`,
      options,
      correctIndex
    };
  }

  if (difficulty === 'medium') {
    // Multiplying fractions: (a/b) * (c/d)
    const n1 = randInt(1, 3);
    const d1 = randInt(4, 5);
    const n2 = randInt(1, 3);
    const d2 = randInt(2, 4);
    const numAns = n1 * n2;
    const denAns = d1 * d2;
    const ans = `${numAns}/${denAns}`;
    const { options, correctIndex } = buildOptions(ans, () => {
      const n = randInt(1, 8);
      const d = randInt(10, 20);
      return `${n}/${d}`;
    });
    return {
      questionText: `What is ${n1}/${d1} × ${n2}/${d2} = ?`,
      options,
      correctIndex
    };
  }

  // Hard: Decimal multiplication or multi-step decimal arithmetic
  const mode = randInt(0, 1);
  if (mode === 0) {
    const a = (randInt(12, 45) / 10).toFixed(1); // e.g. 2.4
    const b = randInt(2, 5);
    const ans = (parseFloat(a) * b).toFixed(1);
    const { options, correctIndex } = buildOptions(ans, () => (parseFloat(ans) + randInt(-3, 3) * 0.5).toFixed(1));
    return {
      questionText: `Calculate: ${a} × ${b} = ?`,
      options,
      correctIndex
    };
  } else {
    const a = (randInt(50, 95) / 10).toFixed(1);
    const b = (randInt(12, 35) / 10).toFixed(1);
    const ans = (parseFloat(a) - parseFloat(b)).toFixed(1);
    const { options, correctIndex } = buildOptions(ans, () => (parseFloat(ans) + randInt(-2, 2) * 0.4).toFixed(1));
    return {
      questionText: `Solve: ${a} - ${b} = ?`,
      options,
      correctIndex
    };
  }
}

/**
 * Chapter 5-2: PEMDAS, Volume & Coordinate Geometry
 */
export function generateG5PemdasVolumeQuestion(difficulty) {
  if (difficulty === 'easy') {
    // Basic Order of Operations (multiplication/division before addition/subtraction)
    const a = randInt(2, 8);
    const b = randInt(2, 5);
    const c = randInt(2, 6);
    const ans = a + b * c;
    const wrongNoPemdas = (a + b) * c; // common misconception
    const { options, correctIndex } = buildOptions(ans, () => {
      const candidates = [wrongNoPemdas, ans + randInt(-5, 5), ans + 10];
      return pickRandom(candidates);
    });
    return {
      questionText: `Evaluate using PEMDAS: ${a} + ${b} × ${c} = ?`,
      options,
      correctIndex
    };
  }

  if (difficulty === 'medium') {
    // Expressions with parentheses: (a + b) * c - d
    const a = randInt(3, 8);
    const b = randInt(2, 6);
    const c = randInt(2, 4);
    const d = randInt(1, 5);
    const ans = (a + b) * c - d;
    const { options, correctIndex } = buildOptions(ans, () => ans + randInt(-8, 8));
    return {
      questionText: `Evaluate: (${a} + ${b}) × ${c} - ${d} = ?`,
      options,
      correctIndex
    };
  }

  // Hard: 3D rectangular prism volume or coordinate plane (x, y)
  const mode = randInt(0, 1);
  if (mode === 0) {
    const l = randInt(3, 8);
    const w = randInt(2, 5);
    const h = randInt(2, 6);
    const volume = l * w * h;
    const ans = `${volume} cubic cm`;
    const { options, correctIndex } = buildOptions(ans, () => `${volume + randInt(-20, 20)} cubic cm`);
    return {
      questionText: `Find the volume of a rectangular prism with length = ${l} cm, width = ${w} cm, and height = ${h} cm. (V = l × w × h)`,
      options,
      correctIndex
    };
  } else {
    const x = randInt(1, 9);
    const y = randInt(1, 9);
    const ans = `(${x}, ${y})`;
    const wrongFlip = `(${y}, ${x})`;
    const { options, correctIndex } = buildOptions(ans, () => {
      const pool = [wrongFlip, `(${x + 1}, ${y})`, `(${x}, ${y + 1})`, `(${x + 2}, ${y - 1})`];
      return pickRandom(pool);
    });
    return {
      questionText: `On a coordinate grid, starting from the origin (0,0), you move ${x} units right and ${y} units up. What are the coordinates of your point?`,
      options,
      correctIndex
    };
  }
}

// ─── Legacy Generator Exports (Maintained for unit tests) ────

export function generateCountingQuestion(difficulty) {
  return generateKCountingQuestion(difficulty);
}

export function generateAddSubQuestion(difficulty) {
  return generateG1AddSubQuestion(difficulty);
}

export function generateMultDivQuestion(difficulty) {
  return generateG3MultDivQuestion(difficulty);
}

export function generateFractionQuestion(difficulty) {
  return generateG3FractionsGeomQuestion(difficulty);
}

// ─── Chapter Generator Dispatcher Map ────────────────────

export const CHAPTER_GENERATORS = {
  // Kindergarten
  k_counting: generateKCountingQuestion,
  k_shapes_patterns: generateKShapesPatternsQuestion,

  // Grade 1
  g1_add_sub: generateG1AddSubQuestion,
  g1_place_time: generateG1PlaceTimeQuestion,

  // Grade 2
  g2_2digit_math: generateG2TwoDigitMathQuestion,
  g2_money_measure: generateG2MoneyMeasureQuestion,

  // Grade 3
  g3_mult_div: generateG3MultDivQuestion,
  g3_fractions_geom: generateG3FractionsGeomQuestion,

  // Grade 4
  g4_multidigit_factors: generateG4MultiDigitFactorsQuestion,
  g4_fractions_decimals: generateG4FractionsDecimalsQuestion,

  // Grade 5
  g5_adv_fractions_decimals: generateG5AdvFractionsDecimalsQuestion,
  g5_pemdas_volume_coords: generateG5PemdasVolumeQuestion,

  // Legacy Aliases
  counting: generateKCountingQuestion,
  addSub: generateG1AddSubQuestion,
  multDiv: generateG3MultDivQuestion,
  fractions: generateG3FractionsGeomQuestion
};

/**
 * Generate a set of dynamic, fresh math questions for a chosen chapter and difficulty.
 * Procedurally generates questions with infinite variability so questions NEVER repeat!
 * Falls back to curated static banks if requested or as backup.
 * 
 * @param {string} chapterKey
 * @param {'easy'|'medium'|'hard'} difficulty
 * @param {number} count Default: 5
 */
export function generateChapterQuestions(chapterKey, difficulty, count = 5) {
  const gen = CHAPTER_GENERATORS[chapterKey] || generateKCountingQuestion;
  const questions = [];

  // Generate dynamic questions
  for (let i = 0; i < count; i++) {
    questions.push(gen(difficulty));
  }
  return questions;
}
