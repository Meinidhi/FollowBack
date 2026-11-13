/**
 * FollowLens - 100% Client-Side Instagram Unfollower & Audience Tracker
 * All data is processed locally in the user's browser.
 */

// Application State
const state = {
  following: new Map(),        // Map<username, { username, timestamp, href }>
  followers: new Map(),        // Map<username, { username, timestamp, href }>
  pendingRequests: new Map(),  // Map<username, { username, timestamp, href }>
  whitelist: new Set(),        // Set<username> of VIP/whitelisted users
  currentTab: 'unfollowers',   // 'unfollowers' | 'fans' | 'mutuals' | 'pending' | 'whitelist' | 'following' | 'followers'
  searchQuery: '',
  sortBy: 'date-desc',         // 'date-desc' | 'date-asc' | 'alpha-asc' | 'alpha-desc'
  whitelistFilter: 'all',      // 'all' | 'hide-whitelist' | 'only-whitelist'
  loaded: false
};

// Load Whitelist from localStorage
function initWhitelist() {
  try {
    const saved = localStorage.getItem('ig_unfollows_whitelist');
    if (saved) {
      const list = JSON.parse(saved);
      state.whitelist = new Set(list);
    }
  } catch (e) {
    console.warn('Could not load whitelist from localStorage', e);
  }
}

function saveWhitelist() {
  try {
    localStorage.setItem('ig_unfollows_whitelist', JSON.stringify([...state.whitelist]));
  } catch (e) {
    console.warn('Could not save whitelist to localStorage', e);
  }
}

// Toast Notifications
function showToast(message, icon = '✨') {
  const container = document.getElementById('toast-container');
  if (!container) return;
  
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<span>${icon}</span> <span>${escapeHtml(message)}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 2800);
}

