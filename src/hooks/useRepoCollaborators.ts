import { RepoCollaboratorLite } from "@/shared/types/github";
import { useQuery } from "@tanstack/react-query";

async function fetchRepoCollaborators(
  owner: string,
  repo: string,
): Promise<RepoCollaboratorLite[]> {
  const res = await fetch(`/api/github/repo/${owner}/${repo}/collaborators`);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export function useRepoCollaborators(owner?: string, repo?: string) {
  return useQuery({
    queryKey: ["github", "repo", owner, repo, "collaborators"],
    queryFn: () => fetchRepoCollaborators(owner!, repo!),
    enabled: Boolean(owner && repo),
    staleTime: 10 * 60 * 1000,
  });
}
