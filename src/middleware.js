import { NextResponse } from 'next/server';

const NOTES_COOKIE = 'notes_access';
const NOTES_COOKIE_MESSAGE = 'aarushagarwal:notes-access';

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
    return new NextResponse('Notes access is not configured.', { status: 503 });
  }

  const expectedToken = await getNotesAccessToken(password);
  const accessToken = request.cookies.get(NOTES_COOKIE)?.value;

  if (accessToken === expectedToken) {
    return NextResponse.next();
  }

  const loginUrl = request.nextUrl.clone();
  loginUrl.pathname = '/notes-access';
  loginUrl.search = new URLSearchParams({
    next: `${request.nextUrl.pathname}${request.nextUrl.search}`,
  }).toString();

  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ['/notes/:path*', '/ai-notes', '/_next/data/:path*'],
};
