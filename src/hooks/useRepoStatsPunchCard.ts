import { RepoStatsPunchCardPoint } from "@/shared/types/github";
import { useQuery } from "@tanstack/react-query";

async function fetchRepoStatsPunchCard(
  owner: string,
  repo: string,
): Promise<RepoStatsPunchCardPoint[]> {
  const res = await fetch(`/api/github/repo/${owner}/${repo}/stats/punch-card`);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export function useRepoStatsPunchCard(owner?: string, repo?: string) {
  return useQuery({
    queryKey: ["github", "repo", owner, repo, "stats", "punch-card"],
    queryFn: () => fetchRepoStatsPunchCard(owner!, repo!),
    enabled: Boolean(owner && repo),
    staleTime: 10 * 60 * 1000,
  });
}
