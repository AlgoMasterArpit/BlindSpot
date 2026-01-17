import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
export { default } from "next-auth/middleware";

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const url = request.nextUrl;

  // 1. Agar User Logged In hai
  // Aur wo Auth pages ya Home par jaane ki koshish kar raha hai
  // Toh use Dashboard par bhej do
  if (
    token &&
    (
      url.pathname.startsWith('/auth/sign-in') || // ✅ Updated path
      url.pathname.startsWith('/auth/sign-up') || // ✅ Updated path
      url.pathname.startsWith('/verify') ||
      url.pathname === '/'
    )
  ) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // 2. Agar User Logged Out hai
  // Aur wo Dashboard access karne ki koshish kar raha hai
  // Toh use Login page par bhej do
  if (!token && url.pathname.startsWith('/dashboard')) {
   
  return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

// Configuration
export const config = {
  matcher: [
    // 👇 Yahan bhi paths update karna zaroori hai
    '/auth/sign-in',
    '/auth/sign-up',
    '/',
    '/dashboard/:path*',
    '/verify/:path*',
  ],
};