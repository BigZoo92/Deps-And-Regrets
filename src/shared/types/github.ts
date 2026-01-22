export interface RepoSummary {
  fullName: string;
  name: string;
  owner: string;
  url: string;

  visibility: "public" | "private" | string;
  isPrivate: boolean;
  isFork: boolean;
  isArchived: boolean;
  isDisabled: boolean;

  defaultBranch: string;

  primaryLanguage: string | null;
  topics: string[];

  stars: number;
  forks: number;
  watchers: number;
  openIssues: number;

  createdAt: string;
  updatedAt: string;
  pushedAt: string;
}

export interface BackendGithubUser {
  avatar_url: string;
  location: string;
  login: string;
  public_repo: string;
  url: string;
  followers: number;
  following: number;
  created_at: string;
  bio: string;
  id: number;
}

export interface GithubUser {
  avatarUrl: string;
  location: string;
  login: string;
  publicRepo: string;
  url: string;
  followers: number;
  following: number;
  createdAt: string;
  bio: string;
  id: number;
}

export type IsoDateString = string;

export type BackendGithubUserLite = {
  login: string;
  id: number;
  avatar_url: string;
  html_url: string;
  type?: string;
};

export type GithubUserLite = {
  login: string;
  id: number;
  avatarUrl: string;
  htmlUrl: string;
  type?: string;
};

export type BackendLabelLite = {
  id: number;
  name: string;
  color: string;
  description: string | null;
};

export type LabelLite = {
  id: number;
  name: string;
  color: string;
  description: string | null;
};

export type BackendRepo = {
  id: number;
  name: string;
  full_name: string;
  private: boolean;
  fork: boolean;
  archived: boolean;
  disabled: boolean;

  html_url: string;
  description: string | null;

  default_branch: string;

  stargazers_count: number;
  watchers_count: number;
  forks_count: number;
  open_issues_count: number;

  language: string | null;

  created_at: IsoDateString;
  updated_at: IsoDateString;
  pushed_at: IsoDateString | null;

  owner: BackendGithubUserLite;
  topics?: string[];
};

export type Repo = {
  id: number;
  name: string;
  fullName: string;
  private: boolean;
  fork: boolean;
  archived: boolean;
  disabled: boolean;

  htmlUrl: string;
  description: string | null;

  defaultBranch: string;

  stars: number;
  watchers: number;
  forks: number;
  openIssues: number;

  primaryLanguage: string | null;

  createdAt: IsoDateString;
  updatedAt: IsoDateString;
  pushedAt: IsoDateString | null;

  owner: GithubUserLite;
  topics: string[];
};

export type BackendRepoLanguages = Record<string, number>;
export type RepoLanguages = Record<string, number>;

export type BackendRepoContentFile = {
  type: "file";
  name: string;
  path: string;
  sha: string;
  size: number;
  url: string;
  html_url: string;
  git_url: string | null;
  download_url: string | null;
  content?: string; // base64 si tu demandes le contenu
  encoding?: "base64";
};

export type BackendRepoContentDirItem = {
  type: "file" | "dir" | "symlink" | "submodule";
  name: string;
  path: string;
  sha: string;
  size: number;
  url: string;
  html_url: string;
  git_url: string | null;
  download_url: string | null;
};

export type BackendRepoContent = BackendRepoContentFile | BackendRepoContentDirItem[];

export type RepoContentFile = {
  type: "file";
  name: string;
  path: string;
  sha: string;
  size: number;
  url: string;
  htmlUrl: string;
  gitUrl: string | null;
  downloadUrl: string | null;
  content?: string;
  encoding?: "base64";
};

export type RepoContentDirItem = {
  type: "file" | "dir" | "symlink" | "submodule";
  name: string;
  path: string;
  sha: string;
  size: number;
  url: string;
  htmlUrl: string;
  gitUrl: string | null;
  downloadUrl: string | null;
};

export type RepoContent = RepoContentFile | RepoContentDirItem[];

