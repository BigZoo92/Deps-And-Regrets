import { RepoLanguages } from "@/shared/types/github";
import { useQuery } from "@tanstack/react-query";

async function fetchRepoLanguages(owner: string, repo: string): Promise<RepoLanguages> {
  const res = await fetch(`/api/github/repo/${owner}/${repo}/languages`);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export function useRepoLanguages(owner?: string, repo?: string) {
  return useQuery({
    queryKey: ["github", "repo", owner, repo, "languages"],
    queryFn: () => fetchRepoLanguages(owner!, repo!),
    enabled: Boolean(owner && repo),
    staleTime: 10 * 60 * 1000,
  });
}
