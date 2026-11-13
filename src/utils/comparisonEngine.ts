import { InstagramUser, AnalysisResult } from '../types/instagram';

/**
 * Performs high-performance set-based list comparisons.
 * A = Followers
 * B = Following
 *
 * 1. NOT FOLLOWING BACK = B - A
 * 2. YOU DON'T FOLLOW BACK = A - B
 * 3. MUTUAL FOLLOWERS = A ∩ B
 */
export function compareFollowLists(
  followers: InstagramUser[],
  following: InstagramUser[],
  meta: { fileName: string; fileSize: number }
): AnalysisResult {
  // Deduplicate and build fast lookup sets using normalized usernames
  const followerMap = new Map<string, InstagramUser>();
  followers.forEach(user => {
    followerMap.set(user.normalizedUsername, user);
  });

  const followingMap = new Map<string, InstagramUser>();
  following.forEach(user => {
    followingMap.set(user.normalizedUsername, user);
  });

  const followerSet = new Set(followerMap.keys());
  const followingSet = new Set(followingMap.keys());

  // Comparison 1: NOT FOLLOWING BACK = B - A
  // Accounts user follows that do not follow back
  const notFollowingBack: InstagramUser[] = [];
  for (const [normUser, user] of followingMap.entries()) {
    if (!followerSet.has(normUser)) {
      notFollowingBack.push(user);
    }
  }

  // Comparison 2: YOU DON'T FOLLOW BACK = A - B
  // Accounts following user that user doesn't follow back
  const youDontFollowBack: InstagramUser[] = [];
  for (const [normUser, user] of followerMap.entries()) {
    if (!followingSet.has(normUser)) {
      youDontFollowBack.push(user);
    }
  }

  // Comparison 3: MUTUAL FOLLOWERS = A ∩ B
  // Accounts that follow each other
  const mutualFollowers: InstagramUser[] = [];
  for (const [normUser, user] of followingMap.entries()) {
    if (followerSet.has(normUser)) {
      mutualFollowers.push(user);
    }
  }

  const totalFollowers = followerMap.size;
  const totalFollowing = followingMap.size;
  const nonFollowersCount = notFollowingBack.length;
  const youDontFollowBackCount = youDontFollowBack.length;
  const mutualFollowersCount = mutualFollowers.length;

  // Percentage calculation: (non-followers / total following) * 100
  const nonFollowersPercentage = totalFollowing > 0
    ? Math.round((nonFollowersCount / totalFollowing) * 1000) / 10
    : 0;

  // Verify mathematical invariants
  // Total Following = Mutual Followers + Don't Follow You Back
  // Total Followers = Mutual Followers + You Don't Follow Back
  console.assert(
    totalFollowing === mutualFollowersCount + nonFollowersCount,
    `Invariant violated: totalFollowing (${totalFollowing}) !== mutual (${mutualFollowersCount}) + nonFollowers (${nonFollowersCount})`
  );
  console.assert(
    totalFollowers === mutualFollowersCount + youDontFollowBackCount,
    `Invariant violated: totalFollowers (${totalFollowers}) !== mutual (${mutualFollowersCount}) + youDontFollowBack (${youDontFollowBackCount})`
  );

  return {
    totalFollowers,
    totalFollowing,
    notFollowingBack,
    youDontFollowBack,
    mutualFollowers,
    nonFollowersCount,
    youDontFollowBackCount,
    mutualFollowersCount,
    nonFollowersPercentage,
    analysisTimestamp: new Date().toLocaleString(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short'
    }),
    fileName: meta.fileName,
    fileSize: meta.fileSize
  };
}