export type BackendRepoCommit = {
  sha: string;
  html_url: string;

  commit: {
    message: string;
    author: { name: string; email: string; date: IsoDateString } | null;
    committer: { name: string; email: string; date: IsoDateString } | null;
  };

  author: BackendGithubUserLite | null;
  committer: BackendGithubUserLite | null;
};

export type RepoCommit = {
  sha: string;
  htmlUrl: string;

  message: string;
  authoredAt: IsoDateString | null;
  committedAt: IsoDateString | null;

  author: GithubUserLite | null;
  committer: GithubUserLite | null;
};

export type BackendRepoBranch = {
  name: string;
  protected: boolean;
  commit: { sha: string; url: string };
};

export type RepoBranch = {
  name: string;
  protected: boolean;
  headSha: string;
};

export type BackendRepoReleaseAssetLite = {
  id: number;
  name: string;
  size: number;
  download_count: number;
  browser_download_url: string;
  created_at: IsoDateString;
  updated_at: IsoDateString;
};

export type BackendRepoReleaseLite = {
  id: number;
  html_url: string;
  tag_name: string;
  target_commitish: string;
  name: string | null;
  draft: boolean;
  prerelease: boolean;
  created_at: IsoDateString;
  published_at: IsoDateString | null;
  author: BackendGithubUserLite;
  assets: BackendRepoReleaseAssetLite[];
};

export type RepoReleaseAssetLite = {
  id: number;
  name: string;
  size: number;
  downloadCount: number;
  browserDownloadUrl: string;
  createdAt: IsoDateString;
  updatedAt: IsoDateString;
};

export type RepoReleaseLite = {
  id: number;
  htmlUrl: string;
  tagName: string;
  targetCommitish: string;
  name: string | null;
  draft: boolean;
  prerelease: boolean;
  createdAt: IsoDateString;
  publishedAt: IsoDateString | null;
  author: GithubUserLite;
  assets: RepoReleaseAssetLite[];
};

export type BackendRepoPullLite = {
  id: number;
  number: number;
  state: "open" | "closed";
  locked: boolean;
  title: string;
  html_url: string;

  user: BackendGithubUserLite;

  created_at: IsoDateString;
  updated_at: IsoDateString;
  closed_at: IsoDateString | null;
  merged_at: IsoDateString | null;

  comments: number;
  review_comments: number;
  commits: number;
  additions: number;
  deletions: number;
  changed_files: number;

  base: { ref: string; sha: string };
  head: { ref: string; sha: string };
};

export type RepoPullLite = {
  id: number;
  number: number;
  state: "open" | "closed";
  locked: boolean;
  title: string;
  htmlUrl: string;

  user: GithubUserLite;

  createdAt: IsoDateString;
  updatedAt: IsoDateString;
  closedAt: IsoDateString | null;
  mergedAt: IsoDateString | null;

  comments: number;
  reviewComments: number;
  commits: number;
  additions: number;
  deletions: number;
  changedFiles: number;

  baseRef: string;
  baseSha: string;
  headRef: string;
  headSha: string;
};

export type BackendRepoIssueLite = {
  id: number;
  number: number;
  state: "open" | "closed";
  locked: boolean;
  title: string;
  html_url: string;

  user: BackendGithubUserLite;

  created_at: IsoDateString;
  updated_at: IsoDateString;
  closed_at: IsoDateString | null;

  comments: number;

  labels: BackendLabelLite[];

  pull_request?: unknown;
};

export type RepoIssueLite = {
  id: number;
  number: number;
  state: "open" | "closed";
  locked: boolean;
  title: string;
  htmlUrl: string;

  user: GithubUserLite;

  createdAt: IsoDateString;
  updatedAt: IsoDateString;
  closedAt: IsoDateString | null;

  comments: number;

  labels: LabelLite[];

  isPullRequest: boolean;
};

export type BackendRepoContributorLite = BackendGithubUserLite & {
  contributions: number;
};

export type RepoContributorLite = GithubUserLite & {
  contributions: number;
};

export type BackendRepoCollaboratorLite = BackendGithubUserLite;

export type RepoCollaboratorLite = GithubUserLite;

export type BackendTrafficPoint = {
  timestamp: IsoDateString;
  count: number;
  uniques: number;
};

