import { createCollection } from "@tanstack/react-db";
import { queryCollectionOptions } from "@tanstack/query-db-collection";
import { queryClient } from "@/lib/queryClient";
import { RepoSummary } from "@/shared/types/github";

async function fetchMyRepos(): Promise<RepoSummary[]> {
  const res = await fetch("/api/github/my-repos");
  if (!res.ok) throw new Error("Failed to load me");
  return res.json();
}

export const githubReposCollection = createCollection(
  queryCollectionOptions({
    id: "githubRepos",
    queryKey: ["github", "my-repos"],
    queryClient,
    queryFn: fetchMyRepos,
    getKey: (r: RepoSummary) => r.fullName,
  }),
);
