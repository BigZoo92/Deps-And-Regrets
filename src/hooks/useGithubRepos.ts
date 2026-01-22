import { useLiveQuery } from "@tanstack/react-db";
import { githubReposCollection } from "@/db/githubRepos.collection";

export function useGithubRepos() {
  const q = githubReposCollection;

  const { data: repos = [] } = useLiveQuery((db) => db.from({ repo: githubReposCollection }));

  return {
    repos,
    isLoading: q.status === "loading",
    isFetching: q.status === "ready",
    error: q.status === "error",
    refetch: () => githubReposCollection.utils.refetch(),
  };
}
