// SPA route segment names for base-path derivation
const SPA_ROUTE_SEGMENTS = new Set([
  'login',
  'feed',
  'items',
  'search',
  'map-demo',
]);

let cachedBase: string | null = null;

// Normalise directory base with trailing slash
function normaliseBase(path: string): string {
  if (!path || path === '/') {
    return '/';
  }

  return path.endsWith('/') ? path : `${path}/`;
}

// Derive base by stripping known route segments from pathname tail
function deriveBaseFromPathname(pathname: string): string {
  let path = pathname.split('?')[0].split('#')[0] || '/';
  const parts = path.split('/').filter(Boolean);

  while (parts.length > 0) {
    const last = parts[parts.length - 1];

    if (/^\d+$/.test(last) && parts.length >= 2 && parts[parts.length - 2] === 'items') {
      parts.pop();
      continue;
    }

    if (SPA_ROUTE_SEGMENTS.has(last)) {
      parts.pop();
      continue;
    }

    break;
  }

  return normaliseBase(parts.length ? `/${parts.join('/')}/` : '/');
}

// Init base from Vite env
export function initAppBase(): void {
  const fromEnv = import.meta.env.BASE_URL || '/';
  cachedBase = normaliseBase(fromEnv);
}

// Prefix app-relative paths for router and links
export function appPath(routePath: string): string {
  if (!cachedBase) {
    initAppBase();
  }

  const base = cachedBase ?? '/';
  const cleaned = routePath.startsWith('/') ? routePath : `/${routePath}`;

  if (base === '/') {
    return cleaned;
  }

  const baseTrimmed = base.endsWith('/') ? base.slice(0, -1) : base;
  return `${baseTrimmed}${cleaned}`;
}
