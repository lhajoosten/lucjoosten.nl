const origin = 'https://lucjoosten.nl';

export type PageMetadata = {
  path: string;
  title: string;
  description: string;
};

export const pages: readonly PageMetadata[] = [
  {
    path: '/about',
    title: 'About — Luc Joosten',
    description:
      'Meet Luc Joosten: a software engineer in the Netherlands connecting full-stack development, AI integration and practical engineering principles.',
  },
  {
    path: '/',
    title: 'Luc Joosten — Software Engineer | AI & Full-Stack',
    description:
      'Luc Joosten, software engineer in the Netherlands specializing in AI engineering and full-stack development. Building AI-powered applications at Crowe Netherlands.',
  },
  {
    path: '/projects',
    title: 'Projects — Luc Joosten',
    description:
      'Explore Luc Joosten’s curated projects in developer tooling and cloud engineering, with current status and a Release Log case study.',
  },
  {
    path: '/projects/release-log',
    title: 'Release Log — Luc Joosten',
    description:
      'Release Log: a packaged TypeScript CLI for deterministic changelogs, reviewed release PRs and exact version tagging, with clear AI boundaries.',
  },
];

const notFound: PageMetadata = {
  path: '/404.html',
  title: 'Page not found — Luc Joosten',
  description: 'The page you’re looking for doesn’t exist. Return to Luc Joosten’s homepage.',
};

export function metadataFor(pathname: string) {
  const path = pathname.replace(/\/$/, '') || '/';
  const page = pages.find((entry) => entry.path === path);
  return { ...(page ?? notFound), canonical: page ? `${origin}${page.path}` : null };
}

function escapeAttribute(value: string) {
  return value.replace(
    /[&<>"']/g,
    (character) =>
      ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
      })[character]!,
  );
}

export function renderMetadata(pathname: string) {
  const metadata = metadataFor(pathname);
  const title = escapeAttribute(metadata.title);
  const description = escapeAttribute(metadata.description);
  return `<title>${title}</title>
    <meta name="description" content="${description}" />
    ${
      metadata.canonical
        ? `<link rel="canonical" href="${metadata.canonical}" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="${metadata.canonical}" />`
        : '<meta name="robots" content="noindex" />'
    }`;
}

export function updateMetadata(pathname: string) {
  const metadata = metadataFor(pathname);
  document.title = metadata.title;
  const setMeta = (attribute: 'name' | 'property', key: string, value: string | null) => {
    const existing = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`);
    if (value === null) {
      existing?.remove();
      return;
    }
    const element = existing ?? document.createElement('meta');
    element.setAttribute(attribute, key);
    element.content = value;
    if (!existing) document.head.append(element);
  };
  setMeta('name', 'description', metadata.description);
  setMeta('name', 'robots', metadata.canonical ? null : 'noindex');
  setMeta('property', 'og:title', metadata.canonical ? metadata.title : null);
  setMeta('property', 'og:description', metadata.canonical ? metadata.description : null);
  setMeta('property', 'og:type', metadata.canonical ? 'website' : null);
  setMeta('property', 'og:url', metadata.canonical);
  const existing = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (metadata.canonical) {
    const canonical = existing ?? document.createElement('link');
    canonical.rel = 'canonical';
    canonical.href = metadata.canonical;
    if (!existing) document.head.append(canonical);
  } else existing?.remove();
}
