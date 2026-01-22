// src/server/github/adapters/mappers.ts

import type {
  BackendGithubUserLite,
  GithubUserLite,
  BackendLabelLite,
  LabelLite,
  BackendRepo,
  Repo,
  BackendRepoCommit,
  RepoCommit,
  BackendRepoBranch,
  RepoBranch,
  BackendRepoReleaseLite,
  RepoReleaseLite,
  BackendRepoReleaseAssetLite,
  RepoReleaseAssetLite,
  BackendRepoPullLite,
  RepoPullLite,
  BackendRepoIssueLite,
  RepoIssueLite,
  BackendRepoContributorLite,
  RepoContributorLite,
  BackendRepoCollaboratorLite,
  RepoCollaboratorLite,
  BackendRepoTrafficViews,
  RepoTrafficViews,
  BackendRepoTrafficClones,
  RepoTrafficClones,
  BackendRepoTrafficReferrer,
  RepoTrafficReferrer,
  BackendRepoTrafficPath,
  RepoTrafficPath,
  BackendRepoStatsCommitActivityWeek,
  RepoStatsCommitActivityWeek,
  BackendRepoStatsContributor,
  RepoStatsContributor,
  BackendRepoStatsContributorWeek,
  RepoStatsContributorWeek,
  BackendRepoCommunityProfile,
  RepoCommunityProfile,
  BackendRepoCommunityFileLink,
  RepoCommunityFileLink,
  BackendRepoCommunityCodeOfConduct,
  RepoCommunityCodeOfConduct,
  BackendRepoCommunityLicense,
  RepoCommunityLicense,
} from "@/shared/types/github.ts";

export function toGithubUserLite(u: BackendGithubUserLite): GithubUserLite {
  return {
    login: u.login,
    id: u.id,
    avatarUrl: u.avatar_url,
    htmlUrl: u.html_url,
    type: u.type,
  };
}

export function toLabelLite(l: BackendLabelLite): LabelLite {
  return {
    id: l.id,
    name: l.name,
    color: l.color,
    description: l.description,
  };
}

export function toRepo(r: BackendRepo): Repo {
  return {
    id: r.id,
    name: r.name,
    fullName: r.full_name,
    private: r.private,
    fork: r.fork,
    archived: r.archived,
    disabled: r.disabled,

    htmlUrl: r.html_url,
    description: r.description,

    defaultBranch: r.default_branch,

    stars: r.stargazers_count,
    watchers: r.watchers_count,
    forks: r.forks_count,
    openIssues: r.open_issues_count,

    primaryLanguage: r.language,

    createdAt: r.created_at,
    updatedAt: r.updated_at,
    pushedAt: r.pushed_at,

    owner: toGithubUserLite(r.owner),
    topics: r.topics ?? [],
  };
}

export function toRepoCommit(c: BackendRepoCommit): RepoCommit {
  return {
    sha: c.sha,
    htmlUrl: c.html_url,
    message: c.commit.message,
    authoredAt: c.commit.author?.date ?? null,
    committedAt: c.commit.committer?.date ?? null,
    author: c.author ? toGithubUserLite(c.author) : null,
    committer: c.committer ? toGithubUserLite(c.committer) : null,
  };
}

export function toRepoBranch(b: BackendRepoBranch): RepoBranch {
  return {
    name: b.name,
    protected: b.protected,
    headSha: b.commit.sha,
  };
}

export function toRepoReleaseAssetLite(a: BackendRepoReleaseAssetLite): RepoReleaseAssetLite {
  return {
    id: a.id,
    name: a.name,
    size: a.size,
    downloadCount: a.download_count,
    browserDownloadUrl: a.browser_download_url,
    createdAt: a.created_at,
    updatedAt: a.updated_at,
  };
}

export function toRepoReleaseLite(r: BackendRepoReleaseLite): RepoReleaseLite {
  return {
    id: r.id,
    htmlUrl: r.html_url,
    tagName: r.tag_name,
    targetCommitish: r.target_commitish,
    name: r.name,
    draft: r.draft,
    prerelease: r.prerelease,
    createdAt: r.created_at,
    publishedAt: r.published_at,
    author: toGithubUserLite(r.author),
    assets: r.assets.map(toRepoReleaseAssetLite),
  };
}

export function toRepoPullLite(p: BackendRepoPullLite): RepoPullLite {
  return {
    id: p.id,
    number: p.number,
    state: p.state,
    locked: p.locked,
    title: p.title,
    htmlUrl: p.html_url,

    user: toGithubUserLite(p.user),

    createdAt: p.created_at,
    updatedAt: p.updated_at,
    closedAt: p.closed_at,
    mergedAt: p.merged_at,

    comments: p.comments,
    reviewComments: p.review_comments,
    commits: p.commits,
    additions: p.additions,
    deletions: p.deletions,
    changedFiles: p.changed_files,

    baseRef: p.base.ref,
    baseSha: p.base.sha,
    headRef: p.head.ref,
    headSha: p.head.sha,
  };
}