// Helper: Escape HTML
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Format Timestamps
function formatDate(timestamp) {
  if (!timestamp) return 'Date unknown';
  const ms = timestamp < 10000000000 ? timestamp * 1000 : timestamp;
  const date = new Date(ms);
  if (isNaN(date.getTime())) return 'Date unknown';
  
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

function timeAgo(timestamp) {
  if (!timestamp) return '';
  const ms = timestamp < 10000000000 ? timestamp * 1000 : timestamp;
  const now = Date.now();
  const diffSec = Math.floor((now - ms) / 1000);
  
  if (diffSec < 60) return 'Just now';
  if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`;
  if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`;
  if (diffSec < 2592000) return `${Math.floor(diffSec / 86400)}d ago`;
  if (diffSec < 31536000) return `${Math.floor(diffSec / 2592000)}mo ago`;
  return `${Math.floor(diffSec / 31536000)}y ago`;
}

// Clean Username Extractor
function sanitizeUsername(raw) {
  if (!raw) return '';
  let u = raw.trim();
  // Remove URLs if passed as full url
  if (u.includes('instagram.com/')) {
    const parts = u.split('instagram.com/')[1].split('/')[0].split('?')[0];
    u = parts;
  }
  return u.replace(/^@/, '').toLowerCase();
}

// Parsing Instagram Data Export Files
function parseSingleUserEntry(entry) {
  if (!entry) return null;

  // Modern Format: { title: "", string_list_data: [{ href: "", value: "username", timestamp: ... }] }
  if (entry.string_list_data && entry.string_list_data.length > 0) {
    const sub = entry.string_list_data[0];
    const username = sanitizeUsername(sub.value || entry.title || sub.href);
    if (!username) return null;
    return {
      username,
      timestamp: sub.timestamp || 0,
      href: sub.href || `https://www.instagram.com/${username}/`
    };
  }

  // Format with title only
  if (entry.title && typeof entry.title === 'string') {
    const username = sanitizeUsername(entry.title);
    if (username) {
      return {
        username,
        timestamp: entry.timestamp || 0,
        href: `https://www.instagram.com/${username}/`
      };
    }
  }

  // Legacy format: string only
  if (typeof entry === 'string') {
    const username = sanitizeUsername(entry);
    if (username) {
      return { username, timestamp: 0, href: `https://www.instagram.com/${username}/` };
    }
  }

  return null;
}

// Parse JSON Content
function parseInstagramJSON(content, targetType) {
  let parsed;
  try {
    parsed = typeof content === 'string' ? JSON.parse(content) : content;
  } catch (e) {
    console.error('JSON parse error:', e);
    return [];
  }

  const results = [];

  // Structure 1: Top-level Array (e.g. followers_1.json)
  if (Array.isArray(parsed)) {
    for (const item of parsed) {
      const user = parseSingleUserEntry(item);
      if (user) results.push(user);
    }
    return results;
  }

  // Structure 2: following.json -> { relationships_following: [ ... ] }
  if (parsed.relationships_following && Array.isArray(parsed.relationships_following)) {
    for (const item of parsed.relationships_following) {
      const user = parseSingleUserEntry(item);
      if (user) results.push(user);
    }
    return results;
  }

  // Structure 3: followers.json -> { relationships_followers: [ ... ] }
  if (parsed.relationships_followers && Array.isArray(parsed.relationships_followers)) {
    for (const item of parsed.relationships_followers) {
      const user = parseSingleUserEntry(item);
      if (user) results.push(user);
    }
    return results;
  }

  // Structure 4: pending_follow_requests.json -> { relationships_follow_requests_sent: [ ... ] }
  if (parsed.relationships_follow_requests_sent && Array.isArray(parsed.relationships_follow_requests_sent)) {
    for (const item of parsed.relationships_follow_requests_sent) {
      const user = parseSingleUserEntry(item);
      if (user) results.push(user);
    }
    return results;
  }

  // Structure 5: Legacy object keys { "username": timestamp }
  if (typeof parsed === 'object' && parsed !== null) {
    const root = parsed.followers || parsed.following || parsed;
    for (const [key, val] of Object.entries(root)) {
      if (typeof val === 'number') {
        const username = sanitizeUsername(key);
        if (username) results.push({ username, timestamp: val, href: `https://www.instagram.com/${username}/` });
      } else if (typeof val === 'object' && val !== null) {
        const user = parseSingleUserEntry(val);
        if (user) results.push(user);
      }
    }
  }

  return results;
}

// Parse HTML Content
function parseInstagramHTML(htmlText) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlText, 'text/html');
  const links = doc.querySelectorAll('a[href*="instagram.com/"]');
  const results = [];

  links.forEach(a => {
    const href = a.getAttribute('href') || '';
    const username = sanitizeUsername(a.textContent || href);
    if (!username || username === 'instagram' || username === 'about') return;

    let timestamp = 0;
    // Look for sibling div or time tag containing date
    const parent = a.parentElement;
    if (parent) {
      const timeElem = parent.querySelector('time');
      if (timeElem && timeElem.dateTime) {
        timestamp = Math.floor(new Date(timeElem.dateTime).getTime() / 1000);
      } else {
        // Try parsing text of parent or adjacent sibling
        const text = parent.textContent || '';
        const match = text.match(/(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]* \d{1,2},? \d{4}/i);
        if (match) {
          const parsedDate = new Date(match[0]);
          if (!isNaN(parsedDate.getTime())) {
            timestamp = Math.floor(parsedDate.getTime() / 1000);
          }
        }
      }
    }

    results.push({
      username,
      timestamp,
      href: `https://www.instagram.com/${username}/`
    });
  });

  return results;
}

// Pure JS Native Zip Reader (Fallback when JSZip is offline)
async function parseZipNative(arrayBuffer) {
  const view = new DataView(arrayBuffer);
  const files = {};
  let offset = 0;
  const len = view.byteLength;

  while (offset + 30 <= len) {
    const sig = view.getUint32(offset, true);
    if (sig !== 0x04034b50) break; // Not a local file header

    const compMethod = view.getUint16(offset + 8, true);
    const compSize = view.getUint32(offset + 18, true);
    const uncompSize = view.getUint32(offset + 22, true);
    const nameLen = view.getUint16(offset + 26, true);
    const extraLen = view.getUint16(offset + 28, true);

    const nameBytes = new Uint8Array(arrayBuffer, offset + 30, nameLen);
    const filename = new TextDecoder().decode(nameBytes);
    const dataOffset = offset + 30 + nameLen + extraLen;

    if (compSize > 0 && dataOffset + compSize <= len) {
      const slice = new Uint8Array(arrayBuffer, dataOffset, compSize);
      if (compMethod === 0) {
        // Uncompressed / Stored
        files[filename] = new TextDecoder().decode(slice);
      } else if (compMethod === 8 && typeof DecompressionStream !== 'undefined') {
        // Deflated - decompress with native browser DecompressionStream
        try {
          const ds = new DecompressionStream('deflate-raw');
          const stream = new Response(slice).body.pipeThrough(ds);
          const buf = await new Response(stream).arrayBuffer();
          files[filename] = new TextDecoder().decode(buf);
        } catch (e) {
          console.warn('Native decompression failed for', filename, e);
        }
      }
    }

    offset = dataOffset + compSize;
  }

  return files;
}

