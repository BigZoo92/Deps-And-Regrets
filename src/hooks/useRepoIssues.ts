import { RepoIssueLite } from "@/shared/types/github";
import { useQuery } from "@tanstack/react-query";

async function fetchRepoIssues(owner: string, repo: string): Promise<RepoIssueLite[]> {
  const res = await fetch(`/api/github/repo/${owner}/${repo}/issues`);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export function useRepoIssues(owner?: string, repo?: string) {
  return useQuery({
    queryKey: ["github", "repo", owner, repo, "issues"],
    queryFn: () => fetchRepoIssues(owner!, repo!),
    enabled: Boolean(owner && repo),
    staleTime: 10 * 60 * 1000,
  });
}
