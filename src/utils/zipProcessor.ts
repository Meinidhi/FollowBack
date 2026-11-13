import JSZip from 'jszip';
import { InstagramUser, ProcessingError } from '../types/instagram';
import { parseFollowersJson, parseFollowingJson } from './jsonParser';

export interface ExtractedData {
  followers: InstagramUser[];
  following: InstagramUser[];
  detectedFollowerFiles: string[];
  detectedFollowingFile: string;
}

/**
 * Extracts basename from a file path inside the ZIP.
 * e.g., "connections/followers_and_following/followers_1.json" -> "followers_1.json"
 */
function getBasename(path: string): string {
  return path.split('/').pop()?.split('\\').pop() || '';
}

/**
 * Validates and extracts Instagram data from an uploaded ZIP file.
 */
export async function processInstagramZip(
  file: File,
  onProgress?: (step: string, percent: number) => void
): Promise<ExtractedData> {
  onProgress?.('Verifying archive format...', 10);

  // 1. Basic file type check
  if (!file.name.toLowerCase().endsWith('.zip') && file.type !== 'application/zip' && file.type !== 'application/x-zip-compressed') {
    throw createError(
      'invalid_zip',
      'Invalid File Format',
      'Please upload a valid .zip archive file downloaded from Instagram.'
    );
  }

  // 2. Load ZIP with JSZip
  let zip: JSZip;
  try {
    zip = await JSZip.loadAsync(file);
  } catch (err) {
    console.error('JSZip loading error', err);
    throw createError(
      'corrupted',
      'Corrupted Archive',
      'Could not open this ZIP file. The file may be damaged or incomplete. Please re-download it from Instagram.'
    );
  }

  onProgress?.('Scanning archive contents...', 30);

  const filePaths = Object.keys(zip.files).filter(p => !zip.files[p].dir);

  // 3. Detect if user uploaded an HTML export instead of JSON
  const htmlFiles = filePaths.filter(p => {
    const base = getBasename(p).toLowerCase();
    return base.endsWith('.html') && (base.includes('follower') || base.includes('following'));
  });

  if (htmlFiles.length > 0) {
    throw createError(
      'html_export',
      'HTML Export Detected',
      'Your Instagram export appears to be in HTML format. FollowBack currently supports JSON exports only. Please download your Instagram information again and select JSON instead of HTML.',
      true
    );
  }

  // 4. Find all followers_*.json files and following.json
  // We match by basename to avoid bugs with parent directory names!
  const followerZipEntries: { path: string; file: JSZip.JSZipObject }[] = [];
  let followingZipEntry: { path: string; file: JSZip.JSZipObject } | null = null;

  for (const path of filePaths) {
    const base = getBasename(path).toLowerCase();

    // Followers pattern: followers_1.json, followers_2.json, followers.json
    if (/^followers(_\d+)?\.json$/i.test(base)) {
      followerZipEntries.push({ path, file: zip.files[path] });
    }
    // Following pattern: following.json, following_1.json
    else if (/^following(_\d+)?\.json$/i.test(base) && !base.includes('pending') && !base.includes('recent')) {
      followingZipEntry = { path, file: zip.files[path] };
    }
  }

  // 5. Check for missing files
  if (!followingZipEntry && followerZipEntries.length === 0) {
    throw createError(
      'missing_files',
      'Missing Follower Data',
      'Could not find any "followers" or "following" JSON files in this archive. Please verify that you selected "Followers and following" when downloading your data from Instagram.'
    );
  }

  if (!followingZipEntry) {
    throw createError(
      'missing_files',
      'Missing following.json',
      'The "following.json" file was not found in your ZIP archive. Please ensure your Instagram export was complete and selected "Followers and following".'
    );
  }

  if (followerZipEntries.length === 0) {
    throw createError(
      'missing_files',
      'Missing followers JSON file',
      'No "followers_*.json" files were found in your ZIP archive. Please verify that your Instagram export included your follower list.'
    );
  }

  onProgress?.('Parsing following data...', 55);

  // 6. Parse following.json
  const followingJsonText = await followingZipEntry.file.async('string');
  const followingUsers = parseFollowingJson(followingJsonText);

  onProgress?.('Parsing follower files...', 75);

  // 7. Parse all followers_*.json files and combine
  const allFollowersMap = new Map<string, InstagramUser>();
  const detectedFollowerNames: string[] = [];

  // Sort follower entries to maintain orderly processing (e.g. followers_1, followers_2)
  followerZipEntries.sort((a, b) => a.path.localeCompare(b.path));

  for (const entry of followerZipEntries) {
    detectedFollowerNames.push(getBasename(entry.path));
    const jsonText = await entry.file.async('string');
    const users = parseFollowersJson(jsonText);
    for (const u of users) {
      if (!allFollowersMap.has(u.normalizedUsername)) {
        allFollowersMap.set(u.normalizedUsername, u);
      }
    }
  }

  const followersUsers = Array.from(allFollowersMap.values());

  onProgress?.('Finalizing analysis...', 95);

  // 8. Validate non-empty lists
  if (followingUsers.length === 0 && followersUsers.length === 0) {
    throw createError(
      'empty_lists',
      'No Accounts Found',
      'Both followers and following lists were empty or could not be parsed from the provided JSON files.'
    );
  }

  return {
    followers: followersUsers,
    following: followingUsers,
    detectedFollowerFiles: detectedFollowerNames,
    detectedFollowingFile: getBasename(followingZipEntry.path)
  };
}

function createError(
  type: ProcessingError['type'],
  title: string,
  message: string,
  actionableGuide = false
): Error & ProcessingError {
  const err = new Error(message) as Error & ProcessingError;
  err.type = type;
  err.title = title;
  err.actionableGuide = actionableGuide;
  return err;
}
