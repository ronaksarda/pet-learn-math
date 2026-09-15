/**
 * src/utils/mathHints.js
 * 
 * Intelligent, context-aware pedagogical math hint generator.
 * Analyzes the exact question structure, numbers, operations, and topic
 * to provide clear, actionable, step-by-step solving hints for children.
 */

export function generateSmartMathHint(question) {
  if (!question) return 'Take a breath and read the problem step-by-step!';

  const text = question.questionText || question.prompt || '';
  const options = question.options || [];
  const correctVal = options[question.correctIndex] || '';

  // 1. Order of Operations / PEMDAS
  if (/PEMDAS/i.test(text) || /\b(?:evaluate|solve).*?[+*×\-/÷]/i.test(text)) {
    const pemdasMatch = text.match(/(\d+)\s*([+*×\-/÷])\s*(\d+)\s*([+*×\-/÷])\s*(\d+)/);
    if (pemdasMatch) {
      const [_, n1, op1, n2, op2, n3] = pemdasMatch;
      if (['×', '*', '÷', '/'].includes(op2) && ['+', '-'].includes(op1)) {
        return `💡 PEMDAS rule: Do multiplication/division first! Calculate ${n2} ${op2} ${n3} first, then apply ${op1} ${n1}.`;
      }
    }
    if (/\(.*?\)/.test(text)) {
      return `💡 PEMDAS rule: Always solve the numbers inside the parentheses ( ) first!`;
    }
  }

  // 2. Visual Counting & Emojis
  if (/how many/i.test(text) || /count/i.test(text)) {
    const emojiMatch = text.match(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g);
    if (emojiMatch && emojiMatch.length > 1) {
      return `💡 Point and count each object one by one in order: 1, 2, 3... There are ${emojiMatch.length} in total!`;
    }
    if (/10-frame/i.test(text) || /make 10/i.test(text)) {
      const match = text.match(/(\d+)\s+dots/i);
      if (match) {
        const dots = parseInt(match[1], 10);
        return `💡 A full ten-frame has 10 spaces. You have ${dots}, so subtract: 10 - ${dots} = ${10 - dots} more dots needed!`;
      }
    }
  }

  // 3. Fraction Addition / Subtraction with unlike denominators
  const unlikeFracMatch = text.match(/(\d+)\/(\d+)\s*([+\-])\s*(\d+)\/(\d+)/);
  if (unlikeFracMatch) {
    const [_, n1, d1, op, n2, d2] = unlikeFracMatch;
    if (d1 === d2) {
      return `💡 Common denominator (${d1})! Keep the bottom number ${d1}, and ${op === '+' ? 'add' : 'subtract'} the top numbers: ${n1} ${op} ${n2} = ${op === '+' ? parseInt(n1)+parseInt(n2) : parseInt(n1)-parseInt(n2)}/${d1}.`;
    } else {
      return `💡 Different denominators! Convert fractions to a common denominator (like ${d1 * d2 > 12 ? (d1 === '2' && d2 === '4' ? '4' : (d1 === '2' && d2 === '3' ? '6' : d1*d2)) : d1 * d2}) before adding or subtracting.`;
    }
  }

  // 4. Fraction Multiplication
  const multFracMatch = text.match(/(\d+)\/(\d+)\s*[×*]\s*(\d+)\/(\d+)/);
  if (multFracMatch) {
    const [_, n1, d1, n2, d2] = multFracMatch;
    return `💡 Multiply straight across! Top × Top = (${n1} × ${n2} = ${n1 * n2}) and Bottom × Bottom = (${d1} × ${d2} = ${d1 * d2}) → ${n1 * n2}/${d1 * d2}!`;
  }

  // 5. Equivalent Fractions & Pizza Slices
  if (/equivalent|equal/i.test(text) && /fraction/i.test(text)) {
    return `💡 Equivalent fractions have the same value! Multiply both the top (numerator) and bottom (denominator) by 2 or 3 to find a match.`;
  }
  if (/pizza|pie|cake|chocolate|slices/i.test(text)) {
    const sliceMatch = text.match(/(\d+)\s+equal\s+slices.*?(\d+)/i);
    if (sliceMatch) {
      return `💡 The total number of slices goes on the bottom (denominator), and the eaten slices go on top (numerator)!`;
    }
  }

  // 6. 2-Digit & Multi-Digit Addition (e.g. 58 + 27 = ?)
  const addMatch = text.match(/(\d+)\s*\+\s*(\d+)/);
  if (addMatch) {
    const a = parseInt(addMatch[1], 10);
    const b = parseInt(addMatch[2], 10);
    if (a > 10 || b > 10) {
      const aOnes = a % 10;
      const bOnes = b % 10;
      const onesSum = aOnes + bOnes;
      if (onesSum >= 10) {
        return `💡 Add the ones first: ${aOnes} + ${bOnes} = ${onesSum} (write ${onesSum % 10}, carry 1). Then add the tens: ${Math.floor(a / 10)} + ${Math.floor(b / 10)} + 1 = ${Math.floor((a + b) / 10)} → ${a + b}!`;
      } else {
        return `💡 Add the ones: ${aOnes} + ${bOnes} = ${onesSum}. Add the tens: ${Math.floor(a / 10) * 10} + ${Math.floor(b / 10) * 10} = ${Math.floor((a + b) / 10) * 10}. Total: ${a + b}!`;
      }
    } else {
      return `💡 Start at ${Math.max(a, b)} and count up ${Math.min(a, b)} more: ${a} + ${b} = ${a + b}!`;
    }
  }

  // 7. Subtraction (e.g. 72 - 38 = ?)
  const subMatch = text.match(/(\d+)\s*-\s*(\d+)/);
  if (subMatch) {
    const a = parseInt(subMatch[1], 10);
    const b = parseInt(subMatch[2], 10);
    const aOnes = a % 10;
    const bOnes = b % 10;
    if (aOnes < bOnes && a > 10) {
      return `💡 Regrouping needed! Borrow 1 ten so ${aOnes} becomes ${aOnes + 10}. Then ${aOnes + 10} - ${bOnes} = ${aOnes + 10 - bOnes} ones, and subtract the remaining tens!`;
    } else {
      return `💡 Subtract ones (${aOnes} - ${bOnes} = ${aOnes - bOnes}), then subtract tens → ${a - b}!`;
    }
  }

  // 8. Multiplication (e.g. 7 × 8 = ?)
  const multMatch = text.match(/(\d+)\s*[×*x]\s*(\d+)/);
  if (multMatch) {
    const a = parseInt(multMatch[1], 10);
    const b = parseInt(multMatch[2], 10);
    if (a <= 12 && b <= 12) {
      return `💡 Think of ${a} × ${b} as ${a} equal groups of ${b}. (Tip: ${a} × ${b - 1} = ${a * (b - 1)}, plus ${a} more = ${a * b})!`;
    } else {
      return `💡 Break it down! Multiply by the ones digit, then the tens digit, and add the two partial products together.`;
    }
  }

  // 9. Division (e.g. 56 ÷ 8 = ?)
  const divMatch = text.match(/(\d+)\s*[÷\/]\s*(\d+)/);
  if (divMatch) {
    const dividend = parseInt(divMatch[1], 10);
    const divisor = parseInt(divMatch[2], 10);
    return `💡 Think multiplication in reverse: What number times ${divisor} equals ${dividend}? (${divisor} × ${dividend / divisor} = ${dividend})!`;
  }

  // 10. Geometry: Perimeter & Area & Volume
  if (/perimeter/i.test(text)) {
    return `💡 Perimeter is the distance around the outside edge: Add all 4 sides together (P = 2 × length + 2 × width)!`;
  }
  if (/area/i.test(text)) {
    return `💡 Area is the space inside: Multiply length × width (A = l × w)!`;
  }
  if (/volume/i.test(text)) {
    return `💡 Volume of a 3D box is Length × Width × Height (V = l × w × h)!`;
  }
  if (/coordinate|origin/i.test(text)) {
    return `💡 Coordinates (x, y): The first number (x) is how many steps RIGHT, and the second number (y) is how many steps UP!`;
  }

  // 11. Money / Coins / Change
  if (/coin|dime|nickel|penny|quarter|change/i.test(text)) {
    return `💡 Coin values: Quarter = 25¢, Dime = 10¢, Nickel = 5¢, Penny = 1¢. $1.00 is 100¢!`;
  }

  // 12. Clock & Time
  if (/clock|hour hand|minute hand/i.test(text)) {
    return `💡 The short hand indicates the hour. When the long minute hand points at 12 it is :00; pointing at 6 is :30 (half-hour)!`;
  }

  // 13. Prime vs Composite
  if (/prime/i.test(text)) {
    return `💡 A prime number can ONLY be divided evenly by 1 and itself (e.g. 2, 3, 5, 7, 11, 13, 17, 19, 23)!`;
  }

  // 14. Decimals
  if (/decimal/i.test(text) || /0\.\d+/.test(text)) {
    return `💡 Remember: Tenths is 1 digit after the dot (0.1 = 1/10) and Hundredths is 2 digits after the dot (0.01 = 1/100)!`;
  }

  // 15. Shapes sides / corners
  if (/sides|corners/i.test(text)) {
    return `💡 Triangles have 3 sides, Squares & Rectangles have 4 sides, Pentagons have 5, and Hexagons have 6!`;
  }

  // Fallback with context
  return `💡 Look closely at the numbers in the question and eliminate answers that are clearly too big or too small!`;
}
