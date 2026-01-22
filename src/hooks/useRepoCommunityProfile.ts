import { RepoCommunityProfile } from "@/shared/types/github";
import { useQuery } from "@tanstack/react-query";

async function fetchRepoCommunityProfile(
  owner: string,
  repo: string,
): Promise<RepoCommunityProfile> {
  const res = await fetch(`/api/github/repo/${owner}/${repo}/community-profile`);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export function useRepoCommunityProfile(owner?: string, repo?: string) {
  return useQuery({
    queryKey: ["github", "repo", owner, repo, "community-profile"],
    queryFn: () => fetchRepoCommunityProfile(owner!, repo!),
    enabled: Boolean(owner && repo),
    staleTime: 10 * 60 * 1000,
  });
}
