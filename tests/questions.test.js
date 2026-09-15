import { describe, it, expect } from 'vitest';
import {
  generateCountingQuestion,
  generateAddSubQuestion,
  generateMultDivQuestion,
  generateFractionQuestion,
  generateChapterQuestions,
  CHAPTER_GENERATORS
} from '../src/data/questions.js';
import { generateSmartMathHint } from '../src/utils/mathHints.js';
import { formatMathForSpeech } from '../src/hooks/useSpeechSynthesis.js';
import questionsBank from '../src/data/questionsBank.json';

describe('Math Question Generators (TDD)', () => {
  const difficulties = ['easy', 'medium', 'hard'];

  describe('Legacy Chapter Generators (Backwards Compatibility)', () => {
    difficulties.forEach((difficulty) => {
      it(`generates valid ${difficulty} counting questions with 4 unique options`, () => {
        for (let i = 0; i < 10; i++) {
          const q = generateCountingQuestion(difficulty);
          expect(q).toHaveProperty('questionText');
          expect(typeof q.questionText).toBe('string');
          expect(q.questionText.length).toBeGreaterThan(0);
          expect(Array.isArray(q.options)).toBe(true);
          expect(q.options).toHaveLength(4);
          const uniqueOpts = new Set(q.options);
          expect(uniqueOpts.size).toBe(4);
          expect(q.correctIndex).toBeGreaterThanOrEqual(0);
          expect(q.correctIndex).toBeLessThanOrEqual(3);
          expect(q.options[q.correctIndex]).toBeDefined();
        }
      });

      it(`generates valid ${difficulty} addition/subtraction questions`, () => {
        for (let i = 0; i < 10; i++) {
          const q = generateAddSubQuestion(difficulty);
          expect(q.options).toHaveLength(4);
          const uniqueOpts = new Set(q.options);
          expect(uniqueOpts.size).toBe(4);
          expect(q.correctIndex).toBeGreaterThanOrEqual(0);
          expect(q.correctIndex).toBeLessThanOrEqual(3);
        }
      });

      it(`generates valid ${difficulty} multiplication/division questions`, () => {
        for (let i = 0; i < 10; i++) {
          const q = generateMultDivQuestion(difficulty);
          expect(q.options).toHaveLength(4);
          const uniqueOpts = new Set(q.options);
          expect(uniqueOpts.size).toBe(4);
          expect(q.correctIndex).toBeGreaterThanOrEqual(0);
          expect(q.correctIndex).toBeLessThanOrEqual(3);
        }
      });

      it(`generates valid ${difficulty} fraction questions`, () => {
        for (let i = 0; i < 10; i++) {
          const q = generateFractionQuestion(difficulty);
          expect(q.options).toHaveLength(4);
          const uniqueOpts = new Set(q.options);
          expect(uniqueOpts.size).toBe(4);
          expect(q.correctIndex).toBeGreaterThanOrEqual(0);
          expect(q.correctIndex).toBeLessThanOrEqual(3);
          expect(q.options[q.correctIndex]).toBeDefined();
        }
      });
    });
  });

  describe('Full K-5 Curriculum Chapters (12 Distinct Grade Adventures)', () => {
    const allChapterKeys = [
      'k_counting',
      'k_shapes_patterns',
      'g1_add_sub',
      'g1_place_time',
      'g2_2digit_math',
      'g2_money_measure',
      'g3_mult_div',
      'g3_fractions_geom',
      'g4_multidigit_factors',
      'g4_fractions_decimals',
      'g5_adv_fractions_decimals',
      'g5_pemdas_volume_coords'
    ];

    allChapterKeys.forEach((key) => {
      describe(`Chapter: ${key}`, () => {
        it('has a registered generator in CHAPTER_GENERATORS', () => {
          expect(CHAPTER_GENERATORS[key]).toBeDefined();
          expect(typeof CHAPTER_GENERATORS[key]).toBe('function');
        });

        difficulties.forEach((tier) => {
          it(`generates valid ${tier} questions with 4 unique options and accurate correctIndex`, () => {
            for (let i = 0; i < 10; i++) {
              const q = CHAPTER_GENERATORS[key](tier);
              expect(q).toHaveProperty('questionText');
              expect(typeof q.questionText).toBe('string');
              expect(q.questionText.trim().length).toBeGreaterThan(0);
              expect(Array.isArray(q.options)).toBe(true);
              expect(q.options).toHaveLength(4);

              // 4 unique options
              const unique = new Set(q.options);
              expect(unique.size).toBe(4);

              // Valid correctIndex
              expect(q.correctIndex).toBeGreaterThanOrEqual(0);
              expect(q.correctIndex).toBeLessThanOrEqual(3);
              expect(q.options[q.correctIndex]).toBeDefined();
            }
          });
        });
      });
    });
  });

  describe('generateChapterQuestions helper', () => {
    it('produces exactly requested count of valid dynamic questions for any chapter', () => {
      const keys = ['k_counting', 'g1_add_sub', 'g2_2digit_math', 'g3_mult_div', 'g4_fractions_decimals', 'g5_pemdas_volume_coords'];
      keys.forEach((key) => {
        const questions = generateChapterQuestions(key, 'medium', 5);
        expect(questions).toHaveLength(5);
        questions.forEach((q) => {
          expect(q.options).toHaveLength(4);
          const unique = new Set(q.options);
          expect(unique.size).toBe(4);
          expect(q.correctIndex).toBeGreaterThanOrEqual(0);
          expect(q.correctIndex).toBeLessThanOrEqual(3);
        });
      });
    });
  });

  describe('Comprehensive Question Bank (questionsBank.json)', () => {
    it('contains valid questions for base chapters', () => {
      const chapters = ['counting', 'addSub', 'multDiv', 'fractions'];
      const tiers = ['easy', 'medium', 'hard'];

      chapters.forEach((ch) => {
        expect(questionsBank).toHaveProperty(ch);
        tiers.forEach((tier) => {
          expect(questionsBank[ch]).toHaveProperty(tier);
          const list = questionsBank[ch][tier];
          expect(Array.isArray(list)).toBe(true);
          expect(list.length).toBeGreaterThanOrEqual(20);
        });
      });
    });
  });

  describe('Contextual Smart Math Hint Generator', () => {
    it('generates step-by-step guidance for addition with regrouping', () => {
      const hint = generateSmartMathHint({ questionText: 'What is 58 + 27 = ?' });
      expect(hint).toContain('ones');
      expect(hint).toContain('tens');
    });

    it('generates step-by-step guidance for multiplication facts', () => {
      const hint = generateSmartMathHint({ questionText: 'What is 7 × 8 = ?' });
      expect(hint).toContain('groups');
    });

    it('generates step-by-step guidance for fraction addition', () => {
      const hint = generateSmartMathHint({ questionText: 'What is 1/2 + 1/3 = ?' });
      expect(hint).toContain('denominator');
    });

    it('generates step-by-step guidance for PEMDAS order of operations', () => {
      const hint = generateSmartMathHint({ questionText: 'Evaluate using PEMDAS: 5 + 3 × 4 = ?' });
      expect(hint).toContain('PEMDAS');
    });

    it('generates step-by-step guidance for division', () => {
      const hint = generateSmartMathHint({ questionText: 'Solve: 56 ÷ 8 = ?' });
      expect(hint).toContain('multiplication in reverse');
    });
  });

  describe('Math Speech Phonetics Translator', () => {
    it('translates fractions into natural spoken words', () => {
      expect(formatMathForSpeech('What is 1/2 + 3/4 = ?')).toBe('What is one half plus three fourths equals ?');
      expect(formatMathForSpeech('Mixed number 2 1/3')).toBe('Mixed number 2 and one third');
    });

    it('translates math operators into natural spoken words', () => {
      expect(formatMathForSpeech('6 × 7 = 42')).toBe('6 times 7 equals 42');
      expect(formatMathForSpeech('56 ÷ 8 = 7')).toBe('56 divided by 8 equals 7');
    });

    it('translates currency and units', () => {
      expect(formatMathForSpeech('Price is 25¢')).toBe('Price is 25 cents');
      expect(formatMathForSpeech('Cost is $1.00')).toBe('Cost is 1.00 dollars');
      expect(formatMathForSpeech('Area is 24 sq units')).toBe('Area is 24 square units');
    });

    it('strips visual emojis cleanly', () => {
      expect(formatMathForSpeech('Count the 🍎 🍎 🍎')).toBe('Count the');
    });
  });
});
