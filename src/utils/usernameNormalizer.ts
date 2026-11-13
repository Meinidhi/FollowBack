/**
 * Utilities for sanitizing, normalizing and formatting Instagram usernames.
 */

export function sanitizeUsername(raw: unknown): string {
  if (typeof raw !== 'string') return '';
  let u = raw.trim();

  // If passed as full Instagram profile URL (e.g. https://www.instagram.com/username/)
  if (u.includes('instagram.com/')) {
    try {
      const url = new URL(u.startsWith('http') ? u : `https://${u}`);
      let pathname = url.pathname.replace(/^\/+|\/+$/g, '');
      if (pathname.startsWith('_u/')) {
        pathname = pathname.substring(3);
      }
      const parts = pathname.split('/');
      u = parts[0] || '';
    } catch {
      // Fallback string extraction
      const match = u.match(/instagram\.com\/(?:_u\/)?([a-zA-Z0-9._]+)/i);
      if (match && match[1]) {
        u = match[1];
      }
    }
  }

  // Remove leading @ if present
  u = u.replace(/^@+/, '').trim();

  // Validate Instagram username format: 1-30 chars, letters, numbers, periods, underscores
  if (!/^[a-zA-Z0-9._]{1,30}$/.test(u)) {
    // If it has spaces or invalid symbols, check if it was just trailing garbage
    const cleanMatch = u.match(/[a-zA-Z0-9._]{1,30}/);
    if (cleanMatch) {
      u = cleanMatch[0];
    } else {
      return '';
    }
  }

  return u;
}

export function normalizeForComparison(username: string): string {
  return username.toLowerCase().trim();
}

export function getProfileUrl(username: string): string {
  return `https://www.instagram.com/${username}/`;
}

export function formatTimestamp(timestamp?: number): string {
  if (!timestamp) return 'Date unavailable';
  const ms = timestamp < 10000000000 ? timestamp * 1000 : timestamp;
  const d = new Date(ms);
  if (isNaN(d.getTime())) return 'Date unavailable';
  return d.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}
