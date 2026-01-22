import {
  Repo,
  RepoCollaboratorLite,
  RepoCommit,
  RepoCommunityProfile,
  RepoContributorLite,
  RepoContent,
  RepoIssueLite,
  RepoLanguages,
  RepoReleaseLite,
  RepoPullLite,
  RepoBranch,
  RepoStatsCodeFrequencyPoint,
  RepoStatsCommitActivityWeek,
  RepoStatsContributor,
  RepoStatsPunchCardPoint,
  RepoSummary,
  RepoTrafficClones,
  RepoTrafficPath,
  RepoTrafficReferrer,
  RepoTrafficViews,
} from "@/shared/types/github";
import { GraphDataset, GraphLink, GraphNode, NormalizedRepo, RepoScores } from "./graphTypes";

export const MAX_REPOS = 30;
export const TOP_LANGS = 6;
export const TOP_CONTRIBUTORS = 8;
export const TOP_TOPICS = 8;
export const TOP_TRAFFIC_REFERRERS = 5;
export const TOP_TRAFFIC_PATHS = 5;
export const DAYS_WORK_WINDOW = 30;

export const clamp01 = (n: number) => Math.min(1, Math.max(0, n));

export const safeDiv = (a: number, b: number) => {
  if (!Number.isFinite(a) || !Number.isFinite(b) || b === 0) return 0;
  return a / b;
};

export const daysSince = (isoDate?: string | null) => {
  if (!isoDate) return undefined;
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return undefined;
  const diffMs = Date.now() - date.getTime();
  if (diffMs < 0) return 0;
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
};

export const normalizeLog = (value: number, maxGuess = 1) => {
  if (!Number.isFinite(value) || value <= 0) return 0;
  const max = Math.max(maxGuess, value, 1);
  return clamp01(Math.log1p(value) / Math.log1p(max));
};

