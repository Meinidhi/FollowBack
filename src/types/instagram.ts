export interface InstagramUser {
  username: string;
  normalizedUsername: string;
  profileUrl: string;
  timestamp?: number;
  dateFollowed?: string;
}

export interface AnalysisResult {
  totalFollowers: number;
  totalFollowing: number;
  notFollowingBack: InstagramUser[];
  youDontFollowBack: InstagramUser[];
  mutualFollowers: InstagramUser[];
  nonFollowersCount: number;
  youDontFollowBackCount: number;
  mutualFollowersCount: number;
  nonFollowersPercentage: number;
  analysisTimestamp: string;
  fileName: string;
  fileSize: number;
}

export type ResultTab = 'not_following_back' | 'you_dont_follow_back' | 'mutual';

export type SortOrder = 'default' | 'az' | 'za';

export interface ProcessingError {
  type: 'html_export' | 'missing_files' | 'invalid_zip' | 'corrupted' | 'empty_lists' | 'generic';
  title: string;
  message: string;
  actionableGuide?: boolean;
}
