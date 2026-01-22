import { useMemo } from "react";
import {
  FocusedRepoData,
  MAX_REPOS,
  TOP_LANGS,
  TOP_TOPICS,
  buildCityExpansionGraph,
  buildUniverseGraph,
  enrichFocusedRepo,
  mergeGraphs,
  normalizeRepoSummary,
  safeDiv,
} from "@/graph/graphBuilders";
import { GraphDataset, NormalizedRepo } from "@/graph/graphTypes";
import { useGetMe } from "./useGetMe";
import { useGithubRepos } from "./useGithubRepos";
import { useRepoLanguages } from "./useRepoLanguages";
import { useRepo } from "./useRepo";
import { useRepoContent } from "./useRepoContent";
import { useRepoCommits } from "./useRepoCommits";
import { useRepoBranches } from "./useRepoBranches";
import { useRepoReleases } from "./useRepoReleases";
import { useRepoPulls } from "./useRepoPulls";
import { useRepoIssues } from "./useRepoIssues";
import { useRepoContributors } from "./useRepoContributors";
import { useRepoCollaborators } from "./useRepoCollaborators";
import { useRepoTrafficViews } from "./useRepoTrafficViews";
import { useRepoTrafficClones } from "./useRepoTrafficClones";
import { useRepoTrafficPopularReferrers } from "./useRepoTrafficPopularReferrers";
import { useRepoTrafficPopularPaths } from "./useRepoTrafficPopularPaths";
import { useRepoStatsCommitActivity } from "./useRepoStatsCommitActivity";
import { useRepoStatsCodeFrequency } from "./useRepoStatsCodeFrequency";
import { useRepoStatsContributors } from "./useRepoStatsContributors";
import { useRepoStatsPunchCard } from "./useRepoStatsPunchCard";
import { useRepoCommunityProfile } from "./useRepoCommunityProfile";

type UseGetAndFormatGraphDataOptions = {
  focusRepoFullName?: string;
  contentPath?: string;
  maxRepos?: number;
  enableFocusFetch?: boolean;
};

const emptyGraph: GraphDataset = { nodes: [], links: [] };

