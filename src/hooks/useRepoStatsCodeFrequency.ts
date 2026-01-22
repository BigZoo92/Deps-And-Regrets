import { RepoStatsCodeFrequencyPoint } from "@/shared/types/github";
import { useQuery } from "@tanstack/react-query";

async function fetchRepoStatsCodeFrequency(
  owner: string,
  repo: string,
): Promise<RepoStatsCodeFrequencyPoint[]> {
  const res = await fetch(`/api/github/repo/${owner}/${repo}/stats/code-frequency`);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export function useRepoStatsCodeFrequency(owner?: string, repo?: string) {
  return useQuery({
    queryKey: ["github", "repo", owner, repo, "stats", "code-frequency"],
    queryFn: () => fetchRepoStatsCodeFrequency(owner!, repo!),
    enabled: Boolean(owner && repo),
    staleTime: 10 * 60 * 1000,
  });
}