export function toRepoIssueLite(i: BackendRepoIssueLite): RepoIssueLite {
  return {
    id: i.id,
    number: i.number,
    state: i.state,
    locked: i.locked,
    title: i.title,
    htmlUrl: i.html_url,

    user: toGithubUserLite(i.user),

    createdAt: i.created_at,
    updatedAt: i.updated_at,
    closedAt: i.closed_at,

    comments: i.comments,

    labels: i.labels.map(toLabelLite),

    isPullRequest: "pull_request" in i && i.pull_request != null,
  };
}

export function toRepoContributorLite(u: BackendRepoContributorLite): RepoContributorLite {
  return {
    ...toGithubUserLite(u),
    contributions: u.contributions,
  };
}

export function toRepoCollaboratorLite(u: BackendRepoCollaboratorLite): RepoCollaboratorLite {
  return toGithubUserLite(u);
}

export function toRepoTrafficViews(t: BackendRepoTrafficViews): RepoTrafficViews {
  return {
    count: t.count,
    uniques: t.uniques,
    views: t.views.map((p) => ({
      timestamp: p.timestamp,
      count: p.count,
      uniques: p.uniques,
    })),
  };
}

export function toRepoTrafficClones(t: BackendRepoTrafficClones): RepoTrafficClones {
  return {
    count: t.count,
    uniques: t.uniques,
    clones: t.clones.map((p) => ({
      timestamp: p.timestamp,
      count: p.count,
      uniques: p.uniques,
    })),
  };
}

export function toRepoTrafficReferrer(r: BackendRepoTrafficReferrer): RepoTrafficReferrer {
  return { referrer: r.referrer, count: r.count, uniques: r.uniques };
}

export function toRepoTrafficPath(p: BackendRepoTrafficPath): RepoTrafficPath {
  return { path: p.path, title: p.title, count: p.count, uniques: p.uniques };
}

export function toRepoStatsCommitActivityWeek(
  w: BackendRepoStatsCommitActivityWeek,
): RepoStatsCommitActivityWeek {
  return { days: w.days, total: w.total, week: w.week };
}

export function toRepoStatsContributorWeek(
  w: BackendRepoStatsContributorWeek,
): RepoStatsContributorWeek {
  return {
    week: w.w,
    additions: w.a,
    deletions: w.d,
    commits: w.c,
  };
}

export function toRepoStatsContributor(c: BackendRepoStatsContributor): RepoStatsContributor {
  return {
    total: c.total,
    weeks: c.weeks.map(toRepoStatsContributorWeek),
    author: toGithubUserLite(c.author),
  };
}

export function toRepoCommunityFileLink(l: BackendRepoCommunityFileLink): RepoCommunityFileLink {
  return { url: l.url, htmlUrl: l.html_url };
}

export function toRepoCommunityCodeOfConduct(
  c: BackendRepoCommunityCodeOfConduct,
): RepoCommunityCodeOfConduct {
  return { name: c.name, key: c.key, url: c.url, htmlUrl: c.html_url };
}

export function toRepoCommunityLicense(l: BackendRepoCommunityLicense): RepoCommunityLicense {
  return {
    name: l.name,
    key: l.key,
    spdxId: l.spdx_id,
    url: l.url,
    htmlUrl: l.html_url,
  };
}

export function toRepoCommunityProfile(p: BackendRepoCommunityProfile): RepoCommunityProfile {
  return {
    healthPercentage: p.health_percentage,
    description: p.description,
    documentation: p.documentation,
    files: {
      codeOfConduct: p.files.code_of_conduct
        ? toRepoCommunityCodeOfConduct(p.files.code_of_conduct)
        : null,
      codeOfConductFile: p.files.code_of_conduct_file
        ? toRepoCommunityFileLink(p.files.code_of_conduct_file)
        : null,
      contributing: p.files.contributing ? toRepoCommunityFileLink(p.files.contributing) : null,
      issueTemplate: p.files.issue_template
        ? toRepoCommunityFileLink(p.files.issue_template)
        : null,
      pullRequestTemplate: p.files.pull_request_template
        ? toRepoCommunityFileLink(p.files.pull_request_template)
        : null,
      license: p.files.license ? toRepoCommunityLicense(p.files.license) : null,
      readme: p.files.readme ? toRepoCommunityFileLink(p.files.readme) : null,
    },
    updatedAt: p.updated_at,
    contentReportsEnabled: p.content_reports_enabled,
  };
}
