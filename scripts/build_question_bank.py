import json
import random

def build_options(correct_val, distractor_candidates):
    c_str = str(correct_val)
    opts = [c_str]
    candidates = list(distractor_candidates)
    random.shuffle(candidates)
    for d in candidates:
        d_str = str(d)
        if d_str != c_str and d_str not in opts:
            opts.append(d_str)
        if len(opts) == 4:
            break
    
    # Fallback if distractors were not enough
    fallback = 1
    while len(opts) < 4:
        if isinstance(correct_val, int):
            cand_str = str(correct_val + fallback if fallback % 2 == 1 else max(1, correct_val - fallback))
        elif "/" in c_str:
            num, den = map(int, c_str.split("/"))
            cand_str = f"{fallback}/{den}"
        else:
            cand_str = f"opt_{fallback}"
        if cand_str != c_str and cand_str not in opts:
            opts.append(cand_str)
        fallback += 1
        
    random.shuffle(opts)
    return opts, opts.index(c_str)


bank = {
    "counting": {"easy": [], "medium": [], "hard": []},
    "addSub": {"easy": [], "medium": [], "hard": []},
    "multDiv": {"easy": [], "medium": [], "hard": []},
    "fractions": {"easy": [], "medium": [], "hard": []}
}

# 1. COUNTING EASY (20 questions: Count objects 1-10)
icons = ["🍎", "⭐", "🎈", "🐶", "🐠", "🍪", "🌸", "🍕", "🚗", "🐸"]
counts = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 3, 4, 5, 6, 7, 8, 9, 2, 5, 8]
for i in range(20):
    cnt = counts[i]
    ico = icons[i % len(icons)]
    vis = " ".join([ico] * cnt)
    q_text = f"How many {ico} do you see?\n{vis}"
    cand = [max(1, cnt + delta) for delta in [-3, -2, -1, 1, 2, 3, 4]]
    opts, c_idx = build_options(cnt, cand)
    bank["counting"]["easy"].append({
        "id": f"c1_e_{i+1}",
        "questionText": q_text,
        "options": opts,
        "correctIndex": c_idx
    })

# 2. COUNTING MEDIUM (20 questions: Before/After 1-20, Compare two numbers)
for i in range(20):
    mode = i % 3
    if mode == 0:
        n = random.randint(2, 19)
        ans = n + 1
        q_text = f"What number comes directly after {n}?"
        cand = [n - 1, n, n + 2, n + 3, n - 2]
    elif mode == 1:
        n = random.randint(2, 20)
        ans = n - 1
        q_text = f"What number comes directly before {n}?"
        cand = [n + 1, n, n - 2, n + 2, n - 3]
    else:
        a = random.randint(2, 19)
        b = a + random.choice([-5, -4, -3, -2, -1, 1, 2, 3, 4, 5])
        while b < 1 or b == a:
            b = random.randint(1, 20)
        ans = max(a, b)
        q_text = f"Which number is larger: {a} or {b}?"
        cand = [min(a, b), ans + 1, max(1, ans - 2), ans + 2]
    opts, c_idx = build_options(ans, cand)
    bank["counting"]["medium"].append({
        "id": f"c1_m_{i+1}",
        "questionText": q_text,
        "options": opts,
        "correctIndex": c_idx
    })

# 3. COUNTING HARD (20 questions: Skip counting by 2s/5s/10s, Order 4 numbers)
for i in range(20):
    if i % 2 == 0:
        step = random.choice([2, 5, 10])
        start = random.randint(1, 5) * step
        seq = [start, start + step, start + step * 2]
        ans = start + step * 3
        q_text = f"Skip count by {step}s: {seq[0]}, {seq[1]}, {seq[2]}, ___"
        cand = [ans - step, ans + step, ans + step * 2, ans - 1, ans + 1]
        opts, c_idx = build_options(ans, cand)
    else:
        nums = sorted(random.sample(range(1, 50), 4))
        ans = ", ".join(map(str, nums))
        shuffled = list(nums)
        random.shuffle(shuffled)
        while shuffled == nums:
            random.shuffle(shuffled)
        q_text = f"Order these numbers from smallest to largest:\n{', '.join(map(str, shuffled))}"
        d1 = ", ".join(map(str, reversed(nums)))
        d2 = f"{nums[1]}, {nums[0]}, {nums[2]}, {nums[3]}"
        d3 = f"{nums[0]}, {nums[2]}, {nums[1]}, {nums[3]}"
        d4 = f"{nums[0]}, {nums[1]}, {nums[3]}, {nums[2]}"
        opts = [ans, d1, d2, d3]
        random.shuffle(opts)
        c_idx = opts.index(ans)
    bank["counting"]["hard"].append({
        "id": f"c1_h_{i+1}",
        "questionText": q_text,
        "options": opts,
        "correctIndex": c_idx
    })

