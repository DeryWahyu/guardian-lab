import { NextResponse } from "next/server";
import { rejectCrossOrigin } from "@/lib/auth/access";
import { hashPassword } from "@/lib/auth/password";
import {
  createSessionToken,
  getSessionCookieOptions,
  SESSION_COOKIE_NAME,
} from "@/lib/auth/session";
import { InputError, readInput } from "@/lib/investigations/request-input";
import { prisma } from "@/lib/prisma";
import { PUBLIC_ROUTES } from "@/lib/routes";
import { registerSchema } from "@/lib/validations/auth";

export async function POST(request: Request) {
  try {
    const originError = rejectCrossOrigin(request);
    if (originError) return originError;
    const body = await readInput(request, 16384, "json");
    const result = registerSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          error: "Validasi data gagal",
          details: result.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const { name, email, password } = result.data;

    // Check for duplicate email
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        {
          error: "Email sudah terdaftar. Silakan masuk menggunakan akun Anda.",
        },
        { status: 409 },
      );
    }

    // Hash password with bcryptjs
    const passwordHash = await hashPassword(password);

    // Create user with default gamification profile: 0 EXP, no learning streak
    const { user, token } = await prisma.$transaction(async (database) => {
      const user = await database.user.create({
        data: {
          name,
          email,
          passwordHash,
          role: "USER",
          exp: 0,
          streakDays: 0,
          lastActiveAt: new Date(),
        },
      });

      // Create signed JWT session token
      const token = await createSessionToken(user, database);
      return { user, token };
    });

    const userProfile = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      exp: user.exp,
      streakDays: user.streakDays,
    };

    // Return response with Set-Cookie header attached
    const response = NextResponse.json(
      {
        success: true,
        message: "Registrasi akun Guardian Lab berhasil",
        ...userProfile,
        user: userProfile,
        redirectTo: PUBLIC_ROUTES.home,
      },
      { status: 201 },
    );

    response.cookies.set(SESSION_COOKIE_NAME, token, getSessionCookieOptions());

    return response;
  } catch (error: unknown) {
    if (error instanceof InputError)
      return NextResponse.json({ error: error.message }, { status: error.status });
    if (error && typeof error === "object" && "code" in error && error.code === "P2002") {
      return NextResponse.json(
        {
          error: "Email sudah terdaftar. Silakan masuk menggunakan akun Anda.",
        },
        { status: 409 },
      );
    }
    console.error("Register API error:", error);
    return NextResponse.json(
      {
        error: "Terjadi kesalahan internal pada server",
      },
      { status: 500 },
    );
  }
}
