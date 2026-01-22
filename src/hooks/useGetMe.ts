import { GithubUser } from "@/shared/types/github";
import { useQuery } from "@tanstack/react-query";

async function fetchMe(): Promise<GithubUser> {
  const res = await fetch(`/api/github/get-me`);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export function useGetMe() {
  return useQuery({
    queryKey: [],
    queryFn: () => fetchMe(),
    staleTime: 10 * 60 * 1000,
  });
}
