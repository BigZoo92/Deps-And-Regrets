import { RepoContent } from "@/shared/types/github";
import { useQuery } from "@tanstack/react-query";

async function fetchRepoContent(owner: string, repo: string, path: string): Promise<RepoContent> {
  const res = await fetch(
    `/api/github/repo/${owner}/${repo}/content?path=${encodeURIComponent(path)}`,
  );
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export function useRepoContent(owner?: string, repo?: string, path?: string) {
  return useQuery({
    queryKey: ["github", "repo", owner, repo, "content", path],
    queryFn: () => fetchRepoContent(owner!, repo!, path!),
    enabled: Boolean(owner && repo && path),
    staleTime: 10 * 60 * 1000,
  });
}
