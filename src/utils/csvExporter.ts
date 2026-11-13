import { InstagramUser, ResultTab } from '../types/instagram';

export function exportUsersToCsv(users: InstagramUser[], tab: ResultTab): void {
  if (!users || users.length === 0) return;

  const filenames: Record<ResultTab, string> = {
    not_following_back: 'instagram_non_followers.csv',
    you_dont_follow_back: 'instagram_you_dont_follow_back.csv',
    mutual: 'instagram_mutual_followers.csv'
  };

  const filename = filenames[tab] || 'instagram_users.csv';

  // Build CSV content
  const headers = ['Serial Number', 'Username', 'Instagram Profile URL'];
  const rows: string[] = [headers.join(',')];

  users.forEach((user, index) => {
    const serial = index + 1;
    // Escape username and url against commas or quotes
    const cleanUser = `"${user.username.replace(/"/g, '""')}"`;
    const cleanUrl = `"${user.profileUrl.replace(/"/g, '""')}"`;
    rows.push(`${serial},${cleanUser},${cleanUrl}`);
  });

  const csvContent = rows.join('\r\n');
  // UTF-8 BOM for Excel compatibility
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // Revoke object URL to prevent memory leaks
  setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 1000);
}
