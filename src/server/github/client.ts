const GH_API = "https://api.github.com";

export async function   githubFetch<T>(path: string): Promise<T> {
  const token = process.env.GITHUB_TOKEN;
  if (!token) throw new Error("Missing GITHUB_TOKEN");

  const res = await fetch(`${GH_API}${path}`, {
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${token}`,
      "X-GitHub-Api-Version": "2022-11-28",
      "content-type": "text/plain",
      "User-Agent": "depsandregrets",
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GitHub ${res.status} ${res.statusText}: ${text}`);
  }

  return (await res.json()) as T;
}
