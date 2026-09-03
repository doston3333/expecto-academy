export const TELEGRAM_URL = "https://t.me/expectoacademy";
export const EMAIL = "hello@expecto.academy";
export const NEXT_COHORT = new Date("2026-09-08T09:00:00+05:00");

export const NAV_LINKS = [
  { href: "#film", label: "The film" },
  { href: "#method", label: "Method" },
  { href: "#houses", label: "Houses" },
  { href: "#stories", label: "Letters home" },
  { href: "#pricing", label: "Tuition" },
  { href: "#faq", label: "FAQ" },
] as const;

export const HERO_PLATES = [
  { houseId: "aurelion" as const, score: "1480", school: "AKFA", award: "Full tuition" },
  { houseId: "veridian" as const, score: "1520", school: "NewUU", award: "100% merit" },
  { houseId: "noctis" as const, score: "1410", school: "Webster", award: "Presidential" },
  { houseId: "amberfell" as const, score: "1360", school: "INHA", award: "Merit band" },
] as const;

export const PROOF = "1,200+ students sorted · +210 average gain · 340+ scholarships";

/* ------------------------------------------------------------------ */
/* The film — beats keyed to the sticky Bluebook window                */
/* ------------------------------------------------------------------ */

export interface FilmBeat {
  index: string;
  kicker: string;
  title: string;
  body: string;
  breadcrumb: string;
}

export const FILM_BEATS: readonly FilmBeat[] = [
  {
    index: "01",
    kicker: "Week 0 · Diagnostic",
    title: "Sit the exam before you swear the oath",
    body: "A full adaptive Digital SAT on the interface you will actually sit. Timer running, module two waiting. We score it the same night and name every leak.",
    breadcrumb: "Bluebook · Practice Exam 1",
  },
  {
    index: "02",
    kicker: "The trap",
    title: "Every wrong answer has a design",
    body: "B was almost right — that is the point of B. Mark schemes show why the tempting choice fails, until the pattern stops costing you points.",
    breadcrumb: "Bluebook · Review · Question 7",
  },
  {
    index: "03",
    kicker: "Spellwork",
    title: "Tonight's homework is built from your misses",
    body: "The error log turns into the assignment. Command of evidence, transitions, boundaries — drilled in house colours until they stop appearing.",
    breadcrumb: "Error log · Week 3",
  },
  {
    index: "04",
    kicker: "The gauntlet",
    title: "Three full exams. Test-day rules.",
    body: "Timed, adaptive, no pause button. By the third morning the real exam is the quietest room you have sat in all year.",
    breadcrumb: "Gauntlet week · Mocks 09–11",
  },
  {
    index: "05",
    kicker: "The letter",
    title: "A number that funds a seat",
    body: "1480. +300 from the diagnostic, 98th percentile. Then the part that matters: which Uzbek universities turn that number into tuition.",
    breadcrumb: "Score report · 14 Aug 2026",
  },
  {
    index: "06",
    kicker: "Sorted",
    title: "Your house writes to you",
    body: "Aurelion. Fast-Track. First class 8 September, 19:00 Tashkent time. Bring your diagnostic — we start where you are weakest.",
    breadcrumb: "Telegram · House hall",
  },
];

export const TRAP_NOTES = [
  {
    choice: "B",
    verdict: "Almost right",
    note: "Confuses correlation with cause. The passage compares rates; it never claims the mechanism.",
  },
  {
    choice: "D",
    verdict: "Correct",
    note: "The only choice bounded by what the data actually shows — no stronger claim than the text.",
  },
] as const;

export const ERROR_LOG = [
  { type: "Command of evidence", misses: 5, assigned: 12, houseId: "noctis" as const },
  { type: "Transitions", misses: 4, assigned: 10, houseId: "noctis" as const },
  { type: "Boundaries — punctuation", misses: 3, assigned: 8, houseId: "noctis" as const },
  { type: "Linear equations in context", misses: 2, assigned: 6, houseId: "veridian" as const },
  { type: "Advanced math — nonlinear", misses: 2, assigned: 6, houseId: "veridian" as const },
] as const;

export const GAUNTLET = [
  { label: "Mock 09", when: "Saturday · 09:00", score: "1410", done: true },
  { label: "Mock 10", when: "Sunday · 09:00", score: "1440", done: true },
  { label: "Mock 11", when: "Tuesday · 09:00", score: "1480", done: true },
] as const;

export const SCHOLARSHIP_ROWS = [
  { school: "AKFA University", band: "Full tuition", min: "1450+" },
  { school: "New Uzbekistan University", band: "100% merit", min: "1480+" },
  { school: "Webster Tashkent", band: "Presidential", min: "1400+" },
  { school: "INHA in Tashkent", band: "Merit band", min: "1350+" },
] as const;

