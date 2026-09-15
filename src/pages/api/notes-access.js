import { createHmac, timingSafeEqual } from 'node:crypto';

const NOTES_COOKIE = 'notes_access';
const NOTES_COOKIE_MESSAGE = 'aarushagarwal:notes-access';

function createNotesAccessToken(password) {
  return createHmac('sha256', password)
    .update(NOTES_COOKIE_MESSAGE)
    .digest('base64url');
}

function passwordsMatch(providedPassword, expectedPassword) {
  const provided = Buffer.from(providedPassword);
  const expected = Buffer.from(expectedPassword);

  return provided.length === expected.length && timingSafeEqual(provided, expected);
}

export default function handler(req, res) {
  const isProduction = process.env.NODE_ENV === 'production';
  res.setHeader('Cache-Control', 'private, no-store, max-age=0, must-revalidate');
  res.setHeader('Pragma', 'no-cache');

  if (req.method === 'DELETE') {
    res.setHeader(
      'Set-Cookie',
      `${NOTES_COOKIE}=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax${isProduction ? '; Secure' : ''}`,
    );
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST, DELETE');
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  const expectedPassword = process.env.NOTES_PASSWORD;
  if (!expectedPassword) {
    return res.status(503).json({ error: 'Notes access is not configured.' });
  }

  const password = typeof req.body?.password === 'string' ? req.body.password : '';
  if (!passwordsMatch(password, expectedPassword)) {
    return res.status(401).json({ error: 'Incorrect password.' });
  }

  res.setHeader(
    'Set-Cookie',
    `${NOTES_COOKIE}=${createNotesAccessToken(expectedPassword)}; Path=/; HttpOnly; SameSite=Lax${isProduction ? '; Secure' : ''}`,
  );

  return res.status(204).end();
}
