export const PUBLIC_ROUTES = {
  home: "/",
  sandboxWeb: "/sandbox/web",
  sandboxAndroid: "/sandbox/android",
  act: "/act",

  // Parameter Builders
  homeWithTab: (tab: "url" | "qr" | "apk") => `/?tab=${tab}`,
  investigation: (id: string, mode?: "human" | "geek") =>
    `/?investigation=${encodeURIComponent(id)}${mode ? `&mode=${mode}` : ""}`,
  homeWithMode: (mode: "human" | "geek", tab?: "url" | "qr" | "apk") =>
    `/?mode=${mode}${tab ? `&tab=${tab}` : ""}`,
  sandboxWebWithTarget: (target: string, investigationId?: string) =>
    `/sandbox/web?target=${encodeURIComponent(target)}${investigationId ? `&investigation=${encodeURIComponent(investigationId)}` : ""}`,
  actWithInvestigation: (id: string) => `/act?id=${encodeURIComponent(id)}`,
} as const;

export const AUTH_ROUTES = {
  login: "/login",
  register: "/register",
  loginWithRedirect: (target: string) => `/login?redirect=${encodeURIComponent(target)}`,
} as const;

export const PROTECTED_ROUTES = {
  history: "/history",
  historyDetail: (id: string, mode?: "human" | "geek") =>
    `/history/${encodeURIComponent(id)}${mode === "geek" ? "?mode=geek" : ""}`,
  academy: "/academy",
  academyLesson: (id: string) => `/academy/${encodeURIComponent(id)}`,
  community: "/community",
  leaderboard: "/community/leaderboard",
  leaderboardPage: (page: number) => `/community/leaderboard?page=${page}`,
  communitySubmit: (id: string) => `/community/submit?id=${encodeURIComponent(id)}`,
  communityMine: "/community?view=mine",
  communityReplay: (id: string) => `/community/${encodeURIComponent(id)}`,
} as const;

export const ADMIN_ROUTES = {
  dashboard: "/admin",
  quizzes: "/admin/quizzes",
  communityReviews: "/admin/community-reviews",
  users: "/admin/users",
} as const;

export const API_ROUTES = {
  platformOverview: "/api/platform/overview",
  leaderboard: (page: number) => `/api/community/leaderboard?page=${page}`,
  analyzeUrl: "/api/analyze-url",
  analyzeQr: "/api/analyze-qr",
  analyzeApk: "/api/analyze-apk",
  sandboxSession: "/api/sandbox/session",
  sandboxSessionStart: "/api/sandbox/session/start",
  sandboxSessionStop: "/api/sandbox/session/stop",
  sandboxAnalyzeDownload: (id: string, downloadId: string) =>
    `/api/sandbox/session/${encodeURIComponent(id)}/downloads/${encodeURIComponent(downloadId)}/analyze`,
  authRegister: "/api/auth/register",
  authLogin: "/api/auth/login",
  authLogout: "/api/auth/logout",
  authMe: "/api/auth/me",
  history: "/api/history",
  historyDetail: (id: string) => `/api/history/${encodeURIComponent(id)}`,
  academyProgress: "/api/academy/progress",
  quizzes: "/api/academy/quizzes",
  quizDetail: (id: string) => `/api/academy/quizzes/${encodeURIComponent(id)}`,
  submitQuiz: "/api/academy/submit-quiz",
  communitySubmit: "/api/community/submit",
  communityReplays: "/api/community/replays",
  communityReplay: (id: string) => `/api/community/replays/${encodeURIComponent(id)}`,
  communityPreview: (id: string) =>
    `/api/community/submit?investigationId=${encodeURIComponent(id)}`,
  replayAttempt: (id: string) => `/api/community/replays/${encodeURIComponent(id)}/attempt`,
  replayChallenge: (id: string) => `/api/community/replays/${encodeURIComponent(id)}/challenge`,
  adminQuizzes: "/api/admin/quizzes",
  adminQuizzesPage: (page: number) => `/api/admin/quizzes?page=${page}`,
  adminQuiz: (id: string) => `/api/admin/quizzes/${encodeURIComponent(id)}`,
  adminCommunityReviews: "/api/admin/community-reviews",
  adminCommunityReview: (id: string) => `/api/admin/community-reviews/${encodeURIComponent(id)}`,
} as const;

export const ROUTES = {
  public: PUBLIC_ROUTES,
  auth: AUTH_ROUTES,
  protected: PROTECTED_ROUTES,
  admin: ADMIN_ROUTES,
  api: API_ROUTES,
} as const;

export default ROUTES;
