import type {
  BackendGithubUser,
  BackendRepo,
  BackendRepoBranch,
  BackendRepoCollaboratorLite,
  BackendRepoCommit,
  BackendRepoCommunityProfile,
  BackendRepoContent,
  BackendRepoContentDirItem,
  BackendRepoContentFile,
  BackendRepoContributorLite,
  BackendRepoIssueLite,
  BackendRepoPullLite,
  BackendRepoReleaseLite,
  BackendRepoStatsCodeFrequencyPoint,
  BackendRepoStatsCommitActivityWeek,
  BackendRepoStatsContributor,
  BackendRepoStatsPunchCardPoint,
  BackendRepoTrafficClones,
  BackendRepoTrafficPath,
  BackendRepoTrafficReferrer,
  BackendRepoTrafficViews,
  GithubUser,
  Repo,
  RepoBranch,
  RepoCollaboratorLite,
  RepoCommit,
  RepoCommunityProfile,
  RepoContent,
  RepoContentDirItem,
  RepoContentFile,
  RepoContributorLite,
  RepoIssueLite,
  RepoLanguages,
  RepoPullLite,
  RepoReleaseLite,
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
import {
  toRepo,
  toRepoBranch,
  toRepoCollaboratorLite,
  toRepoCommit,
  toRepoCommunityProfile,
  toRepoContributorLite,
  toRepoIssueLite,
  toRepoPullLite,
  toRepoReleaseLite,
  toRepoTrafficClones,
  toRepoTrafficPath,
  toRepoTrafficReferrer,
  toRepoTrafficViews,
  toRepoStatsCommitActivityWeek,
  toRepoStatsContributor,
} from "./adapters/mappers";
import { toRepoSummary } from "./adapters/toRepoSummary";
import { githubFetch } from "./client";
import { toGithubUser } from "./adapters/toGithubUser";

function mapRepoContentDirItem(item: BackendRepoContentDirItem): RepoContentDirItem {
  return {
    type: item.type,
    name: item.name,
    path: item.path,
    sha: item.sha,
    size: item.size,
    url: item.url,
    htmlUrl: item.html_url,
    gitUrl: item.git_url,
    downloadUrl: item.download_url,
  };
}

function mapRepoContentFile(file: BackendRepoContentFile): RepoContentFile {
  return {
    ...mapRepoContentDirItem(file),
    type: "file",
    content: file.content,
    encoding: file.encoding,
  };
}

function mapRepoContent(content: BackendRepoContent): RepoContent {
  if (Array.isArray(content)) {
    return content.map(mapRepoContentDirItem);
  }

  return mapRepoContentFile(content);
}

export async function getMe(): Promise<GithubUser> {
  const backendUser = await githubFetch<BackendGithubUser>("/user");
  return toGithubUser(backendUser);
}

export async function listMyRepos(): Promise<RepoSummary[]> {
  const path =
    "/user/repos" +
    "?per_page=100" +
    "&sort=updated&direction=desc" +
    "&visibility=all" +
    "&affiliation=owner,collaborator,organization_member";

  const raw = await githubFetch<any[]>(path);
  return raw.map(toRepoSummary);
}

export async function getRepo(owner: string, repo: string): Promise<Repo> {
  const backendRepo = await githubFetch<BackendRepo>(`/repos/${owner}/${repo}`);
  return toRepo(backendRepo);
}

export async function getRepoLanguages(owner: string, repo: string): Promise<RepoLanguages> {
  return githubFetch<RepoLanguages>(`/repos/${owner}/${repo}/languages`);
}

export async function getRepoContent(
  owner: string,
  repo: string,
  path: string,
): Promise<RepoContent> {
  const backendContent = await githubFetch<BackendRepoContent>(
    `/repos/${owner}/${repo}/content/${path}`,
  );
  return mapRepoContent(backendContent);
}

export async function getRepoCommits(owner: string, repo: string): Promise<RepoCommit[]> {
  const commits = await githubFetch<BackendRepoCommit[]>(`/repos/${owner}/${repo}/commits/`);
  return commits.map(toRepoCommit);
}

export async function getRepoBranches(owner: string, repo: string): Promise<RepoBranch[]> {
  const branches = await githubFetch<BackendRepoBranch[]>(`/repos/${owner}/${repo}/branches/`);
  return branches.map(toRepoBranch);
}

export async function getRepoReleases(owner: string, repo: string): Promise<RepoReleaseLite[]> {
  const releases = await githubFetch<BackendRepoReleaseLite[]>(
    `/repos/${owner}/${repo}/releases/`,
  );
  return releases.map(toRepoReleaseLite);
}

export async function getRepoPulls(owner: string, repo: string): Promise<RepoPullLite[]> {
  const pulls = await githubFetch<BackendRepoPullLite[]>(
    `/repos/${owner}/${repo}/pulls?state=all`,
  );
  return pulls.map(toRepoPullLite);
}

export async function getRepoIssues(owner: string, repo: string): Promise<RepoIssueLite[]> {
  const issues = await githubFetch<BackendRepoIssueLite[]>(
    `/repos/${owner}/${repo}/issues?state=all`,
  );
  return issues.map(toRepoIssueLite);
}

export async function getRepoContributors(owner: string, repo: string): Promise<RepoContributorLite[]> {
  const contributors = await githubFetch<BackendRepoContributorLite[]>(
    `/repos/${owner}/${repo}/contributors`,
  );
  return contributors.map(toRepoContributorLite);
}

export async function getRepoCollaborators(
  owner: string,
  repo: string,
): Promise<RepoCollaboratorLite[]> {
  const collaborators = await githubFetch<BackendRepoCollaboratorLite[]>(
    `/repos/${owner}/${repo}/collaborators`,
  );
  return collaborators.map(toRepoCollaboratorLite);
}

export async function getRepoTrafficViews(owner: string, repo: string): Promise<RepoTrafficViews> {
  const trafficViews = await githubFetch<BackendRepoTrafficViews>(
    `/repos/${owner}/${repo}/traffic/views`,
  );
  return toRepoTrafficViews(trafficViews);
}

export async function getRepoTrafficClones(owner: string, repo: string): Promise<RepoTrafficClones> {
  const trafficClones = await githubFetch<BackendRepoTrafficClones>(
    `/repos/${owner}/${repo}/traffic/clones`,
  );
  return toRepoTrafficClones(trafficClones);
}

export async function getRepoTrafficPopularReferrers(
  owner: string,
  repo: string,
): Promise<RepoTrafficReferrer[]> {
  const referrers = await githubFetch<BackendRepoTrafficReferrer[]>(
    `/repos/${owner}/${repo}/traffic/popular/referrers`,
  );
  return referrers.map(toRepoTrafficReferrer);
}

export async function getRepoTrafficPopularPath(
  owner: string,
  repo: string,
): Promise<RepoTrafficPath[]> {
  const paths = await githubFetch<BackendRepoTrafficPath[]>(
    `/repos/${owner}/${repo}/traffic/popular/paths`,
  );
  return paths.map(toRepoTrafficPath);
}

export async function getRepoStatsCommitActivity(
  owner: string,
  repo: string,
): Promise<RepoStatsCommitActivityWeek[]> {
  const stats = await githubFetch<BackendRepoStatsCommitActivityWeek[]>(
    `/repos/${owner}/${repo}/stats/commit_activity`,
  );
  return stats.map(toRepoStatsCommitActivityWeek);
}

export async function getRepoStatsCodeFrequency(
  owner: string,
  repo: string,
): Promise<RepoStatsCodeFrequencyPoint[]> {
  return githubFetch<BackendRepoStatsCodeFrequencyPoint[]>(
    `/repos/${owner}/${repo}/stats/code_frequency`,
  );
}

export async function getRepoStatsContributors(
  owner: string,
  repo: string,
): Promise<RepoStatsContributor[]> {
  const stats = await githubFetch<BackendRepoStatsContributor[]>(
    `/repos/${owner}/${repo}/stats/contributors`,
  );
  return stats.map(toRepoStatsContributor);
}

export async function getRepoStatsPunchCard(
  owner: string,
  repo: string,
): Promise<RepoStatsPunchCardPoint[]> {
  return githubFetch<BackendRepoStatsPunchCardPoint[]>(
    `/repos/${owner}/${repo}/stats/punch_card`,
  );
}

export async function getRepoCommunityProfile(
  owner: string,
  repo: string,
): Promise<RepoCommunityProfile> {
  const profile = await githubFetch<BackendRepoCommunityProfile>(
    `/repos/${owner}/${repo}/community/profile`,
  );
  return toRepoCommunityProfile(profile);
}
