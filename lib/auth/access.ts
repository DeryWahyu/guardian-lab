import { NextResponse } from "next/server";
import { getCurrentUser, type UserSession } from "./session";

export function rejectCrossOrigin(request: Request): NextResponse | null {
  const origin = request.headers.get("origin");
  if (!origin || ["GET", "HEAD", "OPTIONS"].includes(request.method)) return null;
  let expected = new URL(request.url);
  const host = request.headers.get("host");
  // NextURL normalizes loopback addresses to localhost; retain the browser's actual Host.
  if (
    expected.hostname === "localhost" &&
    host &&
    /^(?:localhost|127(?:\.\d{1,3}){3}|\[::1\])(?::\d+)?$/i.test(host)
  ) {
    try {
      const actual = new URL(`${expected.protocol}//${host}`);
      if (actual.port === expected.port) expected = actual;
    } catch {
      // Invalid Host values cannot change the expected origin.
    }
  }
  if (origin === expected.origin) return null;
  return NextResponse.json(
    { error: "Permintaan berasal dari situs yang tidak diizinkan." },
    { status: 403 },
  );
}

type Authorization = { user: UserSession; error: null } | { user: null; error: NextResponse };

export async function authorizeRequest(request: Request, role?: "ADMIN"): Promise<Authorization> {
  const originError = rejectCrossOrigin(request);
  if (originError) return { user: null, error: originError };
  const user = await getCurrentUser(request);
  if (!user) {
    return {
      user: null,
      error: NextResponse.json(
        { error: "Silakan masuk untuk menggunakan fitur ini." },
        { status: 401 },
      ),
    };
  }
  if (role && user.role !== role) {
    return {
      user: null,
      error: NextResponse.json({ error: "Akses khusus administrator." }, { status: 403 }),
    };
  }
  return { user, error: null };
}
