import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth";

// Vérifie le cookie `board_session` sur toutes les routes sauf /login.
// Si absent ou invalide → redirect vers /login (CLAUDE.md section 6).
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // /login reste accessible sans session.
  if (pathname === "/login") {
    return NextResponse.next();
  }

  const token = req.cookies.get(SESSION_COOKIE)?.value;
  const isValid = await verifySessionToken(token, process.env.BOARD_SESSION_SECRET ?? "");

  if (!isValid) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  // Exclut les assets statiques Next.js de la vérification.
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