// Read ZIP File using JSZip or Native Fallback
async function extractZipFiles(file) {
  const filesMap = {};

  // Method 1: JSZip (CDN or global)
  if (typeof JSZip !== 'undefined') {
    const zip = new JSZip();
    const zipData = await zip.loadAsync(file);
    const entries = Object.keys(zipData.files);

    for (const filename of entries) {
      if (!zipData.files[filename].dir) {
        // We only care about json and html files
        if (filename.endsWith('.json') || filename.endsWith('.html')) {
          filesMap[filename] = await zipData.files[filename].async('string');
        }
      }
    }
    return filesMap;
  }

  // Method 2: Native fallback
  const buffer = await file.arrayBuffer();
  return await parseZipNative(buffer);
}

// Master File Processor
async function processFiles(fileList) {
  showProgress('Reading files...', 'Locally parsing Instagram data package');

  const followingList = [];
  const followersList = [];
  const pendingList = [];

  for (const file of fileList) {
    const name = file.name.toLowerCase();

    if (name.endsWith('.zip')) {
      showProgress('Extracting ZIP archive...', 'Unpacking Instagram export data');
      const zipEntries = await extractZipFiles(file);

      for (const [path, content] of Object.entries(zipEntries)) {
        const lowerPath = path.toLowerCase();
        
        // Following files
        if (lowerPath.includes('following') && !lowerPath.includes('pending') && !lowerPath.includes('recent')) {
          if (lowerPath.endsWith('.json')) {
            followingList.push(...parseInstagramJSON(content, 'following'));
          } else if (lowerPath.endsWith('.html')) {
            followingList.push(...parseInstagramHTML(content));
          }
        }
        // Followers files
        else if (lowerPath.includes('followers')) {
          if (lowerPath.endsWith('.json')) {
            followersList.push(...parseInstagramJSON(content, 'followers'));
          } else if (lowerPath.endsWith('.html')) {
            followersList.push(...parseInstagramHTML(content));
          }
        }
        // Pending follow requests
        else if (lowerPath.includes('pending_follow_requests') || lowerPath.includes('recent_follow_requests')) {
          if (lowerPath.endsWith('.json')) {
            pendingList.push(...parseInstagramJSON(content, 'pending'));
          } else if (lowerPath.endsWith('.html')) {
            pendingList.push(...parseInstagramHTML(content));
          }
        }
      }
    } else if (name.endsWith('.json')) {
      const text = await file.text();
      if (name.includes('following') && !name.includes('pending')) {
        followingList.push(...parseInstagramJSON(text, 'following'));
      } else if (name.includes('followers')) {
        followersList.push(...parseInstagramJSON(text, 'followers'));
      } else if (name.includes('pending')) {
        pendingList.push(...parseInstagramJSON(text, 'pending'));
      } else {
        // Try sniffing JSON structure
        const res = parseInstagramJSON(text);
        if (res.length > 0) followingList.push(...res);
      }
    } else if (name.endsWith('.html')) {
      const text = await file.text();
      if (name.includes('following')) {
        followingList.push(...parseInstagramHTML(text));
      } else if (name.includes('followers')) {
        followersList.push(...parseInstagramHTML(text));
      }
    }
  }

  // Populate State
  state.following.clear();
  state.followers.clear();
  state.pendingRequests.clear();

  for (const u of followingList) {
    if (u && u.username) state.following.set(u.username, u);
  }
  for (const u of followersList) {
    if (u && u.username) state.followers.set(u.username, u);
  }
  for (const u of pendingList) {
    if (u && u.username) state.pendingRequests.set(u.username, u);
  }

  hideProgress();

  if (state.following.size === 0 && state.followers.size === 0) {
    alert("Couldn't find any 'followers' or 'following' files in the uploaded data. Please ensure your ZIP includes the 'Followers and Following' information from Instagram.");
    return;
  }

  state.loaded = true;
  showDashboard();
  showToast(`Loaded ${state.following.size} following & ${state.followers.size} followers!`, '🎉');
}

