import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).end();
  }

  try {
    const html = fs.readFileSync(path.join(process.cwd(), 'src/content/healthier-care-loop.html'), 'utf-8');
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    return res.send(html);
  } catch (error) {
    console.error('healthier-care-loop: failed to read file', error);
    return res.status(500).send('Healthier care loop unavailable.');
  }
}