export const TELEGRAM_MESSAGES = [
  {
    from: "Expecto Sorting Office",
    text: "Sorted: Aurelion · Fast-Track (8 weeks). First class 8 Sep, 19:00 Tashkent.",
    time: "18:42",
    mine: false,
  },
  {
    from: "You",
    text: "Diagnostic was 1180. Is 1480 actually reachable by November?",
    time: "18:44",
    mine: true,
  },
  {
    from: "Expecto Sorting Office",
    text: "It is the house average. Bring the diagnostic. We start where you are weakest.",
    time: "18:45",
    mine: false,
  },
] as const;

/* ------------------------------------------------------------------ */
/* The Oath — the score pact, set as a charter                         */
/* ------------------------------------------------------------------ */

export const OATH_TERMS = [
  {
    n: "I",
    term: "We agree a target gain from your diagnostic, in writing, before the first class.",
  },
  {
    n: "II",
    term: "You complete the homework and sit every mock. The work is yours; the plan is ours.",
  },
  {
    n: "III",
    term: "Miss the agreed gain after doing the work, and four further weeks of house classes are on us.",
  },
] as const;

export const OATH_RIDER =
  "It is not a cash refund of a score. It is more work, on us — until the number lands.";

/* ------------------------------------------------------------------ */
/* Universities — the scholarship index                                */
/* ------------------------------------------------------------------ */

export const UNIVERSITY_INDEX = [
  { school: "AKFA University", band: "Full tuition", threshold: "1450+" },
  { school: "New Uzbekistan University", band: "100% merit", threshold: "1480+" },
  { school: "Webster University Tashkent", band: "Presidential", threshold: "1400+" },
  { school: "INHA University in Tashkent", band: "Merit band", threshold: "1350+" },
  { school: "Turin Polytechnic University", band: "Merit award", threshold: "1350+" },
  { school: "Amity University Tashkent", band: "Merit award", threshold: "1300+" },
  { school: "TEAM University", band: "Merit award", threshold: "1300+" },
  { school: "British Management University", band: "Merit award", threshold: "1250+" },
  { school: "Central Asian University", band: "Merit award", threshold: "1250+" },
  { school: "Westminster (WIUT)", band: "Merit award", threshold: "1300+" },
] as const;

/* ------------------------------------------------------------------ */
/* Chapters — the book spine                                           */
/* ------------------------------------------------------------------ */

export const CHAPTERS = [
  { numeral: "0", label: "The door", href: "#top" },
  { numeral: "I", label: "The film", href: "#film" },
  { numeral: "II", label: "Method", href: "#method" },
  { numeral: "III", label: "Houses", href: "#houses" },
  { numeral: "IV", label: "The oath", href: "#oath" },
  { numeral: "V", label: "Letters", href: "#stories" },
  { numeral: "VI", label: "Tuition", href: "#pricing" },
  { numeral: "VII", label: "Enroll", href: "#enroll" },
] as const;

/* ------------------------------------------------------------------ */
/* Method                                                              */
/* ------------------------------------------------------------------ */

export const METHOD_PILLARS = [
  {
    n: "01",
    title: "Live house classes",
    body: "Small evening cohorts in Tashkent time. You sit with your house, not a 200-person webinar.",
  },
  {
    n: "02",
    title: "10+ Digital SAT mocks",
    body: "Full adaptive exams that behave like Bluebook — module difficulty, timer, and score report included.",
  },
  {
    n: "03",
    title: "A named mentor",
    body: "One person reviews your mocks, rewrites your week, and stays until the score lands.",
  },
] as const;

export const METHOD_SUPPORT = [
  "Adaptive homework from your own error log",
  "Bluebook-style interface only — no paper nostalgia",
  "Score pact: miss the agreed gain, get four extra weeks free",
] as const;

/* ------------------------------------------------------------------ */
/* Letters home                                                        */
/* ------------------------------------------------------------------ */

export const TESTIMONIALS = [
  {
    name: "Dilnoza R.",
    city: "Tashkent",
    houseId: "aurelion" as const,
    before: 1180,
    after: 1480,
    school: "AKFA University",
    award: "Full tuition",
    quote:
      "I had one summer. Aurelion treated that like a vow. The mocks felt cruel until test day felt quiet.",
  },
  {
    name: "Timur K.",
    city: "Samarkand",
    houseId: "veridian" as const,
    before: 1240,
    after: 1520,
    school: "New Uzbekistan University",
    award: "100% scholarship",
    quote: "Math was the only thing between me and a funded seat. Veridian did not cheer. It drilled.",
  },
  {
    name: "Malika A.",
    city: "Bukhara",
    houseId: "noctis" as const,
    before: 1100,
    after: 1410,
    school: "Webster University Tashkent",
    award: "Presidential grant",
    quote:
      "English is my second language. Noctis taught me to read the exam, not translate every sentence.",
  },
  {
    name: "Javlon S.",
    city: "Namangan",
    houseId: "amberfell" as const,
    before: 980,
    after: 1360,
    school: "INHA University in Tashkent",
    award: "Merit scholarship",
    quote:
      "I was not ready for an eight-week sprint. Amberfell gave me a longer hallway and made me walk it every night.",
  },
] as const;

