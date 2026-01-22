import { RepoTrafficViews } from "@/shared/types/github";
import { useQuery } from "@tanstack/react-query";

async function fetchRepoTrafficViews(owner: string, repo: string): Promise<RepoTrafficViews> {
  const res = await fetch(`/api/github/repo/${owner}/${repo}/traffic/views`);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export function useRepoTrafficViews(owner?: string, repo?: string) {
  return useQuery({
    queryKey: ["github", "repo", owner, repo, "traffic", "views"],
    queryFn: () => fetchRepoTrafficViews(owner!, repo!),
    enabled: Boolean(owner && repo),
    staleTime: 10 * 60 * 1000,
  });
}