export const useGetAndFormatGraphData = (options: UseGetAndFormatGraphDataOptions = {}) => {
  const { focusRepoFullName, contentPath = "", maxRepos = MAX_REPOS, enableFocusFetch = true } = options;

  const { data: me, isLoading: isMeLoading, error: meError } = useGetMe();
  const {
    repos = [],
    isLoading: isReposLoading,
    isFetching: isReposFetching,
    error: reposError,
  } = useGithubRepos();

  const meLogin = me?.login;

  const normalizedBase = useMemo(() => normalizeRepoSummary(repos ?? [], meLogin), [repos, meLogin]);

  const baseFocusRepo = useMemo(() => {
    if (!normalizedBase.length) return undefined;
    if (focusRepoFullName) {
      return normalizedBase.find((repo) => repo.core.fullName === focusRepoFullName) ?? normalizedBase[0];
    }
    return normalizedBase[0];
  }, [normalizedBase, focusRepoFullName]);

  const focusEnabled = Boolean(enableFocusFetch && baseFocusRepo);
  const focusOwner = focusEnabled ? baseFocusRepo?.core.ownerLogin : undefined;
  const focusRepoName = focusEnabled ? baseFocusRepo?.core.name : undefined;

  const repoLanguages = useRepoLanguages(focusOwner, focusRepoName);
  const repoDetails = useRepo(focusOwner, focusRepoName);
  const repoContent = useRepoContent(focusOwner, focusRepoName, contentPath);
  const repoCommits = useRepoCommits(focusOwner, focusRepoName);
  const repoBranches = useRepoBranches(focusOwner, focusRepoName);
  const repoReleases = useRepoReleases(focusOwner, focusRepoName);
  const repoPulls = useRepoPulls(focusOwner, focusRepoName);
  const repoIssues = useRepoIssues(focusOwner, focusRepoName);
  const repoContributors = useRepoContributors(focusOwner, focusRepoName);
  const repoCollaborators = useRepoCollaborators(focusOwner, focusRepoName);
  const repoTrafficViews = useRepoTrafficViews(focusOwner, focusRepoName);
  const repoTrafficClones = useRepoTrafficClones(focusOwner, focusRepoName);
  const repoTrafficReferrers = useRepoTrafficPopularReferrers(focusOwner, focusRepoName);
  const repoTrafficPaths = useRepoTrafficPopularPaths(focusOwner, focusRepoName);
  const repoStatsCommitActivity = useRepoStatsCommitActivity(focusOwner, focusRepoName);
  const repoStatsCodeFrequency = useRepoStatsCodeFrequency(focusOwner, focusRepoName);
  const repoStatsContributors = useRepoStatsContributors(focusOwner, focusRepoName);
  const repoStatsPunchCard = useRepoStatsPunchCard(focusOwner, focusRepoName);
  const repoCommunityProfile = useRepoCommunityProfile(focusOwner, focusRepoName);

  const focusData = useMemo<FocusedRepoData>(
    () => ({
      repoLanguages: repoLanguages.data,
      repoDetails: repoDetails.data,
      repoCommits: repoCommits.data,
      repoBranches: repoBranches.data,
      repoReleases: repoReleases.data,
      repoPulls: repoPulls.data,
      repoIssues: repoIssues.data,
      repoContributors: repoContributors.data,
      repoCollaborators: repoCollaborators.data,
      repoContent: repoContent.data,
      repoTrafficViews: repoTrafficViews.data,
      repoTrafficClones: repoTrafficClones.data,
      repoTrafficReferrers: repoTrafficReferrers.data,
      repoTrafficPaths: repoTrafficPaths.data,
      repoStatsCommitActivity: repoStatsCommitActivity.data,
      repoStatsCodeFrequency: repoStatsCodeFrequency.data,
      repoStatsContributors: repoStatsContributors.data,
      repoStatsPunchCard: repoStatsPunchCard.data,
      repoCommunityProfile: repoCommunityProfile.data,
    }),
    [
      repoLanguages.data,
      repoDetails.data,
      repoCommits.data,
      repoBranches.data,
      repoReleases.data,
      repoPulls.data,
      repoIssues.data,
      repoContributors.data,
      repoCollaborators.data,
      repoContent.data,
      repoTrafficViews.data,
      repoTrafficClones.data,
      repoTrafficReferrers.data,
      repoTrafficPaths.data,
      repoStatsCommitActivity.data,
      repoStatsCodeFrequency.data,
      repoStatsContributors.data,
      repoStatsPunchCard.data,
      repoCommunityProfile.data,
    ],
  );

  const focusedNormalized = useMemo(
    () => (baseFocusRepo ? enrichFocusedRepo(baseFocusRepo, focusData) : undefined),
    [baseFocusRepo, focusData],
  );

  const normalizedRepos: NormalizedRepo[] = useMemo(() => {
    if (!focusedNormalized) return normalizedBase;
    return normalizedBase.map((repo) =>
      repo.core.fullName === focusedNormalized.core.fullName ? focusedNormalized : repo,
    );
  }, [normalizedBase, focusedNormalized]);

  const baseGraph = useMemo(
    () => buildUniverseGraph(meLogin, normalizedRepos, maxRepos),
    [meLogin, normalizedRepos, maxRepos],
  );

  const focusGraph = useMemo(
    () => (focusedNormalized ? buildCityExpansionGraph(focusedNormalized) : emptyGraph),
    [focusedNormalized],
  );

  const graph = useMemo(() => mergeGraphs(baseGraph, focusGraph), [baseGraph, focusGraph]);

  const collectError = (err: unknown) => {
    if (!err) return null;
    if (err instanceof Error) return err.message;
    return String(err);
  };

  const errors = useMemo(() => {
    const list: string[] = [];
    const maybePush = (err: unknown) => {
      const message = collectError(err);
      if (message) list.push(message);
    };
    maybePush(meError);
    maybePush(reposError);
    if (focusEnabled) {
      [
        repoLanguages.error,
        repoDetails.error,
        repoContent.error,
        repoCommits.error,
        repoBranches.error,
        repoReleases.error,
        repoPulls.error,
        repoIssues.error,
        repoContributors.error,
        repoCollaborators.error,
        repoTrafficViews.error,
        repoTrafficClones.error,
        repoTrafficReferrers.error,
        repoTrafficPaths.error,
        repoStatsCommitActivity.error,
        repoStatsCodeFrequency.error,
        repoStatsContributors.error,
        repoStatsPunchCard.error,
        repoCommunityProfile.error,
      ].forEach(maybePush);
    }
    return list;
  }, [
    meError,
    reposError,
    focusEnabled,
    repoLanguages.error,
    repoDetails.error,
    repoContent.error,
    repoCommits.error,
    repoBranches.error,
    repoReleases.error,
    repoPulls.error,
    repoIssues.error,
    repoContributors.error,
    repoCollaborators.error,
    repoTrafficViews.error,
    repoTrafficClones.error,
    repoTrafficReferrers.error,
    repoTrafficPaths.error,
    repoStatsCommitActivity.error,
    repoStatsCodeFrequency.error,
    repoStatsContributors.error,
    repoStatsPunchCard.error,
    repoCommunityProfile.error,
  ]);

  const isFocusLoading =
    focusEnabled &&
    [
      repoLanguages.isLoading,
      repoDetails.isLoading,
      repoContent.isLoading,
      repoCommits.isLoading,
      repoBranches.isLoading,
      repoReleases.isLoading,
      repoPulls.isLoading,
      repoIssues.isLoading,
      repoContributors.isLoading,
      repoCollaborators.isLoading,
      repoTrafficViews.isLoading,
      repoTrafficClones.isLoading,
      repoTrafficReferrers.isLoading,
      repoTrafficPaths.isLoading,
      repoStatsCommitActivity.isLoading,
      repoStatsCodeFrequency.isLoading,
      repoStatsContributors.isLoading,
      repoStatsPunchCard.isLoading,
      repoCommunityProfile.isLoading,
      repoLanguages.isFetching,
      repoDetails.isFetching,
      repoCommits.isFetching,
      repoBranches.isFetching,
      repoReleases.isFetching,
      repoPulls.isFetching,
      repoIssues.isFetching,
      repoContributors.isFetching,
      repoCollaborators.isFetching,
      repoTrafficViews.isFetching,
      repoTrafficClones.isFetching,
      repoTrafficReferrers.isFetching,
      repoTrafficPaths.isFetching,
      repoStatsCommitActivity.isFetching,
      repoStatsCodeFrequency.isFetching,
      repoStatsContributors.isFetching,
      repoStatsPunchCard.isFetching,
      repoCommunityProfile.isFetching,
    ].some(Boolean);

  const isLoading = isMeLoading || isReposLoading || isReposFetching || isFocusLoading;

  const signature = useMemo(() => {
    const weightSum = normalizedRepos.reduce((sum, repo) => sum + (repo.scores.impact + 0.2), 0);
    const weighted = normalizedRepos.reduce(
      (acc, repo) => {
        const weight = repo.scores.impact + 0.2;
        return {
          craft: acc.craft + repo.scores.craft * weight,
          momentum: acc.momentum + repo.scores.momentum * weight,
          churn: acc.churn + repo.scores.churn * weight,
          collaboration: acc.collaboration + repo.scores.collaboration * weight,
          disciplineOps: acc.disciplineOps + repo.scores.disciplineOps * weight,
          impact: acc.impact + repo.scores.impact * weight,
        };
      },
      {
        craft: 0,
        momentum: 0,
        churn: 0,
        collaboration: 0,
        disciplineOps: 0,
        impact: 0,
      },
    );

    const avg = (value: number) => (weightSum > 0 ? safeDiv(value, weightSum) : 0);

    const languageAgg: Record<string, number> = {};
    normalizedRepos.forEach((repo) => {
      repo.languages.forEach((lang) => {
        languageAgg[lang.name] = (languageAgg[lang.name] ?? 0) + lang.ratio;
      });
    });

    const topicAgg: Record<string, number> = {};
    normalizedRepos.forEach((repo) => {
      (repo.core.topics ?? []).forEach((topic) => {
        topicAgg[topic] = (topicAgg[topic] ?? 0) + 1;
      });
    });

    const topLanguages = Object.entries(languageAgg)
      .sort((a, b) => b[1] - a[1])
      .slice(0, TOP_LANGS)
      .map(([name, weight]) => ({ name, weight }));

    const topTopics = Object.entries(topicAgg)
      .sort((a, b) => b[1] - a[1])
      .slice(0, TOP_TOPICS)
      .map(([name, weight]) => ({ name, weight }));

    return {
      craftAvg: avg(weighted.craft),
      momentumAvg: avg(weighted.momentum),
      churnAvg: avg(weighted.churn),
      collaborationAvg: avg(weighted.collaboration),
      disciplineOpsAvg: avg(weighted.disciplineOps),
      impactAvg: avg(weighted.impact),
      topLanguages,
      topTopics,
    };
  }, [normalizedRepos]);

  return {
    graph,
    normalizedRepos,
    focusedRepo: focusedNormalized,
    isLoading,
    errors,
    meta: {
      meLogin,
      signature,
    },
  };
};
