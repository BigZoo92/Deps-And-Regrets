import { RepoStatsCommitActivityWeek } from "@/shared/types/github";
import { useQuery } from "@tanstack/react-query";

async function fetchRepoStatsCommitActivity(
  owner: string,
  repo: string,
): Promise<RepoStatsCommitActivityWeek[]> {
  const res = await fetch(`/api/github/repo/${owner}/${repo}/stats/commit-activity`);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export function useRepoStatsCommitActivity(owner?: string, repo?: string) {
  return useQuery({
    queryKey: ["github", "repo", owner, repo, "stats", "commit-activity"],
    queryFn: () => fetchRepoStatsCommitActivity(owner!, repo!),
    enabled: Boolean(owner && repo),
    staleTime: 10 * 60 * 1000,
  });
}
