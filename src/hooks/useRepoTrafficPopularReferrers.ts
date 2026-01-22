import { RepoTrafficReferrer } from "@/shared/types/github";
import { useQuery } from "@tanstack/react-query";

async function fetchRepoTrafficPopularReferrers(
  owner: string,
  repo: string,
): Promise<RepoTrafficReferrer[]> {
  const res = await fetch(`/api/github/repo/${owner}/${repo}/traffic/popular/referrers`);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export function useRepoTrafficPopularReferrers(owner?: string, repo?: string) {
  return useQuery({
    queryKey: ["github", "repo", owner, repo, "traffic", "popular", "referrers"],
    queryFn: () => fetchRepoTrafficPopularReferrers(owner!, repo!),
    enabled: Boolean(owner && repo),
    staleTime: 10 * 60 * 1000,
  });
}
