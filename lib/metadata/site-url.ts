/** Indexing output must never silently publish a preview origin. */
export function indexingSiteUrl(): string {
  const production = process.env.NODE_ENV === 'production' || Boolean(process.env.CI && process.env.CI !== 'false') || Boolean(process.env.VERCEL);
  const configured = process.env.NEXT_PUBLIC_SITE_URL;
  if (!configured && !production) return 'http://localhost:3000';
  const error = new Error('NEXT_PUBLIC_SITE_URL must be a valid public HTTP(S) origin for production indexing.');
  if (!configured) throw error;
  let site: URL;
  try { site = new URL(configured); } catch { throw error; }
  if (!['http:', 'https:'].includes(site.protocol) || site.username || site.password) throw error;
  const hostname = site.hostname.toLowerCase().replace(/\.+$/, '');
  if (production && (hostname === 'localhost' || hostname.endsWith('.localhost') || hostname === '[::1]' || hostname === '0.0.0.0' || hostname.startsWith('127.'))) throw error;
  return site.origin;
}
