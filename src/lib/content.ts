export const TELEGRAM_URL = "https://t.me/expectoacademy";
export const EMAIL = "hello@expecto.academy";
export const NEXT_COHORT = new Date("2026-09-08T09:00:00+05:00");

export const NAV_LINKS = [
  { href: "#film", label: "How it works" },
  { href: "#method", label: "Method" },
  { href: "#stories", label: "Results" },
  { href: "#pricing", label: "Tuition" },
  { href: "#faq", label: "FAQ" },
] as const;

export const HERO_PLATES = [
  { houseId: "aurelion" as const, score: "1480", school: "AKFA", award: "Full tuition" },
  { houseId: "veridian" as const, score: "1520", school: "NewUU", award: "100% merit" },
  { houseId: "noctis" as const, score: "1410", school: "Webster", award: "Presidential" },
  { houseId: "amberfell" as const, score: "1360", school: "INHA", award: "Merit band" },
] as const;

export const PROOF = "1,200+ students taught · +210 average gain · 340+ scholarships won";

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
    kicker: "Week 0 · The diagnostic",
    title: "First, you sit the real thing",
    body: "A full adaptive Digital SAT inside the actual Bluebook interface — same timer, same second module. We score it that night and show you exactly where the points went.",
    breadcrumb: "Bluebook · Practice Exam 1",
  },
  {
    index: "02",
    kicker: "The trap",
    title: "Every wrong answer has a design",
    body: "Choice B was almost right — that is what it was built to do. We walk the mark scheme until the trap stops costing you points.",
    breadcrumb: "Bluebook · Review · Question 7",
  },
  {
    index: "03",
    kicker: "Spellwork",
    title: "Tonight's homework comes from your own misses",
    body: "Your error log becomes the assignment — command of evidence, transitions, boundaries, drilled until they stop showing up.",
    breadcrumb: "Error log · Week 3",
  },
  {
    index: "04",
    kicker: "The gauntlet",
    title: "Three full exams, test-day rules",
    body: "Timed, adaptive, no pause button. By the third mock, test day is a room you have already sat in.",
    breadcrumb: "Gauntlet week · Mocks 09–11",
  },
  {
    index: "05",
    kicker: "The letter",
    title: "A number that funds a seat",
    body: "1480 — up 300 from the diagnostic, 98th percentile. Then the part that matters: which universities in Uzbekistan turn that number into tuition.",
    breadcrumb: "Score report · 14 Aug 2026",
  },
  {
    index: "06",
    kicker: "Enrolled",
    title: "Your seat is waiting",
    body: "First class 8 September, 19:00 Tashkent time. Bring your diagnostic — we start where you are weakest.",
    breadcrumb: "Telegram · Expecto",
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
    from: "Expecto Academy",
    text: "You're in. First class 8 Sep, 19:00 Tashkent.",
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
    from: "Expecto Academy",
    text: "It is the cohort average. Bring the diagnostic. We start where you are weakest.",
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
    term: "Before your first class, we agree a target score gain — in writing.",
  },
  {
    n: "II",
    term: "You do the homework and sit every mock. The work is yours; the plan is ours.",
  },
  {
    n: "III",
    term: "Do the work and still miss the gain, and your next four weeks are on us.",
  },
] as const;

export const OATH_RIDER =
  "This is not a refund policy. If you do the work and still miss the target, we keep teaching you — free — until the number lands.";

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
  { numeral: "III", label: "The oath", href: "#oath" },
  { numeral: "IV", label: "Letters", href: "#stories" },
  { numeral: "V", label: "Tuition", href: "#pricing" },
  { numeral: "VI", label: "Enroll", href: "#enroll" },
] as const;

/* ------------------------------------------------------------------ */
/* Method                                                              */
/* ------------------------------------------------------------------ */

export const METHOD_PILLARS = [
  {
    n: "01",
    title: "Live evening classes",
    body: "Small evening groups on Tashkent time. You know your classmates — this is not a 200-person webinar.",
  },
  {
    n: "02",
    title: "10+ Digital SAT mocks",
    body: "Full adaptive exams that behave like the real Bluebook test — same module logic, same timer, same score report.",
  },
  {
    n: "03",
    title: "A named mentor",
    body: "One person reads your mocks, rewrites your week, and stays until the score lands.",
  },
] as const;

