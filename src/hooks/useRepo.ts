import { Repo } from "@/shared/types/github";
import { useQuery } from "@tanstack/react-query";

async function fetchRepo(owner: string, repo: string): Promise<Repo> {
  const res = await fetch(`/api/github/repo/${owner}/${repo}`);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export function useRepo(owner?: string, repo?: string) {
  return useQuery({
    queryKey: ["github", "repo", owner, repo],
    queryFn: () => fetchRepo(owner!, repo!),
    enabled: Boolean(owner && repo),
    staleTime: 10 * 60 * 1000,
  });
}
