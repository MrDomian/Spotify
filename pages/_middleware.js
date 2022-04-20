import { getToken } from "next-auth/jwt"
import { NextResponse } from "next/server";

export async function middleware(req) {
    // Token będzie istniał, jeżeli użytkownik będzie zalogowany
    const token = await getToken({
        req,
        secret: process.env.JWT_SECRET,
        secureCookie:
          process.env.NEXTAUTH_URL?.startsWith("https://") ??
          !!process.env.VERCEL_URL,
      });

    const { pathname } = req.nextUrl
    // Zezwolę na żądanie, jeżeli są spełnione określone warunki:
    // 1) to ządanie od next-auth i providera
    // 2) token istnieje
    if (pathname.includes('/api/auth') || token) {
        return NextResponse.next();
    }

    // Przekieruję ich do logowania, jeżeli nie mają tokena i żądają bezpiecznego połączenia
    if (!token && pathname !== '/login') {
        return NextResponse.rewrite(new URL('/login', req.url))
    }
}