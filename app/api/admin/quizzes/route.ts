import { NextResponse } from "next/server";
import { adminQuizzes, saveQuiz } from "@/lib/academy/admin";
import { academyError } from "@/lib/academy/http";
import { authorizeRequest } from "@/lib/auth/access";
import { readInput } from "@/lib/investigations/request-input";
import { safeConnection } from "@/lib/security/connection";
import { adminQuizPageSchema, quizInputSchema } from "@/lib/validations/academy";
export async function GET(request: Request) {
  await safeConnection();
  try {
    const auth = await authorizeRequest(request, "ADMIN");
    if (auth.error) return auth.error;
    const page = adminQuizPageSchema.parse(
      new URL(request.url).searchParams.get("page") ?? undefined,
    );
    return NextResponse.json(await adminQuizzes(page), {
      headers: { "Cache-Control": "private, no-store" },
    });
  } catch (error) {
    return academyError(error);
  }
}
export async function POST(request: Request) {
  try {
    const auth = await authorizeRequest(request, "ADMIN");
    if (auth.error) return auth.error;
    return NextResponse.json(
      await saveQuiz(quizInputSchema.parse(await readInput(request, 200000, "json"))),
      { status: 201 },
    );
  } catch (error) {
    return academyError(error);
  }
}
