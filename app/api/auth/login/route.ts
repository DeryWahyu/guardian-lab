import { NextResponse } from "next/server";
import { learningStreak } from "@/lib/academy/streak";
import { rejectCrossOrigin } from "@/lib/auth/access";
import { verifyPassword } from "@/lib/auth/password";
import { getPostLoginRedirect } from "@/lib/auth/redirect";
import {
  createSessionToken,
  getSessionCookieOptions,
  SESSION_COOKIE_NAME,
} from "@/lib/auth/session";
import { InputError, readInput } from "@/lib/investigations/request-input";
import { prisma } from "@/lib/prisma";
import { loginSchema } from "@/lib/validations/auth";

export async function POST(request: Request) {
  try {
    const originError = rejectCrossOrigin(request);
    if (originError) return originError;
    const body = await readInput(request, 16384, "json");
    const result = loginSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          error: "Validasi data gagal",
          details: result.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const { email, password } = result.data;

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        {
          error: "Email atau password tidak sesuai",
        },
        { status: 401 },
      );
    }

    // Verify password hash
    const isPasswordValid = await verifyPassword(password, user.passwordHash);
    if (!isPasswordValid) {
      return NextResponse.json(
        {
          error: "Email atau password tidak sesuai",
        },
        { status: 401 },
      );
    }

    // Login activity is separate from learning streaks.
    const now = new Date();
    const { updatedUser, token } = await prisma.$transaction(async (database) => {
      const updatedUser = await database.user.update({
        where: { id: user.id },
        data: {
          lastActiveAt: now,
        },
      });

      // Create signed JWT session token
      const token = await createSessionToken(updatedUser, database);
      return { updatedUser, token };
    });

    const userProfile = {
      id: updatedUser.id,
      email: updatedUser.email,
      name: updatedUser.name,
      role: updatedUser.role,
      exp: updatedUser.exp,
      streakDays: learningStreak(updatedUser.streakDays, updatedUser.lastLearningAt),
    };

    // Return response with Set-Cookie header attached
    const response = NextResponse.json({
      success: true,
      message: "Login berhasil",
      ...userProfile,
      user: userProfile,
      redirectTo: getPostLoginRedirect(updatedUser.role, result.data.redirect),
    });

    response.cookies.set(SESSION_COOKIE_NAME, token, getSessionCookieOptions());

    return response;
  } catch (error) {
    if (error instanceof InputError)
      return NextResponse.json({ error: error.message }, { status: error.status });
    console.error("Login API error:", error);
    return NextResponse.json(
      {
        error: "Terjadi kesalahan internal pada server",
      },
      { status: 500 },
    );
  }
}
