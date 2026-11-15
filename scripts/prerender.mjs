import { mkdir, readFile, writeFile, rm } from 'node:fs/promises';
import { dirname } from 'node:path';
import { pages, render, renderMetadata } from '../.prerender/entry-server.js';

const template = await readFile('dist/index.html', 'utf8');
if (!template.includes('<!--app-html-->')) throw new Error('Missing prerender placeholder');
if (!template.includes('<!--page-metadata-->')) throw new Error('Missing metadata placeholder');
for (const page of [...pages, { path: '/404.html' }]) {
  const output =
    page.path === '/404.html'
      ? 'dist/404.html'
      : `dist${page.path === '/' ? '' : page.path}/index.html`;
  await mkdir(dirname(output), { recursive: true });
  const document = template
    .replace('<!--app-html-->', () => render(page.path))
    .replace('<!--page-metadata-->', () => renderMetadata(page.path));
  await writeFile(output, document);
}
await rm('.prerender', { recursive: true });
console.log(`Prerendered ${pages.length} pages and the 404 document.`);
