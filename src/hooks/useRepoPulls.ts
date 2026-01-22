import { RepoPullLite } from "@/shared/types/github";
import { useQuery } from "@tanstack/react-query";

async function fetchRepoPulls(owner: string, repo: string): Promise<RepoPullLite[]> {
  const res = await fetch(`/api/github/repo/${owner}/${repo}/pulls`);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export function useRepoPulls(owner?: string, repo?: string) {
  return useQuery({
    queryKey: ["github", "repo", owner, repo, "pulls"],
    queryFn: () => fetchRepoPulls(owner!, repo!),
    enabled: Boolean(owner && repo),
    staleTime: 10 * 60 * 1000,
  });
}