/* ------------------------------------------------------------------ */
/* Tuition                                                             */
/* ------------------------------------------------------------------ */

export const PLANS = [
  {
    id: "apprentice",
    name: "Apprentice",
    priceUzs: "2,900,000",
    priceUsd: 230,
    blurb: "Self-paced mocks and homework if you already know how to study.",
    featured: false,
    includes: [
      "House placement from diagnostic",
      "6 full Digital SAT mocks",
      "Adaptive homework bank",
      "Score reports & error logs",
      "Community hall (Telegram)",
    ],
  },
  {
    id: "scholar",
    name: "Scholar",
    priceUzs: "5,900,000",
    priceUsd: 465,
    blurb: "The standard oath: live house classes, a mentor, and the score pact.",
    featured: true,
    includes: [
      "Everything in Apprentice",
      "Live evening classes (Tashkent time)",
      "10+ full mocks + gauntlet week",
      "Named mentor, weekly review",
      "+150 score pact — 4 extra weeks if missed",
    ],
  },
  {
    id: "headmaster",
    name: "Headmaster's Circle",
    priceUzs: "9,900,000",
    priceUsd: 780,
    blurb: "Private tutoring, application mapping, and a seat at the high table.",
    featured: false,
    includes: [
      "Everything in Scholar",
      "Twice-weekly 1-on-1 sessions",
      "Scholarship shortlist for Uzbek universities",
      "Essay and counselor packet review",
      "Priority sorting for the next cohort",
    ],
  },
] as const;

/* ------------------------------------------------------------------ */
/* The house cup — standings this term                                 */
/* ------------------------------------------------------------------ */

export const HOUSE_POINTS = [
  { houseId: "veridian" as const, points: 517, note: "Gauntlet discipline" },
  { houseId: "amberfell" as const, points: 495, note: "Spellwork streaks" },
  { houseId: "aurelion" as const, points: 482, note: "Mock gains" },
  { houseId: "noctis" as const, points: 466, note: "Trap clearance" },
] as const;

export const FAQS = [  {
    q: "Do universities in Uzbekistan still want the SAT?",
    a: "Yes. AKFA, Webster Tashkent, New Uzbekistan University, INHA, Turin Polytechnic, and several others use SAT scores for admission and, more importantly, for scholarship bands. A 1400+ is often the difference between paying and not paying.",
  },
  {
    q: "Is this the Digital SAT?",
    a: "Only the Digital SAT. Classes, homework, and mocks follow the adaptive two-module format you will sit in Bluebook. We do not train you for a paper exam that no longer exists.",
  },
  {
    q: "How fast can I raise my score?",
    a: "Aurelion is eight weeks for students who already have a foundation. Veridian and Noctis run ten. Amberfell is sixteen for a full rebuild. Average gain across houses is +210. Your diagnostic decides the house, not a sales script.",
  },
  {
    q: "What language are classes in?",
    a: "English. The SAT is in English. Mentors can clarify in Uzbek or Russian when a concept snags, but the exam voice stays English on purpose.",
  },
  {
    q: "What is the score pact?",
    a: "On Scholar and Headmaster's Circle we agree a target gain from your diagnostic. If you complete the homework and mocks and miss that gain, we add four weeks of house classes at no extra tuition. It is not a cash refund of a score — it is more work, on us.",
  },
  {
    q: "I am not in Tashkent. Can I still join?",
    a: "Yes. Expecto is built as an online school. Live classes run on Tashkent evenings so the rest of Uzbekistan can sit them after school. You need a laptop, a quiet room, and the will to keep the oath.",
  },
  {
    q: "How do scholarships actually work?",
    a: "Each university publishes SAT thresholds for partial and full awards. After your gauntlet we map your score to those bands and help you file on time. We do not control admissions. We make the number they cannot ignore.",
  },
  {
    q: "What is the refund policy?",
    a: "You may withdraw within 7 days of sorting, before the second live class, for a full refund minus the diagnostic fee. After that, tuition converts to house credit for the following cohort.",
  },
] as const;
