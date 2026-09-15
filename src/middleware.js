import { NextResponse } from 'next/server';

const NOTES_COOKIE = 'notes_access';
const NOTES_COOKIE_MESSAGE = 'aarushagarwal:notes-access';
const NO_STORE_HEADERS = {
  'Cache-Control': 'private, no-store, max-age=0, must-revalidate',
  Pragma: 'no-cache',
};

function isProtectedNotesPath(pathname) {
  if (pathname.startsWith('/notes') || pathname === '/ai-notes') {
    return true;
  }

  return /^\/_next\/data\/[^/]+\/notes(?:\/|\.json$)/.test(pathname);
}

async function getNotesAccessToken(password) {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(password),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const signature = await crypto.subtle.sign(
    'HMAC',
    key,
    new TextEncoder().encode(NOTES_COOKIE_MESSAGE),
  );

  return btoa(String.fromCharCode(...new Uint8Array(signature)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

export async function middleware(request) {
  if (!isProtectedNotesPath(request.nextUrl.pathname)) {
    return NextResponse.next();
  }

  const password = process.env.NOTES_PASSWORD;
  if (!password) {
    return new NextResponse('Notes access is not configured.', {
      status: 503,
      headers: NO_STORE_HEADERS,
    });
  }

  const expectedToken = await getNotesAccessToken(password);
  const accessToken = request.cookies.get(NOTES_COOKIE)?.value;

  if (accessToken === expectedToken) {
    const response = NextResponse.next({ headers: NO_STORE_HEADERS });
    response.cookies.set(NOTES_COOKIE, '', {
      path: '/',
      maxAge: 0,
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    });
    return response;
  }

  const loginUrl = request.nextUrl.clone();
  loginUrl.pathname = '/notes-access';
  loginUrl.search = new URLSearchParams({
    next: `${request.nextUrl.pathname}${request.nextUrl.search}`,
  }).toString();

  return NextResponse.redirect(loginUrl, { headers: NO_STORE_HEADERS });
}

export const config = {
  matcher: ['/notes/:path*', '/ai-notes', '/_next/data/:path*'],
};
