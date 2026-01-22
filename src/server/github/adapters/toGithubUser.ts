import { BackendGithubUser, GithubUser } from "@/shared/types/github";

export const toGithubUser = (backendGithubUser: BackendGithubUser): GithubUser => {
  return {
    avatarUrl: backendGithubUser.avatar_url,
    location: backendGithubUser.location,
    login: backendGithubUser.login,
    publicRepo: backendGithubUser.public_repo,
    url: backendGithubUser.url,
    followers: backendGithubUser.followers,
    following: backendGithubUser.following,
    createdAt: backendGithubUser.created_at,
    bio: backendGithubUser.bio,
    id: backendGithubUser.id,
  };
};
