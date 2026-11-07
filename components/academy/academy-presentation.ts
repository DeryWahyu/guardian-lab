import { Link2, MessagesSquare, ShieldCheck } from "lucide-react";
import type { z } from "zod";
import type {
  academyProgressSchema,
  quizDetailSchema,
  quizResultSchema,
  quizSummarySchema,
} from "@/lib/validations/academy";

export type AcademyProgress = z.infer<typeof academyProgressSchema>;
export type AcademyQuiz = z.infer<typeof quizSummarySchema>;
export type AcademyLesson = z.infer<typeof quizDetailSchema>;
export type AcademyResult = z.infer<typeof quizResultSchema>;

export const academyTopics = {
  SPOT_THE_PHISH: { label: "Kenali phishing", Icon: Link2 },
  SOCIAL_ENGINEERING: { label: "Rekayasa sosial", Icon: MessagesSquare },
  DANGEROUS_PERMISSIONS: { label: "Izin aplikasi", Icon: ShieldCheck },
};

export function formatStudyDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "Tanggal belum tersedia"
    : new Intl.DateTimeFormat("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
        timeZone: "Asia/Jakarta",
      }).format(date);
}