# 4. ADD/SUB EASY (20 questions: Within 10)
for i in range(20):
    is_add = i % 2 == 0
    if is_add:
        a = random.randint(1, 5)
        b = random.randint(1, 5)
        ans = a + b
        q_text = f"What is {a} + {b} = ?"
    else:
        a = random.randint(2, 10)
        b = random.randint(1, a)
        ans = a - b
        q_text = f"What is {a} - {b} = ?"
    cand = [max(0, ans + delta) for delta in [-2, -1, 1, 2, 3]]
    opts, c_idx = build_options(ans, cand)
    bank["addSub"]["easy"].append({
        "id": f"c2_e_{i+1}",
        "questionText": q_text,
        "options": opts,
        "correctIndex": c_idx
    })

# 5. ADD/SUB MEDIUM (20 questions: Within 20)
for i in range(20):
    is_add = i % 2 == 0
    if is_add:
        a = random.randint(5, 12)
        b = random.randint(3, 8)
        ans = a + b
        q_text = f"What is {a} + {b} = ?"
    else:
        a = random.randint(11, 20)
        b = random.randint(3, 9)
        ans = a - b
        q_text = f"What is {a} - {b} = ?"
    cand = [ans - 2, ans - 1, ans + 1, ans + 2, ans + 10]
    opts, c_idx = build_options(ans, cand)
    bank["addSub"]["medium"].append({
        "id": f"c2_m_{i+1}",
        "questionText": q_text,
        "options": opts,
        "correctIndex": c_idx
    })

# 6. ADD/SUB HARD (20 questions: Within 100 with regrouping)
for i in range(20):
    is_add = i % 2 == 0
    if is_add:
        # ones sum >= 10
        o1 = random.randint(5, 9)
        o2 = random.randint(10 - o1, 9)
        a = random.randint(1, 4) * 10 + o1
        b = random.randint(1, 4) * 10 + o2
        ans = a + b
        q_text = f"What is {a} + {b} = ?"
    else:
        # borrowing: o1 < o2
        o1 = random.randint(1, 4)
        o2 = random.randint(o1 + 1, 9)
        a = random.randint(3, 8) * 10 + o1
        b = random.randint(1, 2) * 10 + o2
        ans = a - b
        q_text = f"What is {a} - {b} = ?"
    cand = [ans - 10, ans + 10, ans - 1, ans + 1, ans - 2, ans + 2]
    opts, c_idx = build_options(ans, cand)
    bank["addSub"]["hard"].append({
        "id": f"c2_h_{i+1}",
        "questionText": q_text,
        "options": opts,
        "correctIndex": c_idx
    })

# 7. MULT/DIV EASY (20 questions: Tables 1-5)
for i in range(20):
    a = random.randint(1, 5)
    b = random.randint(1, 10)
    ans = a * b
    q_text = f"What is {a} × {b} = ?"
    cand = [ans - a, ans + a, max(1, ans - 1), ans + 1, ans + 2]
    opts, c_idx = build_options(ans, cand)
    bank["multDiv"]["easy"].append({
        "id": f"c3_e_{i+1}",
        "questionText": q_text,
        "options": opts,
        "correctIndex": c_idx
    })

# 8. MULT/DIV MEDIUM (20 questions: Tables 6-10 + Simple Division)
for i in range(20):
    is_mult = i % 2 == 0
    if is_mult:
        a = random.randint(6, 10)
        b = random.randint(2, 9)
        ans = a * b
        q_text = f"What is {a} × {b} = ?"
        cand = [ans - a, ans + a, ans - 10, ans + 10, ans + 2]
    else:
        b = random.randint(2, 6)
        ans = random.randint(2, 9)
        a = b * ans
        q_text = f"What is {a} ÷ {b} = ?"
        cand = [max(1, ans - 2), ans - 1, ans + 1, ans + 2, ans + 3]
    opts, c_idx = build_options(ans, cand)
    bank["multDiv"]["medium"].append({
        "id": f"c3_m_{i+1}",
        "questionText": q_text,
        "options": opts,
        "correctIndex": c_idx
    })

