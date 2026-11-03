import { NextResponse } from "next/server";
import { rejectCrossOrigin } from "@/lib/auth/access";
import { destroySession, SESSION_COOKIE_NAME } from "@/lib/auth/session";

export async function POST(request: Request) {
  try {
    const originError = rejectCrossOrigin(request);
    if (originError) return originError;
    await destroySession(request);

    const response = NextResponse.json({
      success: true,
      message: "Logout berhasil",
    });

    response.cookies.delete(SESSION_COOKIE_NAME);

    return response;
  } catch (error) {
    console.error("Logout API error:", error);
    return NextResponse.json(
      {
        error: "Terjadi kesalahan internal pada server",
      },
      { status: 500 },
    );
  }
}
