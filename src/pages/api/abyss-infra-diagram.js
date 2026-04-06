import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).end();
  }

  const filePath = path.join(process.cwd(), 'src/content/abyss-infra-diagram.html');
  let html;
  try {
    html = fs.readFileSync(filePath, 'utf-8');
  } catch (err) {
    console.error('abyss-infra-diagram: failed to read file', err);
    return res.status(500).send('Abyss infrastructure diagram unavailable.');
  }

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=3600');
  res.send(html);
}
