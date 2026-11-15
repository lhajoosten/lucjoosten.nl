import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

export async function documents(directory, relative = '') {
  const output = [];
  for (const entry of await readdir(join(directory, relative), { withFileTypes: true })) {
    const path = join(relative, entry.name);
    if (entry.isDirectory()) output.push(...(await documents(directory, path)));
    else if (entry.name === 'index.html') {
      const html = await readFile(join(directory, path), 'utf8');
      const title = html.match(/<title>([\s\S]*?)<\/title>/)?.[0];
      const canonical = html.match(/<link rel="canonical"[^>]*>/)?.[0];
      const heading = html.match(/<h1\b[^>]*>[\s\S]*?<\/h1>/)?.[0];
      if (!title || !canonical || !heading)
        throw new Error(`Incomplete static metadata/content: ${path}`);
      output.push({
        path: `/${path.replace(/index\.html$/, '').replace(/\/$/, '')}`,
        title,
        canonical,
        heading,
      });
    }
  }
  return output;
}

export async function smoke(origin, expected, { request = fetch, bypass } = {}) {
  const base = new URL(origin);
  if (
    base.protocol !== 'https:' ||
    base.origin !== origin ||
    !(base.hostname.endsWith('.vercel.app') || base.hostname === 'lucjoosten.nl')
  ) {
    throw new Error('Expected an HTTPS Vercel deployment origin or the production domain.');
  }
  if (!expected.some((page) => page.path === '/'))
    throw new Error('Missing homepage smoke expectation.');
  const get = async (path) => {
    let url = new URL(path, base);
    for (let redirects = 0; redirects <= 5; redirects++) {
      const response = await request(url, {
        headers: bypass ? { 'x-vercel-protection-bypass': bypass } : {},
        redirect: 'manual',
        signal: AbortSignal.timeout(30_000),
      });
      if (![301, 302, 303, 307, 308].includes(response.status)) return response;
      const next = new URL(response.headers.get('location'), url);
      if (next.origin !== base.origin)
        throw new Error('Smoke request redirected outside the deployment; check protection setup.');
      url = next;
    }
    throw new Error('Too many smoke redirects.');
  };
  for (const page of expected) {
    const response = await get(page.path);
    const html = await response.text();
    if (
      response.status !== 200 ||
      !html.includes(page.title) ||
      !html.includes(page.canonical) ||
      !html.includes(page.heading)
    ) {
      throw new Error(`Static page smoke failed: ${page.path} (${response.status}).`);
    }
    console.log(`200 with expected content and metadata: ${page.path}`);
  }
  const missing = await get('/__deployment-smoke-missing__');
  const html = await missing.text();
  if (
    missing.status !== 404 ||
    !html.includes('This path ends here') ||
    !/name="robots" content="noindex"/.test(html) ||
    /rel="canonical"/.test(html)
  ) {
    throw new Error('Unknown route did not return the custom noindex HTTP 404 document.');
  }
  console.log('404 with custom noindex document: unknown route');
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  documents('dist')
    .then((expected) =>
      smoke(process.argv[2], expected, { bypass: process.env.VERCEL_AUTOMATION_BYPASS_SECRET }),
    )
    .catch((error) => {
      console.error(error.message);
      process.exitCode = 1;
    });
}
