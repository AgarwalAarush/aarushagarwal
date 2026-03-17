import fs from 'fs';
import path from 'path';

/**
 * Serves the AutoReflex circuit diagram HTML.
 * File lives in src/content/ so it's committed and deployed (public/ is gitignored).
 */
export default function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).end();
  }

  const filePath = path.join(process.cwd(), 'src/content/circuit-diagram.html');
  let html;
  try {
    html = fs.readFileSync(filePath, 'utf-8');
  } catch (err) {
    console.error('circuit-diagram: failed to read file', err);
    return res.status(500).send('Circuit diagram unavailable.');
  }

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=3600');
  res.send(html);
}
