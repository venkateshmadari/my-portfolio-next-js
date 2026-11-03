import axios from "axios";
import { unstable_cache } from "next/cache";

import Link from "next/link";
import Section from "./Section";
import GithubActivityClient from "./GithubActivityClient";

const USER = "venkateshmadari";

export type Day = {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
};

export type Activity = {
  total: number;
  days: Day[];
} | null;

export type GithubProfile = {
  followers: number;
  following: number;
  public_repos: number;
} | null;

// GitHub Contributions API Response
type ContributionsResponse = {
  total?: {
    lastYear?: number;
  };
  contributions: Day[];
};

// GitHub Profile API Response
type GithubProfileResponse = {
  followers: number;
  following: number;
  public_repos: number;
};

// Fetch GitHub Contribution Activity
async function fetchActivity(): Promise<Activity> {
  try {
    const { data } = await axios.get<ContributionsResponse>(
      `https://github-contributions-api.jogruber.de/v4/${USER}?y=last`,
      {
        timeout: 10000,
      },
    );

    const days = data.contributions;

    return {
      total:
        data.total?.lastYear ??
        days.reduce((total, day) => total + day.count, 0),
      days,
    };
  } catch (error) {
    console.error("GitHub activity API error:", error);
    return null;
  }
}

// Fetch GitHub Profile Statistics
async function fetchGithubProfile(): Promise<GithubProfile> {
  try {
    const { data } = await axios.get<GithubProfileResponse>(
      `https://api.github.com/users/${USER}`,
      {
        headers: {
          Accept: "application/vnd.github+json",
        },
        timeout: 10000,
      },
    );

    return {
      followers: data.followers,
      following: data.following,
      public_repos: data.public_repos,
    };
  } catch (error) {
    console.error("GitHub profile API error:", error);
    return null;
  }
}

// Cache API responses for 1 hour
const getActivity = unstable_cache(
  fetchActivity,
  ["github-contributions", USER],
  {
    revalidate: 3600,
  },
);

const getGithubProfile = unstable_cache(
  fetchGithubProfile,
  ["github-profile", USER],
  {
    revalidate: 3600,
  },
);

// GitHub Activity Section
export default async function GithubActivity() {
  const [activity, profile] = await Promise.all([
    getActivity(),
    getGithubProfile(),
  ]);

  return (
    <Section
      id="github"
      title="Commit Rhythm"
      right={
        <Link
          href={`https://github.com/${USER}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-xs font-semibold text-neutral-400 transition-colors hover:text-primary"
        >
          @{USER}
          <span aria-hidden="true">↗</span>
        </Link>
      }
    >
      <GithubActivityClient
        activity={activity}
        profile={profile}
      />
    </Section>
  );
}