import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
//  we want  authentication for entire website so we used this middleware
export {default} from "next-auth/middleware";/* from doc*/
export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const url = request.nextUrl;

  // 1. Agar User ke paas Token hai (Logged In hai)
  // Aur wo dobara Sign-in, Sign-up ya Verify page par jaane ki koshish kar raha hai
  // Toh use dashboard par bhej do.
  if (
    token &&
    (url.pathname.startsWith('/sign-in') ||
      url.pathname.startsWith('/sign-up') ||
      url.pathname.startsWith('/verify') ||
      url.pathname === '/')
  ) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // 2. Agar User ke paas Token NAHI hai (Logged Out hai)
  // Aur wo Dashboard access karne ki koshish kar raha hai
  // Toh use Sign-in page par bhej do.
  if (!token && url.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  // Agar upar wala koi case nahi hai, toh jane do jahan ja raha hai
  return NextResponse.next();
}

// Configuration: Middleware sirf in raaston (paths) par chalega
export const config = {
  matcher: [
    '/sign-in',
    '/sign-up',
    '/',
    '/dashboard/:path*', // :path* ka matlab dashboard ke aage kuch bhi ho (e.g. /dashboard/profile)
    '/verify/:path*',
  ],
};