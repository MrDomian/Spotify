import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

const authSecret = process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET;

export async function middleware(req) {
    const isSecure = req.nextUrl.protocol === "https:";

    const token = await getToken({
        req,
        secret: authSecret,
        secureCookie: isSecure,
    });

    const { pathname } = req.nextUrl;

    if (pathname.startsWith("/api/auth")) {
        return NextResponse.next();
    }

    if (token && pathname === "/login") {
        return NextResponse.redirect(new URL("/", req.url));
    }

    if (!token && pathname !== "/login") {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
