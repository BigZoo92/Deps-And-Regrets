import { RepoTrafficPath } from "@/shared/types/github";
import { useQuery } from "@tanstack/react-query";

async function fetchRepoTrafficPopularPaths(
  owner: string,
  repo: string,
): Promise<RepoTrafficPath[]> {
  const res = await fetch(`/api/github/repo/${owner}/${repo}/traffic/popular/paths`);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export function useRepoTrafficPopularPaths(owner?: string, repo?: string) {
  return useQuery({
    queryKey: ["github", "repo", owner, repo, "traffic", "popular", "paths"],
    queryFn: () => fetchRepoTrafficPopularPaths(owner!, repo!),
    enabled: Boolean(owner && repo),
    staleTime: 10 * 60 * 1000,
  });
}
