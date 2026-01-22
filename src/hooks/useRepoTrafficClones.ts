import { RepoTrafficClones } from "@/shared/types/github";
import { useQuery } from "@tanstack/react-query";

async function fetchRepoTrafficClones(owner: string, repo: string): Promise<RepoTrafficClones> {
  const res = await fetch(`/api/github/repo/${owner}/${repo}/traffic/clones`);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export function useRepoTrafficClones(owner?: string, repo?: string) {
  return useQuery({
    queryKey: ["github", "repo", owner, repo, "traffic", "clones"],
    queryFn: () => fetchRepoTrafficClones(owner!, repo!),
    enabled: Boolean(owner && repo),
    staleTime: 10 * 60 * 1000,
  });
}
