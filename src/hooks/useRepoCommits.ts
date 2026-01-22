import { RepoCommit } from "@/shared/types/github";
import { useQuery } from "@tanstack/react-query";

async function fetchRepoCommits(owner: string, repo: string): Promise<RepoCommit[]> {
  const res = await fetch(`/api/github/repo/${owner}/${repo}/commits`);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export function useRepoCommits(owner?: string, repo?: string) {
  return useQuery({
    queryKey: ["github", "repo", owner, repo, "commits"],
    queryFn: () => fetchRepoCommits(owner!, repo!),
    enabled: Boolean(owner && repo),
    staleTime: 10 * 60 * 1000,
  });
}
