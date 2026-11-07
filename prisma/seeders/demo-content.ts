export const DEMO_VERSION = "local-demo-v1";
export const DEMO_ANALYSIS_SOURCE = "LOCAL_DEMO";
const DAY = 86_400_000;
const WIB_OFFSET = 7 * 3_600_000;

export type DemoStep = {
  kind: "quiz" | "case";
  key: string;
  daysAgo: number;
  pass: boolean;
};

export type DemoProfile = {
  email: string;
  key: string;
  title: string;
  filename: string;
  permissions: string[];
  riskScore: number;
  riskLevel: "HIGH" | "MEDIUM";
  secondaryStatus: "PENDING_REVIEW" | "REJECTED";
  timeline: DemoStep[];
};

export const demoProfiles: DemoProfile[] = [
  {
    email: "gading@gmail.com",
    key: "gading",
    title: "Izin SMS pada undangan digital",
    filename: "undangan-latihan.apk",
    permissions: ["android.permission.READ_SMS", "android.permission.RECEIVE_SMS"],
    riskScore: 82,
    riskLevel: "HIGH",
    secondaryStatus: "PENDING_REVIEW",
    timeline: [
      { kind: "quiz", key: "academy-url-basics", daysAgo: 2, pass: false },
      { kind: "quiz", key: "academy-url-basics", daysAgo: 1, pass: true },
      { kind: "case", key: "dery", daysAgo: 0, pass: true },
    ],
  },
  {
    email: "dery@gmail.com",
    key: "dery",
    title: "Akses kontak yang tidak sesuai fungsi aplikasi",
    filename: "hadiah-latihan.apk",
    permissions: ["android.permission.READ_CONTACTS", "android.permission.READ_PHONE_STATE"],
    riskScore: 58,
    riskLevel: "MEDIUM",
    secondaryStatus: "REJECTED",
    timeline: [
      { kind: "quiz", key: "academy-message-basics", daysAgo: 4, pass: false },
      { kind: "quiz", key: "academy-url-basics", daysAgo: 3, pass: true },
      { kind: "quiz", key: "academy-message-basics", daysAgo: 2, pass: true },
      { kind: "case", key: "rafli", daysAgo: 1, pass: false },
      { kind: "case", key: "rafli", daysAgo: 0, pass: true },
    ],
  },
  {
    email: "rafli@gmail.com",
    key: "rafli",
    title: "Permintaan akses overlay pada berkas pengiriman",
    filename: "paket-latihan.apk",
    permissions: ["android.permission.SYSTEM_ALERT_WINDOW", "android.permission.READ_SMS"],
    riskScore: 76,
    riskLevel: "HIGH",
    secondaryStatus: "PENDING_REVIEW",
    timeline: [
      { kind: "quiz", key: "academy-url-basics", daysAgo: 6, pass: false },
      { kind: "quiz", key: "academy-url-basics", daysAgo: 5, pass: true },
      { kind: "quiz", key: "academy-message-basics", daysAgo: 4, pass: true },
      { kind: "quiz", key: "academy-permission-basics", daysAgo: 3, pass: true },
      { kind: "case", key: "gading", daysAgo: 2, pass: true },
      { kind: "case", key: "dery", daysAgo: 1, pass: false },
      { kind: "case", key: "dery", daysAgo: 0, pass: true },
    ],
  },
];

export const demoId = (...parts: string[]) => [DEMO_VERSION, ...parts].join("-");
export const learningDay = (date: Date) => Math.floor((date.getTime() + WIB_OFFSET) / DAY);

/** Synthetic history cannot predate the existing account or lie in the future. */
export function demoTime(now: Date, daysAgo: number, joinedAt: Date) {
  return new Date(Math.max(joinedAt.getTime(), now.getTime() - daysAgo * DAY));
}

/** Merge the new history with persisted learning days, including older legacy streaks. */
export function demoLearningSummary(
  dates: Date[],
  previous: { lastLearningAt: Date | null; streakDays: number },
) {
  const all = previous.lastLearningAt ? [...dates, previous.lastLearningAt] : dates;
  if (!all.length) return { lastLearningAt: null, streakDays: 0 };
  const lastLearningAt = new Date(
    all.reduce((latest, date) => Math.max(latest, date.getTime()), 0),
  );
  const days = new Set(all.map(learningDay));
  const latest = learningDay(lastLearningAt);
  let first = latest;
  while (days.has(first - 1)) first -= 1;
  if (previous.lastLearningAt && previous.streakDays > 0) {
    const anchor = learningDay(previous.lastLearningAt);
    if (anchor >= first - 1 && anchor <= latest) {
      first = Math.min(first, anchor - previous.streakDays + 1);
      while (days.has(first - 1)) first -= 1;
    }
  }
  return { lastLearningAt, streakDays: latest - first + 1 };
}
