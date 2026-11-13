import { InstagramUser } from '../types/instagram';
import { sanitizeUsername, normalizeForComparison, getProfileUrl, formatTimestamp } from './usernameNormalizer';

interface RawListData {
  href?: string;
  value?: string;
  timestamp?: number;
}

interface RawUserEntry {
  title?: string;
  value?: string;
  timestamp?: number;
  string_list_data?: RawListData[];
  media_list_data?: unknown[];
}

/**
 * Extracts an InstagramUser from a raw entry according to the priority rules:
 * 1. string_list_data[0].value
 * 2. title
 * 3. extracted from string_list_data[0].href
 */
export function extractUserFromEntry(entry: unknown): InstagramUser | null {
  if (!entry || typeof entry !== 'object') return null;

  const raw = entry as RawUserEntry;
  let username = '';
  let timestamp: number | undefined;

  // 1. Try string_list_data[0]
  if (Array.isArray(raw.string_list_data) && raw.string_list_data.length > 0) {
    const primary = raw.string_list_data[0];
    if (primary) {
      if (primary.value && typeof primary.value === 'string') {
        username = sanitizeUsername(primary.value);
      }
      if (!username && primary.href && typeof primary.href === 'string') {
        username = sanitizeUsername(primary.href);
      }
      if (typeof primary.timestamp === 'number') {
        timestamp = primary.timestamp;
      }
    }
  }

  // 2. Fallback to title
  if (!username && raw.title && typeof raw.title === 'string') {
    username = sanitizeUsername(raw.title);
  }

  // 3. Fallback to entry.value
  if (!username && raw.value && typeof raw.value === 'string') {
    username = sanitizeUsername(raw.value);
  }

  // Fallback timestamp from root entry if available
  if (!timestamp && typeof raw.timestamp === 'number') {
    timestamp = raw.timestamp;
  }

  if (!username) return null;

  // Guard against numeric strings that are timestamps mistaken for usernames
  if (/^\d{9,13}$/.test(username)) {
    return null;
  }

  const normalized = normalizeForComparison(username);

  return {
    username,
    normalizedUsername: normalized,
    profileUrl: getProfileUrl(username),
    timestamp,
    dateFollowed: timestamp ? formatTimestamp(timestamp) : undefined
  };
}

/**
 * Parses followers JSON content (typically followers_1.json, followers_2.json).
 * Handles top-level array, or wrapper objects like { relationships_followers: [] } or { followers: [] }.
 */
export function parseFollowersJson(jsonString: string): InstagramUser[] {
  let parsed: unknown;
  try {
    parsed = JSON.parse(jsonString);
  } catch (err) {
    console.error('Failed to parse followers JSON', err);
    throw new Error('Invalid JSON syntax in followers file.');
  }

  const entries: unknown[] = [];

  if (Array.isArray(parsed)) {
    entries.push(...parsed);
  } else if (parsed && typeof parsed === 'object') {
    const obj = parsed as Record<string, unknown>;
    if (Array.isArray(obj.relationships_followers)) {
      entries.push(...obj.relationships_followers);
    } else if (Array.isArray(obj.followers)) {
      entries.push(...obj.followers);
    } else {
      // Legacy dictionary format: { "username": timestamp }
      for (const [key, val] of Object.entries(obj)) {
        if (typeof val === 'number') {
          entries.push({ title: key, timestamp: val });
        } else if (typeof val === 'object' && val !== null) {
          entries.push(val);
        }
      }
    }
  }

  const userMap = new Map<string, InstagramUser>();
  for (const item of entries) {
    const user = extractUserFromEntry(item);
    if (user && !userMap.has(user.normalizedUsername)) {
      userMap.set(user.normalizedUsername, user);
    }
  }

  return Array.from(userMap.values());
}

/**
 * Parses following JSON content (typically following.json).
 * Handles { relationships_following: [] } or top-level array or { following: [] }.
 */
export function parseFollowingJson(jsonString: string): InstagramUser[] {
  let parsed: unknown;
  try {
    parsed = JSON.parse(jsonString);
  } catch (err) {
    console.error('Failed to parse following JSON', err);
    throw new Error('Invalid JSON syntax in following file.');
  }

  const entries: unknown[] = [];

  if (parsed && typeof parsed === 'object') {
    const obj = parsed as Record<string, unknown>;
    if (Array.isArray(obj.relationships_following)) {
      entries.push(...obj.relationships_following);
    } else if (Array.isArray(obj.following)) {
      entries.push(...obj.following);
    } else if (Array.isArray(parsed)) {
      entries.push(...parsed);
    } else {
      // Legacy dictionary format
      for (const [key, val] of Object.entries(obj)) {
        if (typeof val === 'number') {
          entries.push({ title: key, timestamp: val });
        } else if (typeof val === 'object' && val !== null) {
          entries.push(val);
        }
      }
    }
  } else if (Array.isArray(parsed)) {
    entries.push(...parsed);
  }

  const userMap = new Map<string, InstagramUser>();
  for (const item of entries) {
    const user = extractUserFromEntry(item);
    if (user && !userMap.has(user.normalizedUsername)) {
      userMap.set(user.normalizedUsername, user);
    }
  }

  return Array.from(userMap.values());
}
