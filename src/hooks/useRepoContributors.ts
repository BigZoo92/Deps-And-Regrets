import { RepoContributorLite } from "@/shared/types/github";
import { useQuery } from "@tanstack/react-query";

async function fetchRepoContributors(owner: string, repo: string): Promise<RepoContributorLite[]> {
  const res = await fetch(`/api/github/repo/${owner}/${repo}/contributors`);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export function useRepoContributors(owner?: string, repo?: string) {
  return useQuery({
    queryKey: ["github", "repo", owner, repo, "contributors"],
    queryFn: () => fetchRepoContributors(owner!, repo!),
    enabled: Boolean(owner && repo),
    staleTime: 10 * 60 * 1000,
  });
}
