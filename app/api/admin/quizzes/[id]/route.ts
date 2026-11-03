import { NextResponse } from "next/server";
import { z } from "zod";
import { archiveQuiz, saveQuiz } from "@/lib/academy/admin";
import { academyError } from "@/lib/academy/http";
import { authorizeRequest } from "@/lib/auth/access";
import { readInput } from "@/lib/investigations/request-input";
import { quizInputSchema } from "@/lib/validations/academy";
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = await authorizeRequest(request, "ADMIN");
    if (auth.error) return auth.error;
    const { id } = await params;
    const { revision, ...input } = quizInputSchema
      .extend({ revision: z.iso.datetime() })
      .parse(await readInput(request, 200000, "json"));
    return NextResponse.json(await saveQuiz(input, id, revision));
  } catch (error) {
    return academyError(error);
  }
}
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = await authorizeRequest(request, "ADMIN");
    if (auth.error) return auth.error;
    const { id } = await params;
    return NextResponse.json(await archiveQuiz(id));
  } catch (error) {
    return academyError(error);
  }
}
