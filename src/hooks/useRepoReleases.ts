import { RepoReleaseLite } from "@/shared/types/github";
import { useQuery } from "@tanstack/react-query";

async function fetchRepoReleases(owner: string, repo: string): Promise<RepoReleaseLite[]> {
  const res = await fetch(`/api/github/repo/${owner}/${repo}/releases`);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export function useRepoReleases(owner?: string, repo?: string) {
  return useQuery({
    queryKey: ["github", "repo", owner, repo, "releases"],
    queryFn: () => fetchRepoReleases(owner!, repo!),
    enabled: Boolean(owner && repo),
    staleTime: 10 * 60 * 1000,
  });
}
