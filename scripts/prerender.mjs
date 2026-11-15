import { readFile, writeFile, rm } from 'node:fs/promises';
import { render } from '../.prerender/entry-server.js';

const template = await readFile('dist/index.html', 'utf8');
if (!template.includes('<!--app-html-->')) throw new Error('Missing prerender placeholder');
await writeFile('dist/index.html', template.replace('<!--app-html-->', render('/')));
const notFound = template
  .replace('<!--app-html-->', render('/not-found'))
  .replace(/<title>.*?<\/title>/, '<title>Page not found — Luc Joosten</title>')
  .replace(/<link rel="canonical"[^>]*>/, '<meta name="robots" content="noindex" />')
  .replace(/<meta property="og:[^>]*>/g, '');
await writeFile('dist/404.html', notFound);
await rm('.prerender', { recursive: true });
console.log('Prerendered homepage and 404 document.');