export const METHOD_SUPPORT = [
  "Homework built from your own error log",
  "Bluebook format only — we do not teach the old paper test",
  "Score pact: miss your agreed gain and four extra weeks are on us",
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
      "I had one summer. Expecto treated that like a vow. The mocks felt cruel until test day felt quiet.",
  },
  {
    name: "Timur K.",
    city: "Samarkand",
    houseId: "veridian" as const,
    before: 1240,
    after: 1520,
    school: "New Uzbekistan University",
    award: "100% scholarship",
    quote: "Math was the only thing between me and a funded seat. They did not cheer. They drilled.",
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
      "English is my second language. They taught me to read the exam, not translate every sentence.",
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
      "I was not ready for an eight-week sprint. They gave me a longer runway and made me walk it every night.",
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
    blurb: "Self-paced mocks and homework for students who already know how to study.",
    featured: false,
    includes: [
      "Diagnostic test and placement",
      "6 full Digital SAT mocks",
      "Homework that adapts to your misses",
      "Score reports and error logs",
      "Student community on Telegram",
    ],
  },
  {
    id: "scholar",
    name: "Scholar",
    priceUzs: "5,900,000",
    priceUsd: 465,
    blurb: "The full program: live evening classes, a named mentor, and the score pact.",
    featured: true,
    includes: [
      "Everything in Apprentice",
      "Live evening classes, Tashkent time",
      "10+ full mocks, including gauntlet week",
      "A named mentor and weekly reviews",
      "+150 score pact — miss it, get 4 weeks free",
    ],
  },
  {
    id: "headmaster",
    name: "Headmaster's Circle",
    priceUzs: "9,900,000",
    priceUsd: 780,
    blurb: "Private tutoring plus hands-on help turning your score into a funded application.",
    featured: false,
    includes: [
      "Everything in Scholar",
      "One-on-one sessions twice a week",
      "Scholarship shortlist matched to your score",
      "Essay and application review",
      "Priority seat for the next cohort",
    ],
  },
] as const;

/* ------------------------------------------------------------------ */
/* FAQ                                                                 */
/* ------------------------------------------------------------------ */

export const FAQS = [
  {
    q: "Do universities in Uzbekistan still want the SAT?",
    a: "Yes. AKFA, Webster Tashkent, New Uzbekistan University, INHA, Turin Polytechnic, and several others use SAT scores for admission and scholarships. A 1400+ is often the difference between paying full price and paying nothing.",
  },
  {
    q: "Is this the Digital SAT?",
    a: "Only the Digital SAT. Classes, homework, and mocks all follow the adaptive two-module format you will sit in Bluebook. We do not teach the old paper test.",
  },
  {
    q: "How fast can I raise my score?",
    a: "Fast-track is eight weeks for students who already have a foundation. Math and verbal intensives run ten. Average gain is +210. Your diagnostic decides the plan, not a sales script.",
  },
  {
    q: "What language are classes in?",
    a: "English. The SAT is in English. Mentors can clarify in Uzbek or Russian when a concept snags, but the exam voice stays English.",
  },
  {
    q: "What is the score pact?",
    a: "On Scholar and Headmaster's Circle we set a target gain from your diagnostic, in writing. If you do the homework, sit the mocks, and still miss it, you get four more weeks of classes free.",
  },
  {
    q: "I am not in Tashkent. Can I still join?",
    a: "Yes. Expecto runs online. Live classes run on Tashkent evenings so the rest of the country can join after school. You need a laptop, a quiet room, and the discipline.",
  },
  {
    q: "How do scholarships actually work?",
    a: "Each university publishes its SAT thresholds for partial and full awards. After your final mocks, we map your score to the right band and help you get the paperwork in before the deadline.",
  },
  {
    q: "What is the refund policy?",
    a: "Withdraw within 7 days of enrollment, before the second live class, for a full refund minus the diagnostic fee. After that, tuition converts to credit for the following cohort.",
  },
] as const;