# 9. MULT/DIV HARD (20 questions: Mixed Mult/Div within 100)
for i in range(20):
    is_mult = i % 2 == 0
    if is_mult:
        a = random.randint(6, 12)
        b = random.randint(6, 9)
        ans = a * b
        q_text = f"What is {a} × {b} = ?"
        cand = [ans - a, ans + a, ans - 1, ans + 1, ans - 10, ans + 10]
    else:
        b = random.randint(6, 10)
        ans = random.randint(6, 10)
        a = b * ans
        q_text = f"What is {a} ÷ {b} = ?"
        cand = [ans - 2, ans - 1, ans + 1, ans + 2, ans + 4]
    opts, c_idx = build_options(ans, cand)
    bank["multDiv"]["hard"].append({
        "id": f"c3_h_{i+1}",
        "questionText": q_text,
        "options": opts,
        "correctIndex": c_idx
    })

# 10. FRACTIONS EASY (20 questions: Shaded shapes, parts of whole)
frac_templates = [
    ("pizza 🍕", 4, 1), ("pizza 🍕", 4, 3), ("pizza 🍕", 4, 2),
    ("pie 🥧", 6, 1), ("pie 🥧", 6, 5), ("pie 🥧", 6, 2),
    ("chocolate bar 🍫", 8, 3), ("chocolate bar 🍫", 8, 5), ("chocolate bar 🍫", 8, 7),
    ("circle 🟡", 2, 1), ("circle 🟡", 3, 1), ("circle 🟡", 3, 2),
    ("waffle 🧇", 4, 1), ("waffle 🧇", 4, 3), ("cookie 🍪", 2, 1),
    ("cake 🎂", 8, 1), ("cake 🎂", 8, 3), ("pie 🥧", 5, 2),
    ("sandwich 🥪", 2, 1), ("orange 🍊", 4, 2)
]
for i in range(20):
    item, tot, eaten = frac_templates[i]
    ans = f"{eaten}/{tot}"
    q_text = f"A {item} is divided into {tot} equal slices. You eat {eaten} slice{'s' if eaten > 1 else ''}. What fraction did you eat?"
    cand = [f"{max(1, eaten - 1)}/{tot}", f"{min(tot, eaten + 1)}/{tot}", f"1/{tot}", f"{eaten}/{tot + 2}", f"{max(1, eaten - 2)}/{tot}"]
    opts, c_idx = build_options(ans, cand)
    bank["fractions"]["easy"].append({
        "id": f"c4_e_{i+1}",
        "questionText": q_text,
        "options": opts,
        "correctIndex": c_idx
    })

# 11. FRACTIONS MEDIUM (20 questions: Compare same-denominator fractions)
denoms = [4, 5, 6, 8, 10]
for i in range(20):
    d = denoms[i % len(denoms)]
    n1 = random.randint(1, d - 2)
    n2 = random.randint(n1 + 1, d - 1)
    ans = f"{n2}/{d}"
    q_text = f"Which fraction is larger: {n1}/{d} or {n2}/{d}?"
    cand = [f"{n1}/{d}", f"{min(d, n2 + 1)}/{d}", f"{max(1, n1 - 1)}/{d}", f"1/{d}"]
    opts, c_idx = build_options(ans, cand)
    bank["fractions"]["medium"].append({
        "id": f"c4_m_{i+1}",
        "questionText": q_text,
        "options": opts,
        "correctIndex": c_idx
    })

# 12. FRACTIONS HARD (20 questions: Equivalent fractions)
equiv_bases = [
    ("1/2", ["2/4", "3/6", "4/8", "5/10"]),
    ("1/3", ["2/6", "3/9", "4/12"]),
    ("2/3", ["4/6", "6/9", "8/12"]),
    ("1/4", ["2/8", "3/12"]),
    ("3/4", ["6/8", "9/12"]),
    ("2/5", ["4/10", "6/15"]),
    ("1/5", ["2/10", "3/15"])
]
for i in range(20):
    base_item = equiv_bases[i % len(equiv_bases)]
    base = base_item[0]
    ans = random.choice(base_item[1])
    q_text = f"Which fraction is equivalent (equal) to {base}?"
    cand = ["1/3", "2/5", "3/5", "1/4", "3/8", "2/7", "5/6", "4/9", "2/9", "5/8"]
    opts, c_idx = build_options(ans, cand)
    bank["fractions"]["hard"].append({
        "id": f"c4_h_{i+1}",
        "questionText": q_text,
        "options": opts,
        "correctIndex": c_idx
    })


out_path = "src/data/questionsBank.json"
with open(out_path, "w", encoding="utf-8") as f:
    json.dump(bank, f, indent=2, ensure_ascii=False)

print(f"Successfully generated 240 questions in {out_path}!")
