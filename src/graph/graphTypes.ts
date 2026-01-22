import { RepoStatsCodeFrequencyPoint, RepoStatsCommitActivityWeek } from "@/shared/types/github";

export type NodeKind = "me" | "repo" | "district" | "lang" | "topic" | "person" | "metric";

export type LinkKind =
  | "owns"
  | "affiliated"
  | "repo_lang"
  | "repo_topic"
  | "repo_person"
  | "repo_district"
  | "district_metric";

export type RepoScores = {
  craft: number;
  momentum: number;
  churn: number;
  collaboration: number;
  disciplineOps: number;
  impact: number;
};

export type NormalizedRepo = {
  core: {
    id: string;
    fullName: string;
    name: string;
    ownerLogin: string;
    htmlUrl: string;
    description?: string | null;
    homepage?: string | null;
    stars: number;
    forks: number;
    openIssues: number;
    primaryLanguage?: string | null;
    topics: string[];
    pushedAt?: string | null;
    updatedAt?: string | null;
    createdAt?: string | null;
    defaultBranch?: string | null;
    isPrivate: boolean;
    isFork: boolean;
    isArchived: boolean;
  };
  languages: Array<{ name: string; bytes: number; ratio: number }>;
  people: {
    contributors: Array<{ login: string; contributions: number }>;
    collaborators: Array<{ login: string }>;
    ownerLogin: string;
  };
  workSummary: {
    prsOpen?: number;
    prsMerged30d?: number;
    issuesOpen?: number;
    issuesClosed30d?: number;
    prsTotal?: number;
    issuesTotal?: number;
  };
  impactSummary: {
    views14d?: number;
    clones14d?: number;
    topReferrers?: Array<{ referrer: string; count: number }>;
    topPaths?: Array<{ path: string; count: number }>;
  };
  healthSummary: {
    communityHealthPercentage?: number;
    hasReadme?: boolean;
    hasLicense?: boolean;
    hasContributing?: boolean;
  };
  activitySummary: {
    commitsLast30d?: number;
    peakHour?: number;
    peakDay?: number;
    commitActivity?: RepoStatsCommitActivityWeek[];
    codeFrequency?: RepoStatsCodeFrequencyPoint[];
  };
  scores: RepoScores;
  rawRefs: { owner: string; repo: string };
  scoreMeta?: { disciplineOpsMissing?: boolean };
};

export type GraphNode = {
  id: string;
  kind: NodeKind;
  label: string;
  repoFullName?: string;
  meta: Record<string, unknown>;
  val?: number;
  scores?: RepoScores;
  colorHint?: string;
  isMacro?: boolean;
};

export type GraphLink = {
  id: string;
  source: string;
  target: string;
  kind: LinkKind;
  weight?: number;
  meta?: Record<string, unknown>;
};

export type GraphDataset = {
  nodes: GraphNode[];
  links: GraphLink[];
};
