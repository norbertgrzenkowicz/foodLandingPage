import { updateSession } from "./supabase/middleware";
import { type NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  try {
    return await updateSession(request);
  } catch (error) {
    console.error('Middleware error:', error);
    // Return a next response to prevent the middleware from failing
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    /*
     * Only match specific routes that need auth or session handling:
     * - Dashboard routes
     * - API routes
     * - Auth routes
     */
    '/dashboard/:path*',
    '/api/:path*',
    '/auth/:path*',
    '/sign-in',
    '/sign-up',
    '/forgot-password',
    '/success'
  ],
};
