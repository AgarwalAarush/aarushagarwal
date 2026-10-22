import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).end();
  }
  const files = { pca: 'pca.html', binstepper: 'binstepper.html' };
  const file = typeof req.query.kind === 'string' && Object.hasOwn(files, req.query.kind)
    ? files[req.query.kind]
    : null;
  if (!file) return res.status(404).end();
  const html = fs.readFileSync(path.join(process.cwd(), 'src/content/fastgraph-diagrams', file), 'utf8');
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'no-cache');
  res.send(html);
}
