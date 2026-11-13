import React from 'react';
import { ExternalLink, Sparkles } from 'lucide-react';
import { InstagramUser, ResultTab } from '../types/instagram';
import { AccountCard } from './AccountCard';

interface AccountTableProps {
  users: InstagramUser[];
  activeTab: ResultTab;
  startIndex: number;
  searchQuery: string;
}

export const AccountTable: React.FC<AccountTableProps> = ({
  users,
  activeTab,
  startIndex,
  searchQuery
}) => {
  if (users.length === 0) {
    let emptyTitle = 'No accounts found';
    let emptyDesc = 'No accounts found in this category.';

    if (searchQuery) {
      emptyTitle = 'No matching accounts';
      emptyDesc = `No usernames match "${searchQuery}". Try clearing the search query.`;
    } else if (activeTab === 'not_following_back') {
      emptyTitle = 'Everyone you follow follows you back!';
      emptyDesc = 'Congratulations! There are zero non-followers in your following list.';
    } else if (activeTab === 'you_dont_follow_back') {
      emptyTitle = 'You follow all your followers!';
      emptyDesc = 'You follow every single person who follows you.';
    } else if (activeTab === 'mutual') {
      emptyTitle = 'No mutual followers found.';
      emptyDesc = 'There are no mutual follower connections in this dataset.';
    }

    return (
      <div className="py-16 px-4 text-center bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
        <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center mb-3">
          <Sparkles className="w-6 h-6" />
        </div>
        <h4 className="text-lg font-bold text-main mb-1">{emptyTitle}</h4>
        <p className="text-sm text-secondary max-w-sm mx-auto">{emptyDesc}</p>
      </div>
    );
  }

  return (
    <div>
      {/* Desktop Table View */}
      <div className="hidden sm:block overflow-hidden rounded-xl border border-slate-200/90 shadow-sm bg-white">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-secondary">
              <th className="py-3.5 px-4 w-16 text-center">No.</th>
              <th className="py-3.5 px-4">Username</th>
              <th className="py-3.5 px-4">Instagram Profile</th>
              <th className="py-3.5 px-4 w-28 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {users.map((user, idx) => {
              const serial = startIndex + idx + 1;
              const initial = user.username.charAt(0).toUpperCase();

              return (
                <tr key={user.normalizedUsername} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="py-3.5 px-4 text-center font-bold text-slate-400 text-xs">
                    {serial}
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 text-primary font-black text-xs flex items-center justify-center flex-shrink-0 border border-primary/20">
                        {initial}
                      </div>
                      <div>
                        <span className="font-bold text-main group-hover:text-primary transition-colors">
                          @{user.username}
                        </span>
                        {user.dateFollowed && (
                          <div className="text-[11px] text-secondary">
                            {user.dateFollowed}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 text-xs font-mono text-secondary">
                    <a
                      href={user.profileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline hover:text-primary transition-colors"
                    >
                      instagram.com/{user.username}
                    </a>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <a
                      href={user.profileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold text-primary bg-primary-light hover:bg-primary/20 transition-colors shadow-sm"
                      title={`Open @${user.username} on Instagram`}
                    >
                      <span>View</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="sm:hidden space-y-2.5">
        {users.map((user, idx) => (
          <AccountCard
            key={user.normalizedUsername}
            user={user}
            serialNumber={startIndex + idx + 1}
          />
        ))}
      </div>
    </div>
  );
};
