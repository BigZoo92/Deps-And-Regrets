import { RepoBranch } from "@/shared/types/github";
import { useQuery } from "@tanstack/react-query";

async function fetchRepoBranches(owner: string, repo: string): Promise<RepoBranch[]> {
  const res = await fetch(`/api/github/repo/${owner}/${repo}/branches`);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export function useRepoBranches(owner?: string, repo?: string) {
  return useQuery({
    queryKey: ["github", "repo", owner, repo, "branches"],
    queryFn: () => fetchRepoBranches(owner!, repo!),
    enabled: Boolean(owner && repo),
    staleTime: 10 * 60 * 1000,
  });
}
