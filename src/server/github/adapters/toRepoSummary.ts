import { RepoSummary } from "@/shared/types/github";

export function toRepoSummary(r: any): RepoSummary {
  return {
    fullName: r.full_name,
    name: r.name,
    owner: r.owner?.login,
    url: r.html_url,

    visibility: r.visibility,
    isPrivate: !!r.private,
    isFork: !!r.fork,
    isArchived: !!r.archived,
    isDisabled: !!r.disabled,

    defaultBranch: r.default_branch,

    primaryLanguage: r.language ?? null,
    topics: Array.isArray(r.topics) ? r.topics : [],

    stars: r.stargazers_count ?? 0,
    forks: r.forks_count ?? 0,
    watchers: r.watchers_count ?? 0,
    openIssues: r.open_issues_count ?? 0,

    createdAt: r.created_at,
    updatedAt: r.updated_at,
    pushedAt: r.pushed_at,
  };
}