// Progress UI
function showProgress(title, sub) {
  const container = document.getElementById('progress-container');
  const titleEl = document.getElementById('progress-title');
  const subEl = document.getElementById('progress-sub');
  if (container) {
    container.style.display = 'block';
    if (titleEl) titleEl.textContent = title;
    if (subEl) subEl.textContent = sub;
  }
}

function hideProgress() {
  const container = document.getElementById('progress-container');
  if (container) container.style.display = 'none';
}

// Show Dashboard & Render
function showDashboard() {
  const heroSection = document.getElementById('hero-section');
  const dashboardSection = document.getElementById('dashboard-section');

  if (heroSection) heroSection.style.display = 'none';
  if (dashboardSection) dashboardSection.style.display = 'block';

  updateStats();
  renderList();
}

// Reset / Upload New
function resetApp() {
  state.following.clear();
  state.followers.clear();
  state.pendingRequests.clear();
  state.loaded = false;
  state.searchQuery = '';

  const heroSection = document.getElementById('hero-section');
  const dashboardSection = document.getElementById('dashboard-section');
  const fileInput = document.getElementById('file-input');
  const folderInput = document.getElementById('folder-input');

  if (fileInput) fileInput.value = '';
  if (folderInput) folderInput.value = '';
  if (heroSection) heroSection.style.display = 'block';
  if (dashboardSection) dashboardSection.style.display = 'none';
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Calculate Categories
function getCategorizedUsers() {
  const unfollowers = [];
  const fans = [];
  const mutuals = [];
  const pending = [...state.pendingRequests.values()];
  const allFollowing = [...state.following.values()];
  const allFollowers = [...state.followers.values()];
  const whitelisted = [];

  for (const [username, user] of state.following.entries()) {
    if (state.whitelist.has(username)) {
      whitelisted.push(user);
    }
    if (!state.followers.has(username)) {
      unfollowers.push(user);
    } else {
      mutuals.push(user);
    }
  }

  for (const [username, user] of state.followers.entries()) {
    if (!state.following.has(username)) {
      fans.push(user);
    }
  }

  return {
    unfollowers,
    fans,
    mutuals,
    pending,
    whitelisted,
    following: allFollowing,
    followers: allFollowers
  };
}

// Update Top Stat Numbers
function updateStats() {
  const cats = getCategorizedUsers();

  const elUnfollowers = document.getElementById('stat-unfollowers-count');
  const elFans = document.getElementById('stat-fans-count');
  const elMutuals = document.getElementById('stat-mutuals-count');
  const elFollowing = document.getElementById('stat-following-count');
  const elFollowers = document.getElementById('stat-followers-count');

  if (elUnfollowers) elUnfollowers.textContent = cats.unfollowers.length.toLocaleString();
  if (elFans) elFans.textContent = cats.fans.length.toLocaleString();
  if (elMutuals) elMutuals.textContent = cats.mutuals.length.toLocaleString();
  if (elFollowing) elFollowing.textContent = cats.following.length.toLocaleString();
  if (elFollowers) elFollowers.textContent = cats.followers.length.toLocaleString();

  // Update Badges on Tabs
  const tabUnfollowers = document.getElementById('tab-badge-unfollowers');
  const tabFans = document.getElementById('tab-badge-fans');
  const tabMutuals = document.getElementById('tab-badge-mutuals');
  const tabPending = document.getElementById('tab-badge-pending');
  const tabWhitelist = document.getElementById('tab-badge-whitelist');
  const tabFollowing = document.getElementById('tab-badge-following');
  const tabFollowers = document.getElementById('tab-badge-followers');

  if (tabUnfollowers) tabUnfollowers.textContent = cats.unfollowers.length;
  if (tabFans) tabFans.textContent = cats.fans.length;
  if (tabMutuals) tabMutuals.textContent = cats.mutuals.length;
  if (tabPending) tabPending.textContent = cats.pending.length;
  if (tabWhitelist) tabWhitelist.textContent = state.whitelist.size;
  if (tabFollowing) tabFollowing.textContent = cats.following.length;
  if (tabFollowers) tabFollowers.textContent = cats.followers.length;
}

// Render the Active Tab's List
function renderList() {
  const cats = getCategorizedUsers();
  let items = [];

  switch (state.currentTab) {
    case 'unfollowers':
      items = cats.unfollowers;
      break;
    case 'fans':
      items = cats.fans;
      break;
    case 'mutuals':
      items = cats.mutuals;
      break;
    case 'pending':
      items = cats.pending;
      break;
    case 'whitelist':
      items = cats.whitelisted;
      break;
    case 'following':
      items = cats.following;
      break;
    case 'followers':
      items = cats.followers;
      break;
    default:
      items = cats.unfollowers;
  }

  // Filter Whitelist if on unfollowers tab
  if (state.currentTab === 'unfollowers') {
    if (state.whitelistFilter === 'hide-whitelist') {
      items = items.filter(u => !state.whitelist.has(u.username));
    } else if (state.whitelistFilter === 'only-whitelist') {
      items = items.filter(u => state.whitelist.has(u.username));
    }
  }

  // Search Filter
  if (state.searchQuery) {
    const q = state.searchQuery.toLowerCase();
    items = items.filter(u => u.username.toLowerCase().includes(q));
  }

  // Sorting
  items.sort((a, b) => {
    if (state.sortBy === 'date-desc') return (b.timestamp || 0) - (a.timestamp || 0);
    if (state.sortBy === 'date-asc') return (a.timestamp || 0) - (b.timestamp || 0);
    if (state.sortBy === 'alpha-asc') return a.username.localeCompare(b.username);
    if (state.sortBy === 'alpha-desc') return b.username.localeCompare(a.username);
    return 0;
  });

  // Render to DOM
  const container = document.getElementById('users-container');
  const countLabel = document.getElementById('results-count');

  if (countLabel) {
    countLabel.textContent = `Showing ${items.length.toLocaleString()} ${state.currentTab === 'unfollowers' ? 'non-followers' : 'accounts'}`;
  }

  if (!container) return;

  if (items.length === 0) {
    container.innerHTML = `
      <div class="empty-state" style="grid-column: 1 / -1;">
        <div class="empty-icon">${state.searchQuery ? '🔍' : '🎉'}</div>
        <div class="empty-title">${state.searchQuery ? 'No accounts match your search' : 'No accounts found in this category'}</div>
        <p>${state.searchQuery ? 'Try clearing the search input.' : 'Looks like everyone in this section is in good standing!'}</p>
      </div>
    `;
    return;
  }

  container.innerHTML = items.map(user => {
    const isWhitelisted = state.whitelist.has(user.username);
    const initial = user.username.charAt(0).toUpperCase();
    const dateStr = formatDate(user.timestamp);
    const agoStr = timeAgo(user.timestamp);

    return `
      <div class="user-card" data-username="${escapeHtml(user.username)}">
        <div class="user-info-group">
          <div class="user-avatar">${initial}</div>
          <div class="user-details">
            <a href="${escapeHtml(user.href)}" target="_blank" rel="noopener noreferrer" class="user-username">
              @${escapeHtml(user.username)}
              ${isWhitelisted ? '<span class="vip-badge" title="Protected VIP">⭐ VIP</span>' : ''}
            </a>
            <div class="user-meta">
              <span>📅 ${dateStr}</span>
              ${agoStr ? `<span>• ${agoStr}</span>` : ''}
            </div>
          </div>
        </div>
        <div class="user-actions">
          <button class="action-btn toggle-whitelist ${isWhitelisted ? 'active-star' : ''}" 
                  title="${isWhitelisted ? 'Remove from VIP Whitelist' : 'Add to VIP Whitelist (keep following)'}"
                  onclick="toggleWhitelist('${escapeHtml(user.username)}')">
            ⭐
          </button>
          <button class="action-btn copy-user" 
                  title="Copy @username" 
                  onclick="copyToClipboard('${escapeHtml(user.username)}')">
            📋
          </button>
          <a href="${escapeHtml(user.href)}" target="_blank" rel="noopener noreferrer" class="action-btn open-ig" title="Open profile on Instagram">
            ↗️
          </a>
        </div>
      </div>
    `;
  }).join('');
}

// Whitelist Toggle
window.toggleWhitelist = function(username) {
  if (state.whitelist.has(username)) {
    state.whitelist.delete(username);
    showToast(`Removed @${username} from VIP Whitelist`, '⭐');
  } else {
    state.whitelist.add(username);
    showToast(`Added @${username} to VIP Whitelist (Protected)`, '⭐');
  }
  saveWhitelist();
  updateStats();
  renderList();
};

// Clipboard Copy
window.copyToClipboard = function(text) {
  navigator.clipboard.writeText(text).then(() => {
    showToast(`Copied @${text} to clipboard!`, '📋');
  }).catch(() => {
    // Fallback
    const input = document.createElement('input');
    input.value = text;
    document.body.appendChild(input);
    input.select();
    document.execCommand('copy');
    input.remove();
    showToast(`Copied @${text} to clipboard!`, '📋');
  });
};

// Copy All Visible Usernames
function copyAllVisible() {
  const cards = document.querySelectorAll('.user-card');
  const usernames = Array.from(cards).map(c => c.getAttribute('data-username')).filter(Boolean);
  
  if (usernames.length === 0) {
    showToast('No usernames to copy', '⚠️');
    return;
  }

  const text = usernames.join('\n');
  navigator.clipboard.writeText(text).then(() => {
    showToast(`Copied ${usernames.length} usernames to clipboard!`, '📋');
  });
}

// Export to CSV
function exportCSV() {
  const cats = getCategorizedUsers();
  let items = cats.unfollowers;
  if (state.currentTab !== 'unfollowers') {
    items = cats[state.currentTab] || cats.unfollowers;
  }

  if (items.length === 0) {
    showToast('No accounts to export', '⚠️');
    return;
  }

  let csv = 'Username,Follow_Date,Profile_URL,Is_VIP\n';
  for (const u of items) {
    const isVip = state.whitelist.has(u.username) ? 'Yes' : 'No';
    const date = u.timestamp ? new Date(u.timestamp * 1000).toISOString().split('T')[0] : '';
    csv += `"${u.username}","${date}","${u.href}","${isVip}"\n`;
  }

  downloadFile(csv, `instagram_${state.currentTab}_${new Date().toISOString().slice(0, 10)}.csv`, 'text/csv');
  showToast(`Exported ${items.length} accounts to CSV!`, '💾');
}

// Export to TXT
function exportTXT() {
  const cats = getCategorizedUsers();
  let items = cats.unfollowers;
  if (state.currentTab !== 'unfollowers') {
    items = cats[state.currentTab] || cats.unfollowers;
  }

  if (items.length === 0) {
    showToast('No accounts to export', '⚠️');
    return;
  }

  const txt = items.map(u => u.username).join('\n');
  downloadFile(txt, `instagram_${state.currentTab}_${new Date().toISOString().slice(0, 10)}.txt`, 'text/plain');
  showToast(`Exported ${items.length} usernames to TXT!`, '📄');
}

function downloadFile(content, fileName, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

// Generate Realistic Demo Data
function loadDemoData() {
  showProgress('Generating realistic demo data...', 'Simulating Instagram followers export');
  
  const sampleFollowing = [
    { username: "natgeo", daysAgo: 450 },
    { username: "nasa", daysAgo: 380 },
    { username: "cristiano", daysAgo: 300 },
    { username: "leomessi", daysAgo: 290 },
    { username: "alex_travels", daysAgo: 120 },
    { username: "sophie.bakes", daysAgo: 110 },
    { username: "marcus_design", daysAgo: 95 },
    { username: "elena_runner", daysAgo: 85 },
    { username: "tech_insider", daysAgo: 70 },
    { username: "lucas_codes", daysAgo: 60 },
    { username: "mia_art_studio", daysAgo: 50 },
    { username: "david_music", daysAgo: 40 },
    { username: "sarah_fit", daysAgo: 35 },
    { username: "samuel_photo", daysAgo: 28 },
    { username: "emma_reads", daysAgo: 20 },
    { username: "jordan_skate", daysAgo: 15 },
    { username: "chloe_style", daysAgo: 10 },
    { username: "kevin_coffee", daysAgo: 5 },
    { username: "olivia_garden", daysAgo: 3 },
    { username: "liam_beats", daysAgo: 2 },
    { username: "maya_illustrates", daysAgo: 150 },
    { username: "ryan_drift", daysAgo: 200 },
    { username: "zack_gametime", daysAgo: 80 },
    { username: "zoe_yoga", daysAgo: 45 },
    { username: "ethan_adventures", daysAgo: 12 }
  ];

  const sampleFollowers = [
    { username: "alex_travels", daysAgo: 120 },
    { username: "sophie.bakes", daysAgo: 105 },
    { username: "elena_runner", daysAgo: 80 },
    { username: "lucas_codes", daysAgo: 60 },
    { username: "david_music", daysAgo: 38 },
    { username: "emma_reads", daysAgo: 18 },
    { username: "kevin_coffee", daysAgo: 5 },
    { username: "zoe_yoga", daysAgo: 44 },
    // Fans (follow you, but you don't follow back)
    { username: "fan_photography_99", daysAgo: 30 },
    { username: "random_memes_daily", daysAgo: 25 },
    { username: "guitar_lover_101", daysAgo: 15 },
    { username: "crypto_daily_news", daysAgo: 8 },
    { username: "art_collector_feed", daysAgo: 4 }
  ];

  const samplePending = [
    { username: "private_account_jenny", daysAgo: 14 },
    { username: "secret_hiker_dan", daysAgo: 7 }
  ];

  const nowSec = Math.floor(Date.now() / 1000);

  state.following.clear();
  state.followers.clear();
  state.pendingRequests.clear();

  sampleFollowing.forEach(item => {
    state.following.set(item.username, {
      username: item.username,
      timestamp: nowSec - item.daysAgo * 86400,
      href: `https://www.instagram.com/${item.username}/`
    });
  });

  sampleFollowers.forEach(item => {
    state.followers.set(item.username, {
      username: item.username,
      timestamp: nowSec - item.daysAgo * 86400,
      href: `https://www.instagram.com/${item.username}/`
    });
  });

  samplePending.forEach(item => {
    state.pendingRequests.set(item.username, {
      username: item.username,
      timestamp: nowSec - item.daysAgo * 86400,
      href: `https://www.instagram.com/${item.username}/`
    });
  });

  // Pre-seed a couple VIPs
  state.whitelist.add("natgeo");
  state.whitelist.add("nasa");
  saveWhitelist();

  setTimeout(() => {
    hideProgress();
    state.loaded = true;
    showDashboard();
    showToast("Demo data loaded successfully! Feel free to test all features.", "✨");
  }, 400);
}

// Event Listeners Initialization
function initEventListeners() {
  initWhitelist();

  // Drag and Drop
  const dropzone = document.getElementById('dropzone');
  const fileInput = document.getElementById('file-input');
  const folderInput = document.getElementById('folder-input');

  if (dropzone && fileInput) {
    dropzone.addEventListener('click', (e) => {
      // Don't trigger if clicked on a button inside
      if (e.target.closest('button') || e.target.closest('a')) return;
      fileInput.click();
    });

    ['dragenter', 'dragover'].forEach(eventName => {
      dropzone.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropzone.classList.add('drag-over');
      });
    });

    ['dragleave', 'drop'].forEach(eventName => {
      dropzone.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropzone.classList.remove('drag-over');
      });
    });

    dropzone.addEventListener('drop', (e) => {
      const dt = e.dataTransfer;
      if (dt && dt.files && dt.files.length > 0) {
        processFiles(dt.files);
      }
    });

    fileInput.addEventListener('change', (e) => {
      if (e.target.files && e.target.files.length > 0) {
        processFiles(e.target.files);
      }
    });
  }

  if (folderInput) {
    folderInput.addEventListener('change', (e) => {
      if (e.target.files && e.target.files.length > 0) {
        processFiles(e.target.files);
      }
    });
  }

  // Buttons inside dropzone
  const btnSelectFiles = document.getElementById('btn-select-files');
  const btnSelectFolder = document.getElementById('btn-select-folder');
  const btnDemoData = document.getElementById('btn-demo-data');
  const btnReset = document.getElementById('btn-reset');

  if (btnSelectFiles && fileInput) {
    btnSelectFiles.addEventListener('click', (e) => {
      e.stopPropagation();
      fileInput.click();
    });
  }

  if (btnSelectFolder && folderInput) {
    btnSelectFolder.addEventListener('click', (e) => {
      e.stopPropagation();
      folderInput.click();
    });
  }

  if (btnDemoData) {
    btnDemoData.addEventListener('click', (e) => {
      e.stopPropagation();
      loadDemoData();
    });
  }

  if (btnReset) {
    btnReset.addEventListener('click', resetApp);
  }

  // Tabs
  const tabBtns = document.querySelectorAll('.tab-btn');
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.currentTab = btn.getAttribute('data-tab');
      renderList();
    });
  });

  // Stat Cards click to switch tab
  const statCardUnfollowers = document.getElementById('card-stat-unfollowers');
  const statCardFans = document.getElementById('card-stat-fans');
  const statCardMutuals = document.getElementById('card-stat-mutuals');
  const statCardFollowing = document.getElementById('card-stat-following');
  const statCardFollowers = document.getElementById('card-stat-followers');

  const switchTab = (tabName) => {
    state.currentTab = tabName;
    tabBtns.forEach(b => {
      if (b.getAttribute('data-tab') === tabName) b.classList.add('active');
      else b.classList.remove('active');
    });
    renderList();
    const section = document.getElementById('toolbar-card');
    if (section) section.scrollIntoView({ behavior: 'smooth' });
  };

  if (statCardUnfollowers) statCardUnfollowers.addEventListener('click', () => switchTab('unfollowers'));
  if (statCardFans) statCardFans.addEventListener('click', () => switchTab('fans'));
  if (statCardMutuals) statCardMutuals.addEventListener('click', () => switchTab('mutuals'));
  if (statCardFollowing) statCardFollowing.addEventListener('click', () => switchTab('following'));
  if (statCardFollowers) statCardFollowers.addEventListener('click', () => switchTab('followers'));

  // Search input
  const searchInput = document.getElementById('search-input');
  const searchClear = document.getElementById('search-clear');

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      state.searchQuery = e.target.value.trim();
      if (searchClear) searchClear.style.display = state.searchQuery ? 'block' : 'none';
      renderList();
    });
  }

  if (searchClear && searchInput) {
    searchClear.addEventListener('click', () => {
      searchInput.value = '';
      state.searchQuery = '';
      searchClear.style.display = 'none';
      renderList();
      searchInput.focus();
    });
  }

  // Sort & Filter Dropdowns
  const sortSelect = document.getElementById('sort-select');
  const filterSelect = document.getElementById('filter-select');

  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      state.sortBy = e.target.value;
      renderList();
    });
  }

  if (filterSelect) {
    filterSelect.addEventListener('change', (e) => {
      state.whitelistFilter = e.target.value;
      renderList();
    });
  }

  // Bulk Action Buttons
  const btnCopyAll = document.getElementById('btn-copy-all');
  const btnExportCsv = document.getElementById('btn-export-csv');
  const btnExportTxt = document.getElementById('btn-export-txt');

  if (btnCopyAll) btnCopyAll.addEventListener('click', copyAllVisible);
  if (btnExportCsv) btnExportCsv.addEventListener('click', exportCSV);
  if (btnExportTxt) btnExportTxt.addEventListener('click', exportTXT);

  // Guide Modal
  const btnOpenGuide = document.getElementById('btn-open-guide');
  const btnOpenGuideHero = document.getElementById('btn-open-guide-hero');
  const guideModal = document.getElementById('guide-modal');
  const btnCloseGuide = document.getElementById('modal-close-btn');

  const openGuide = () => { if (guideModal) guideModal.style.display = 'flex'; };
  const closeGuide = () => { if (guideModal) guideModal.style.display = 'none'; };

  if (btnOpenGuide) btnOpenGuide.addEventListener('click', openGuide);
  if (btnOpenGuideHero) btnOpenGuideHero.addEventListener('click', openGuide);
  if (btnCloseGuide) btnCloseGuide.addEventListener('click', closeGuide);

  if (guideModal) {
    guideModal.addEventListener('click', (e) => {
      if (e.target === guideModal) closeGuide();
    });
  }

  // Theme Toggle
  const themeToggle = document.getElementById('theme-toggle');
  const savedTheme = localStorage.getItem('app_theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') || 'dark';
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('app_theme', next);
      updateThemeIcon(next);
    });
  }
}

function updateThemeIcon(theme) {
  const icon = document.getElementById('theme-icon');
  if (icon) {
    icon.textContent = theme === 'dark' ? '☀️' : '🌙';
  }
}

// Start
document.addEventListener('DOMContentLoaded', initEventListeners);
