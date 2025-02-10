import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";


export async function middleware(req:NextRequest){
    const token = await getToken({req, secret:process.env.NEXTAUTH_SECRET});

    const { pathname } = req.nextUrl;

    if ((!token && pathname.startsWith("/dashboard"))) {
        return NextResponse.redirect(new URL("/auth/signin", req.url))
    }

    if (pathname.startsWith("/admin")) {
        if (!token || token.role !== "admin") {
            return NextResponse.redirect(new URL("/", req.url))
        }
    }

    if (token && pathname.startsWith("/auth/signin")) {
        return NextResponse.redirect(new URL("/", req.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: ["/dashboard/:path*", "/admin/:path*", "/auth/signin"]
}