import { RepoStatsContributor } from "@/shared/types/github";
import { useQuery } from "@tanstack/react-query";

async function fetchRepoStatsContributors(
  owner: string,
  repo: string,
): Promise<RepoStatsContributor[]> {
  const res = await fetch(`/api/github/repo/${owner}/${repo}/stats/contributors`);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export function useRepoStatsContributors(owner?: string, repo?: string) {
  return useQuery({
    queryKey: ["github", "repo", owner, repo, "stats", "contributors"],
    queryFn: () => fetchRepoStatsContributors(owner!, repo!),
    enabled: Boolean(owner && repo),
    staleTime: 10 * 60 * 1000,
  });
}
