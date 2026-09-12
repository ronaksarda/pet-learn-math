import { describe, it, expect } from 'vitest';
import {
  generateCountingQuestion,
  generateAddSubQuestion,
  generateMultDivQuestion,
  generateFractionQuestion,
  generateChapterQuestions
} from '../src/data/questions.js';

describe('Math Question Generators (TDD)', () => {
  const difficulties = ['easy', 'medium', 'hard'];

  describe('Chapter 1: Counting & Number Sense', () => {
    difficulties.forEach((difficulty) => {
      it(`generates valid ${difficulty} counting questions with 4 unique options`, () => {
        for (let i = 0; i < 15; i++) {
          const q = generateCountingQuestion(difficulty);
          expect(q).toHaveProperty('questionText');
          expect(typeof q.questionText).toBe('string');
          expect(q.questionText.length).toBeGreaterThan(0);
          expect(Array.isArray(q.options)).toBe(true);
          expect(q.options).toHaveLength(4);
          
          // Verify 4 unique options
          const uniqueOpts = new Set(q.options);
          expect(uniqueOpts.size).toBe(4);

          // Verify correctIndex is 0..3
          expect(q.correctIndex).toBeGreaterThanOrEqual(0);
          expect(q.correctIndex).toBeLessThanOrEqual(3);
          expect(q.options[q.correctIndex]).toBeDefined();
        }
      });
    });
  });

  describe('Chapter 2: Addition & Subtraction', () => {
    difficulties.forEach((difficulty) => {
      it(`generates valid ${difficulty} addition/subtraction questions`, () => {
        for (let i = 0; i < 15; i++) {
          const q = generateAddSubQuestion(difficulty);
          expect(q.options).toHaveLength(4);
          const uniqueOpts = new Set(q.options);
          expect(uniqueOpts.size).toBe(4);
          expect(q.correctIndex).toBeGreaterThanOrEqual(0);
          expect(q.correctIndex).toBeLessThanOrEqual(3);

          // Test arithmetic correctness
          // Expected formats: "a + b = ?" or "a - b = ?"
          const match = q.questionText.match(/(\d+)\s*([+\-])\s*(\d+)/);
          expect(match).not.toBeNull();
          const num1 = parseInt(match[1], 10);
          const op = match[2];
          const num2 = parseInt(match[3], 10);
          const expected = op === '+' ? num1 + num2 : num1 - num2;
          expect(parseInt(q.options[q.correctIndex], 10)).toBe(expected);
        }
      });
    });
  });

  describe('Chapter 3: Multiplication & Division', () => {
    difficulties.forEach((difficulty) => {
      it(`generates valid ${difficulty} multiplication/division questions`, () => {
        for (let i = 0; i < 15; i++) {
          const q = generateMultDivQuestion(difficulty);
          expect(q.options).toHaveLength(4);
          const uniqueOpts = new Set(q.options);
          expect(uniqueOpts.size).toBe(4);
          expect(q.correctIndex).toBeGreaterThanOrEqual(0);
          expect(q.correctIndex).toBeLessThanOrEqual(3);

          // Check arithmetic
          const multMatch = q.questionText.match(/(\d+)\s*[×*x]\s*(\d+)/);
          const divMatch = q.questionText.match(/(\d+)\s*[÷\/]\s*(\d+)/);
          if (multMatch) {
            const expected = parseInt(multMatch[1], 10) * parseInt(multMatch[2], 10);
            expect(parseInt(q.options[q.correctIndex], 10)).toBe(expected);
          } else if (divMatch) {
            const expected = parseInt(divMatch[1], 10) / parseInt(divMatch[2], 10);
            expect(parseInt(q.options[q.correctIndex], 10)).toBe(expected);
          }
        }
      });
    });
  });

  describe('Chapter 4: Intro to Fractions', () => {
    difficulties.forEach((difficulty) => {
      it(`generates valid ${difficulty} fraction questions`, () => {
        for (let i = 0; i < 15; i++) {
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

  describe('generateChapterQuestions helper', () => {
    it('produces exactly 5 valid questions for a given chapter and difficulty', () => {
      const questions = generateChapterQuestions('counting', 'easy', 5);
      expect(questions).toHaveLength(5);
      questions.forEach((q) => {
        expect(q.options).toHaveLength(4);
        expect(q.correctIndex).toBeGreaterThanOrEqual(0);
        expect(q.correctIndex).toBeLessThanOrEqual(3);
      });
    });
  });

  describe('Comprehensive Question Bank (questionsBank.json)', () => {
    it('contains at least 20 questions for each chapter and difficulty tier (240+ total)', async () => {
      const bankModule = await import('../src/data/questionsBank.json');
      const bank = bankModule.default || bankModule;
      const chapters = ['counting', 'addSub', 'multDiv', 'fractions'];
      const tiers = ['easy', 'medium', 'hard'];

      chapters.forEach((ch) => {
        expect(bank).toHaveProperty(ch);
        tiers.forEach((tier) => {
          expect(bank[ch]).toHaveProperty(tier);
          const list = bank[ch][tier];
          expect(Array.isArray(list)).toBe(true);
          expect(list.length).toBeGreaterThanOrEqual(20);

          list.forEach((q, idx) => {
            expect(q.questionText).toBeDefined();
            expect(typeof q.questionText).toBe('string');
            expect(q.questionText.trim().length).toBeGreaterThan(0);
            expect(Array.isArray(q.options)).toBe(true);
            expect(q.options).toHaveLength(4);
            const unique = new Set(q.options);
            expect(unique.size).toBe(4);
            expect(q.correctIndex).toBeGreaterThanOrEqual(0);
            expect(q.correctIndex).toBeLessThanOrEqual(3);
            expect(q.options[q.correctIndex]).toBeDefined();
          });
        });
      });
    });
  });
});

