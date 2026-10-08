import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

type CookieItem = {
  name: string;
  value: string;
  options?: Record<string, unknown>;
};

export const updateSession = async (request: NextRequest) => {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet: CookieItem[]) => {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;
  const isMemberRoute = path.startsWith('/tulis') || path.startsWith('/pengaturan');
  const isAdminRoute = path.startsWith('/admin');

  if ((isMemberRoute || isAdminRoute) && !user) {
    const url = request.nextUrl.clone();
    url.pathname = '/masuk';
    url.searchParams.set('next', path);
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
};
