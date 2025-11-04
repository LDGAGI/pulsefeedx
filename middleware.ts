import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale, localePrefix } from './i18n.config';
import { updateSession } from '@/lib/supabase/middleware';
import { type NextRequest } from 'next/server';

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix
});

export async function middleware(request: NextRequest) {
  // Update Supabase auth session
  const supabaseResponse = await updateSession(request);

  // Apply internationalization middleware
  const intlResponse = intlMiddleware(request);

  // Merge cookies from both middlewares
  supabaseResponse.cookies.getAll().forEach((cookie) => {
    intlResponse.cookies.set(cookie.name, cookie.value);
  });

  return intlResponse;
}

export const config = {
  matcher: [
    '/',
    '/((?!api|_next|_vercel|.*\\..*).*)'
  ]
};
