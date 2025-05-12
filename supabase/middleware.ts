import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";
import { type CookieOptions } from '@supabase/ssr';

type CookieSetOptions = CookieOptions & {
  name: string;
  value: string;
};

interface Cookie {
  name: string;
  value: string;
  options?: CookieOptions;
}

export const updateSession = async (request: NextRequest) => {
  try {
    // Create an unmodified response
    let response = NextResponse.next();

    // Ensure environment variables are available
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('Missing Supabase environment variables');
      return response;
    }

    const supabase = createServerClient(
      supabaseUrl,
      supabaseAnonKey,
      {
        cookies: {
          get(name: string) {
            return request.cookies.get(name)?.value;
          },
          set(name: string, value: string, options?: CookieOptions) {
            try {
              response.cookies.set({
                name,
                value,
                ...options,
              });
            } catch (error) {
              console.error(`Error setting cookie ${name}:`, error);
            }
          },
          remove(name: string, options?: CookieOptions) {
            try {
              response.cookies.set({
                name,
                value: "",
                ...options,
                maxAge: 0,
              });
            } catch (error) {
              console.error(`Error removing cookie ${name}:`, error);
            }
          },
        },
      }
    );

    try {
      // This will refresh session if expired - required for Server Components
      // https://supabase.com/docs/guides/auth/server-side/nextjs
      await supabase.auth.getSession();

      // protected routes
      if (request.nextUrl.pathname.startsWith("/dashboard")) {
        const { data } = await supabase.auth.getSession();
        const session = data?.session;
        
        if (!session) {
          return NextResponse.redirect(new URL("/sign-in", request.url));
        }
      }
    } catch (sessionError) {
      console.error("Session handling error:", sessionError);
      // Don't block the request if session handling fails
    }

    return response;
  } catch (e) {
    console.error("Supabase middleware error:", e);
    // If you are here, a Supabase client could not be created!
    return NextResponse.next();
  }
};