export type TrafficPoint = {
  timestamp: IsoDateString;
  count: number;
  uniques: number;
};

export type BackendRepoTrafficViews = {
  count: number;
  uniques: number;
  views: BackendTrafficPoint[];
};

export type RepoTrafficViews = {
  count: number;
  uniques: number;
  views: TrafficPoint[];
};

export type BackendRepoTrafficClones = {
  count: number;
  uniques: number;
  clones: BackendTrafficPoint[];
};

export type RepoTrafficClones = {
  count: number;
  uniques: number;
  clones: TrafficPoint[];
};

export type BackendRepoTrafficReferrer = {
  referrer: string;
  count: number;
  uniques: number;
};

export type RepoTrafficReferrer = {
  referrer: string;
  count: number;
  uniques: number;
};

export type BackendRepoTrafficPath = {
  path: string;
  title: string;
  count: number;
  uniques: number;
};

export type RepoTrafficPath = {
  path: string;
  title: string;
  count: number;
  uniques: number;
};

export type BackendRepoStatsCommitActivityWeek = {
  days: [number, number, number, number, number, number, number];
  total: number;
  week: number;
};

export type RepoStatsCommitActivityWeek = {
  days: [number, number, number, number, number, number, number];
  total: number;
  week: number;
};

export type BackendRepoStatsCodeFrequencyPoint = [number, number, number];
export type RepoStatsCodeFrequencyPoint = [number, number, number];

export type BackendRepoStatsContributorWeek = {
  w: number;
  a: number;
  d: number;
  c: number;
};

export type BackendRepoStatsContributor = {
  total: number;
  weeks: BackendRepoStatsContributorWeek[];
  author: BackendGithubUserLite;
};

export type RepoStatsContributorWeek = {
  week: number;
  additions: number;
  deletions: number;
  commits: number;
};

export type RepoStatsContributor = {
  total: number;
  weeks: RepoStatsContributorWeek[];
  author: GithubUserLite;
};

export type BackendRepoStatsPunchCardPoint = [number, number, number];
export type RepoStatsPunchCardPoint = [number, number, number];

export type BackendRepoCommunityFileLink = {
  url: string;
  html_url: string;
};

export type BackendRepoCommunityCodeOfConduct = {
  name: string;
  key: string;
  url: string;
  html_url: string;
};

export type BackendRepoCommunityLicense = {
  name: string;
  key: string;
  spdx_id: string | null;
  url: string | null;
  html_url: string | null;
  node_id?: string;
};

export type BackendRepoCommunityProfile = {
  health_percentage: number;
  description: string | null;
  documentation: string | null;
  files: {
    code_of_conduct: BackendRepoCommunityCodeOfConduct | null;
    code_of_conduct_file: BackendRepoCommunityFileLink | null;
    contributing: BackendRepoCommunityFileLink | null;
    issue_template: BackendRepoCommunityFileLink | null;
    pull_request_template: BackendRepoCommunityFileLink | null;
    license: BackendRepoCommunityLicense | null;
    readme: BackendRepoCommunityFileLink | null;
  };
  updated_at: IsoDateString;
  content_reports_enabled?: boolean;
};

export type RepoCommunityFileLink = {
  url: string;
  htmlUrl: string;
};

export type RepoCommunityCodeOfConduct = {
  name: string;
  key: string;
  url: string;
  htmlUrl: string;
};

export type RepoCommunityLicense = {
  name: string;
  key: string;
  spdxId: string | null;
  url: string | null;
  htmlUrl: string | null;
};

export type RepoCommunityProfile = {
  healthPercentage: number;
  description: string | null;
  documentation: string | null;
  files: {
    codeOfConduct: RepoCommunityCodeOfConduct | null;
    codeOfConductFile: RepoCommunityFileLink | null;
    contributing: RepoCommunityFileLink | null;
    issueTemplate: RepoCommunityFileLink | null;
    pullRequestTemplate: RepoCommunityFileLink | null;
    license: RepoCommunityLicense | null;
    readme: RepoCommunityFileLink | null;
  };
  updatedAt: IsoDateString;
  contentReportsEnabled?: boolean;
};