export const uniqBy = <T>(list: T[], keyFn: (item: T) => string) => {
  const seen = new Set<string>();
  return list.filter((item) => {
    const key = keyFn(item);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

export const idMe = (login: string) => `me:${login}`;
export const idRepo = (fullName: string) => `repo:${fullName}`;
export const idLang = (lang: string) => `lang:${lang}`;
export const idTopic = (topic: string) => `topic:${topic}`;
export const idPerson = (login: string) => `person:${login}`;
export const idDistrict = (fullName: string, districtKind: string) => `district:${fullName}:${districtKind}`;
export const idLink = (kind: string, a: string, b: string) => `${kind}:${a}->${b}`;

export type FocusedRepoData = {
  repoLanguages?: RepoLanguages;
  repoDetails?: Repo;
  repoCommits?: RepoCommit[];
  repoBranches?: RepoBranch[];
  repoReleases?: RepoReleaseLite[];
  repoPulls?: RepoPullLite[];
  repoIssues?: RepoIssueLite[];
  repoContributors?: RepoContributorLite[];
  repoCollaborators?: RepoCollaboratorLite[];
  repoContent?: RepoContent;
  repoTrafficViews?: RepoTrafficViews;
  repoTrafficClones?: RepoTrafficClones;
  repoTrafficReferrers?: RepoTrafficReferrer[];
  repoTrafficPaths?: RepoTrafficPath[];
  repoStatsCommitActivity?: RepoStatsCommitActivityWeek[];
  repoStatsCodeFrequency?: RepoStatsCodeFrequencyPoint[];
  repoStatsContributors?: RepoStatsContributor[];
  repoStatsPunchCard?: RepoStatsPunchCardPoint[];
  repoCommunityProfile?: RepoCommunityProfile;
};

export const computeScores = (repo: NormalizedRepo): RepoScores => {
  const health = repo.healthSummary;
  let craft = (health.communityHealthPercentage ?? 0) / 100;
  craft += health.hasReadme ? 0.1 : 0;
  craft += health.hasLicense ? 0.05 : 0;
  craft += health.hasContributing ? 0.05 : 0;
  craft = clamp01(craft);

  const recencyDays = daysSince(repo.core.pushedAt);
  const recencyMomentum =
    recencyDays === undefined ? 0 : clamp01(1 - clamp01(Math.min(recencyDays, 90) / 90));
  let momentum = clamp01(recencyMomentum + normalizeLog(repo.activitySummary.commitsLast30d ?? 0, 50) * 0.3);

  let churn = 0.2;
  const frequency = repo.activitySummary.codeFrequency;
  if (frequency && frequency.length > 0) {
    const recent = frequency.slice(-12);
    const averageWeeklyDelta =
      recent.reduce((sum, [, additions, deletions]) => sum + Math.abs(additions) + Math.abs(deletions), 0) /
      recent.length;
    churn = clamp01(normalizeLog(averageWeeklyDelta, 5000));
  }

  const contributorsCount = repo.people.contributors.length;
  const collaboratorsCount = repo.people.collaborators.length;
  let collaboration = normalizeLog(contributorsCount, 20);
  collaboration = clamp01(collaboration + normalizeLog(collaboratorsCount, 10) * 0.3);

  const disciplineOpsMissing = repo.scoreMeta?.disciplineOpsMissing ?? true;
  const disciplineOps = disciplineOpsMissing ? 0.5 : 0.5;

  const impact = clamp01(
    normalizeLog(repo.core.stars, 200) * 0.6 +
      normalizeLog(repo.core.forks, 100) * 0.2 +
      normalizeLog(repo.impactSummary.views14d ?? 0, 500) * 0.2,
  );

  return { craft, momentum, churn, collaboration, disciplineOps, impact };
};

export const normalizeRepoSummary = (repos: RepoSummary[], meLogin: string | undefined): NormalizedRepo[] => {
  const me = meLogin ?? "";
  return repos.map((repo) => {
    const languages =
      repo.primaryLanguage && repo.primaryLanguage.length > 0
        ? [{ name: repo.primaryLanguage, bytes: 1, ratio: 1 }]
        : [];

    const normalized: NormalizedRepo = {
      core: {
        id: repo.fullName,
        fullName: repo.fullName,
        name: repo.name,
        ownerLogin: repo.owner,
        htmlUrl: repo.url,
        stars: repo.stars,
        forks: repo.forks,
        openIssues: repo.openIssues,
        primaryLanguage: repo.primaryLanguage,
        topics: repo.topics ?? [],
        pushedAt: repo.pushedAt,
        updatedAt: repo.updatedAt,
        createdAt: repo.createdAt,
        defaultBranch: repo.defaultBranch,
        isPrivate: repo.isPrivate,
        isFork: repo.isFork,
        isArchived: repo.isArchived,
        description: undefined,
        homepage: undefined,
      },
      languages,
      people: {
        contributors: [],
        collaborators: [],
        ownerLogin: repo.owner ?? me,
      },
      workSummary: {
        prsOpen: undefined,
        prsMerged30d: undefined,
        issuesOpen: repo.openIssues,
        issuesClosed30d: undefined,
        prsTotal: undefined,
        issuesTotal: repo.openIssues,
      },
      impactSummary: {},
      healthSummary: {},
      activitySummary: {},
      scores: {
        craft: 0,
        momentum: 0,
        churn: 0,
        collaboration: 0,
        disciplineOps: 0.5,
        impact: 0,
      },
      rawRefs: {
        owner: repo.owner,
        repo: repo.name,
      },
      scoreMeta: { disciplineOpsMissing: true },
    };

    normalized.scores = computeScores(normalized);
    return normalized;
  });
};

export const enrichFocusedRepo = (base: NormalizedRepo, focusData: FocusedRepoData): NormalizedRepo => {
  const normalized: NormalizedRepo = {
    ...base,
    core: { ...base.core },
    languages: [...base.languages],
    people: {
      ownerLogin: base.people.ownerLogin,
      contributors: [...base.people.contributors],
      collaborators: [...base.people.collaborators],
    },
    workSummary: { ...base.workSummary },
    impactSummary: { ...base.impactSummary },
    healthSummary: { ...base.healthSummary },
    activitySummary: { ...base.activitySummary },
    rawRefs: { ...base.rawRefs },
    scoreMeta: { ...base.scoreMeta },
    scores: { ...base.scores },
  };

  if (focusData.repoDetails) {
    const details = focusData.repoDetails;
    normalized.core = {
      ...normalized.core,
      description: details.description,
      homepage: normalized.core.homepage ?? null,
      htmlUrl: details.htmlUrl,
      stars: details.stars,
      forks: details.forks,
      openIssues: details.openIssues,
      primaryLanguage: details.primaryLanguage,
      topics: details.topics ?? normalized.core.topics,
      pushedAt: details.pushedAt,
      updatedAt: details.updatedAt,
      createdAt: details.createdAt,
      defaultBranch: details.defaultBranch,
      isPrivate: details.private ?? normalized.core.isPrivate,
      isFork: details.fork ?? normalized.core.isFork,
      isArchived: details.archived ?? normalized.core.isArchived,
    };
  }

  if (focusData.repoLanguages) {
    const entries = Object.entries(focusData.repoLanguages ?? {}).map(([name, bytes]) => ({
      name,
      bytes,
    }));
    const totalBytes = entries.reduce((sum, item) => sum + item.bytes, 0);
    normalized.languages = entries
      .sort((a, b) => b.bytes - a.bytes)
      .slice(0, TOP_LANGS)
      .map((item) => ({
        ...item,
        ratio: totalBytes > 0 ? item.bytes / totalBytes : 0,
      }));
  }

  if (focusData.repoContributors) {
    const sorted = [...focusData.repoContributors].sort((a, b) => b.contributions - a.contributions);
    normalized.people.contributors = sorted.slice(0, TOP_CONTRIBUTORS).map((c) => ({
      login: c.login,
      contributions: c.contributions,
    }));
  }

  if (focusData.repoCollaborators) {
    normalized.people.collaborators = focusData.repoCollaborators.map((c) => ({ login: c.login }));
  }

  const now = Date.now();
  const windowMs = DAYS_WORK_WINDOW * 24 * 60 * 60 * 1000;

  if (focusData.repoPulls) {
    const pulls = focusData.repoPulls;
    const mergedLast30d = pulls.filter((p) => {
      if (!p.mergedAt) return false;
      const ts = new Date(p.mergedAt).getTime();
      return !Number.isNaN(ts) && now - ts <= windowMs;
    }).length;
    const openPulls = pulls.filter((p) => p.state === "open").length;
    normalized.workSummary.prsOpen = openPulls;
    normalized.workSummary.prsMerged30d = mergedLast30d;
    normalized.workSummary.prsTotal = pulls.length;
  }

  if (focusData.repoIssues) {
    const issues = focusData.repoIssues;
    const realIssues = issues.filter((issue) => !issue.isPullRequest);
    const closedLast30d = realIssues.filter((issue) => {
      if (!issue.closedAt) return false;
      const ts = new Date(issue.closedAt).getTime();
      return !Number.isNaN(ts) && now - ts <= windowMs;
    }).length;
    const openIssues = realIssues.filter((issue) => issue.state === "open").length;
    normalized.workSummary.issuesOpen = openIssues;
    normalized.workSummary.issuesClosed30d = closedLast30d;
    normalized.workSummary.issuesTotal = realIssues.length;
  }

  if (focusData.repoTrafficViews) {
    normalized.impactSummary.views14d = focusData.repoTrafficViews.count;
  }

  if (focusData.repoTrafficReferrers) {
    const referrers = focusData.repoTrafficReferrers;
    normalized.impactSummary.topReferrers = referrers
      .slice()
      .sort((a, b) => b.count - a.count)
      .slice(0, TOP_TRAFFIC_REFERRERS)
      .map((r) => ({ referrer: r.referrer, count: r.count }));
  }

  if (focusData.repoTrafficPaths) {
    const paths = focusData.repoTrafficPaths;
    normalized.impactSummary.topPaths = paths
      .slice()
      .sort((a, b) => b.count - a.count)
      .slice(0, TOP_TRAFFIC_PATHS)
      .map((p) => ({ path: p.path, count: p.count }));
  }

  if (focusData.repoTrafficClones) {
    normalized.impactSummary.clones14d = focusData.repoTrafficClones.count;
  }

  if (focusData.repoCommunityProfile) {
    const community = focusData.repoCommunityProfile;
    normalized.healthSummary = {
      ...normalized.healthSummary,
      communityHealthPercentage: community.healthPercentage,
      hasReadme: Boolean(community.files?.readme),
      hasLicense: Boolean(community.files?.license),
      hasContributing: Boolean(community.files?.contributing),
    };
  }

  if (focusData.repoCommits) {
    const commitsLast30d = focusData.repoCommits.filter((commit) => {
      const ts = new Date(commit.committedAt ?? commit.authoredAt ?? "").getTime();
      return !Number.isNaN(ts) && now - ts <= windowMs;
    }).length;
    normalized.activitySummary.commitsLast30d = commitsLast30d;
  }

  if (focusData.repoStatsCommitActivity) {
    normalized.activitySummary.commitActivity = focusData.repoStatsCommitActivity;
  }

  if (focusData.repoStatsCodeFrequency) {
    normalized.activitySummary.codeFrequency = focusData.repoStatsCodeFrequency;
  }

  if (focusData.repoStatsPunchCard && focusData.repoStatsPunchCard.length > 0) {
    const peak = focusData.repoStatsPunchCard.reduce(
      (acc, point) => {
        const [, hour, count] = point;
        if (count > acc.count) return { day: point[0], hour, count };
        return acc;
      },
      { day: undefined as number | undefined, hour: undefined as number | undefined, count: -1 },
    );
    normalized.activitySummary.peakDay = peak.day;
    normalized.activitySummary.peakHour = peak.hour;
  }

  normalized.scores = computeScores(normalized);
  return normalized;
};

const repoImportance = (repo: NormalizedRepo) =>
  (repo.core.stars ?? 0) + (repo.scores.impact ?? 0) * 100 + (repo.scores.momentum ?? 0) * 50;

export const buildUniverseGraph = (
  meLogin: string | undefined,
  repos: NormalizedRepo[],
  maxRepos = MAX_REPOS,
): GraphDataset => {
  const nodes: GraphNode[] = [];
  const links: GraphLink[] = [];

  const meId = idMe(meLogin ?? "me");
  nodes.push({
    id: meId,
    kind: "me",
    label: meLogin ?? "me",
    meta: {},
    colorHint: "me",
    isMacro: true,
  });

  const sortedRepos = [...repos].sort((a, b) => repoImportance(b) - repoImportance(a)).slice(0, maxRepos);

  const langSet = new Set<string>();
  const topicSet = new Set<string>();
  const personSet = new Set<string>();

  sortedRepos.forEach((repo) => {
    const repoId = idRepo(repo.core.fullName);
    const val = 1 + (repo.scores.impact ?? 0) * 4 + (repo.scores.momentum ?? 0) * 2;

    nodes.push({
      id: repoId,
      kind: "repo",
      label: repo.core.name,
      repoFullName: repo.core.fullName,
      meta: {
        ownerLogin: repo.core.ownerLogin,
        topics: repo.core.topics,
        languages: repo.languages,
        scoreMeta: repo.scoreMeta,
      },
      val,
      scores: repo.scores,
      colorHint: "repo",
      isMacro: true,
    });

    const ownershipKind: "owns" | "affiliated" =
      meLogin && repo.core.ownerLogin === meLogin ? "owns" : "affiliated";
    links.push({
      id: idLink(ownershipKind, meId, repoId),
      source: meId,
      target: repoId,
      kind: ownershipKind,
      weight: 1,
      meta: { owner: repo.core.ownerLogin },
    });

    const districts: Array<{ kind: string; label: string; colorHint: string }> = [
      { kind: "work", label: "Work", colorHint: "work" },
      { kind: "ops", label: "Ops", colorHint: "ops" },
      { kind: "impact", label: "Impact", colorHint: "impact" },
      { kind: "health", label: "Health", colorHint: "health" },
    ];

    districts.forEach((district) => {
      const districtId = idDistrict(repo.core.fullName, district.kind);
      nodes.push({
        id: districtId,
        kind: "district",
        label: `${district.label}`,
        repoFullName: repo.core.fullName,
        meta: { repo: repo.core.fullName, district: district.kind },
        val: 1.5,
        colorHint: district.colorHint,
        isMacro: true,
      });
      links.push({
        id: idLink("repo_district", repoId, districtId),
        source: repoId,
        target: districtId,
        kind: "repo_district",
        weight: 1,
      });
    });

    repo.languages.forEach((lang) => {
      const langId = idLang(lang.name);
      if (!langSet.has(langId)) {
        langSet.add(langId);
        nodes.push({
          id: langId,
          kind: "lang",
          label: lang.name,
          meta: { type: "language" },
          val: 1 + lang.ratio * 2,
          colorHint: "lang",
          isMacro: true,
        });
      }
      links.push({
        id: idLink("repo_lang", repoId, langId),
        source: repoId,
        target: langId,
        kind: "repo_lang",
        weight: lang.ratio || safeDiv(lang.bytes, 1000),
        meta: { ratio: lang.ratio, bytes: lang.bytes },
      });
    });

    const topics = (repo.core.topics ?? []).slice(0, TOP_TOPICS);
    topics.forEach((topic) => {
      const topicId = idTopic(topic);
      if (!topicSet.has(topicId)) {
        topicSet.add(topicId);
        nodes.push({
          id: topicId,
          kind: "topic",
          label: topic,
          meta: {},
          val: 1,
          colorHint: "topic",
          isMacro: true,
        });
      }
      links.push({
        id: idLink("repo_topic", repoId, topicId),
        source: repoId,
        target: topicId,
        kind: "repo_topic",
        weight: 1,
      });
    });

    const people: Array<{ login: string; weight: number }> = [
      { login: repo.people.ownerLogin, weight: 1 },
      ...repo.people.contributors.map((c) => ({ login: c.login, weight: Math.max(1, c.contributions) })),
    ];

    uniqBy(people, (p) => p.login).forEach((person) => {
      const personId = idPerson(person.login);
      if (!personSet.has(personId)) {
        personSet.add(personId);
        nodes.push({
          id: personId,
          kind: "person",
          label: person.login,
          meta: {},
          val: 1 + normalizeLog(person.weight, 50),
          colorHint: "person",
          isMacro: true,
        });
      }
      links.push({
        id: idLink("repo_person", repoId, personId),
        source: repoId,
        target: personId,
        kind: "repo_person",
        weight: person.weight,
      });
    });
  });

  return { nodes: uniqBy(nodes, (n) => n.id), links: uniqBy(links, (l) => l.id) };
};

export const buildCityExpansionGraph = (repo: NormalizedRepo): GraphDataset => {
  const nodes: GraphNode[] = [];
  const links: GraphLink[] = [];
  const fullName = repo.core.fullName;

  type MetricCandidate = {
    id: string;
    label: string;
    value: number;
    district: "work" | "impact" | "health";
    meta?: Record<string, unknown>;
  };

  const metrics: MetricCandidate[] = [];

  const addMetric = (key: string, label: string, value: number | undefined, district: MetricCandidate["district"]) => {
    if (value === undefined || value === null) return;
    const numeric = Number(value);
    if (!Number.isFinite(numeric)) return;
    metrics.push({
      id: `metric:${fullName}:${key}`,
      label,
      value: numeric,
      district,
      meta: { key },
    });
  };

  addMetric("prsOpen", "PRs open", repo.workSummary.prsOpen, "work");
  addMetric("prsMerged30d", "PRs merged (30d)", repo.workSummary.prsMerged30d, "work");
  addMetric("issuesOpen", "Issues open", repo.workSummary.issuesOpen, "work");
  addMetric("issuesClosed30d", "Issues closed (30d)", repo.workSummary.issuesClosed30d, "work");

  addMetric("views14d", "Views (14d)", repo.impactSummary.views14d, "impact");
  addMetric("clones14d", "Clones (14d)", repo.impactSummary.clones14d, "impact");

  addMetric("peakHour", "Peak hour", repo.activitySummary.peakHour, "health");
  addMetric("peakDay", "Peak day", repo.activitySummary.peakDay, "health");

  metrics
    .sort((a, b) => b.value - a.value)
    .slice(0, 4)
    .forEach((metric) => {
      nodes.push({
        id: metric.id,
        kind: "metric",
        label: metric.label,
        repoFullName: fullName,
        meta: { ...metric.meta, value: metric.value },
        val: 1 + normalizeLog(metric.value, Math.max(metric.value, 10)) * 4,
        colorHint: metric.district,
        isMacro: false,
      });
      const districtId = idDistrict(fullName, metric.district);
      links.push({
        id: idLink("district_metric", districtId, metric.id),
        source: districtId,
        target: metric.id,
        kind: "district_metric",
        weight: metric.value,
        meta: { value: metric.value },
      });
    });

  return { nodes, links };
};

export const mergeGraphs = (base: GraphDataset, extra: GraphDataset): GraphDataset => {
  const nodeMap = new Map<string, GraphNode>();
  base.nodes.forEach((node) => nodeMap.set(node.id, node));
  extra.nodes.forEach((node) => nodeMap.set(node.id, node));

  const linkMap = new Map<string, GraphLink>();
  base.links.forEach((link) => linkMap.set(link.id, link));
  extra.links.forEach((link) => linkMap.set(link.id, link));

  return {
    nodes: Array.from(nodeMap.values()),
    links: Array.from(linkMap.values()),
  };
};
