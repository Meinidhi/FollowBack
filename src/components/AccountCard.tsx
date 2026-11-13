import React from 'react';
import { ExternalLink } from 'lucide-react';
import { InstagramUser } from '../types/instagram';

interface AccountCardProps {
  user: InstagramUser;
  serialNumber: number;
}

export const AccountCard: React.FC<AccountCardProps> = ({ user, serialNumber }) => {
  const initial = user.username.charAt(0).toUpperCase();

  return (
    <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-sm flex items-center justify-between gap-3">
      <div className="flex items-center gap-3 min-w-0">
        <span className="text-xs font-bold text-slate-400 w-6 text-right flex-shrink-0">
          #{serialNumber}
        </span>
        <div className="w-10 h-10 rounded-full bg-primary/10 text-primary font-black text-sm flex items-center justify-center flex-shrink-0 border border-primary/20">
          {initial}
        </div>
        <div className="min-w-0">
          <a
            href={user.profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-main hover:text-primary transition-colors text-sm truncate block"
          >
            @{user.username}
          </a>
          {user.dateFollowed && (
            <span className="text-[11px] text-secondary">
              Followed: {user.dateFollowed}
            </span>
          )}
        </div>
      </div>

      <a
        href={user.profileUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold text-primary bg-primary-light hover:bg-primary/20 transition-colors flex-shrink-0"
      >
        <span>View</span>
        <ExternalLink className="w-3 h-3" />
      </a>
    </div>
  );
};
