"use client";

import { useState } from "react";
import Link from "next/link";

import {
  ArrowUpRight,
  Users,
  UserRound,
  BookOpen,
  X,
} from "lucide-react";

import type {
  Activity,
  Day,
  GithubProfile,
} from "./GithubActivity";

const USER = "venkateshmadari";

const shade = [
  "bg-neutral-800",
  "bg-emerald-800",
  "bg-emerald-700",
  "bg-emerald-500",
  "bg-emerald-300",
];

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const ACHIEVEMENTS = [
  {
    name: "Galaxy Brain",
    image:
      "https://github.githubassets.com/images/modules/profile/achievements/galaxy-brain-default.png",
    coverImage:
      "https://github.githubassets.com/assets/galaxy-brain-detail-df5fa6830b2b.png",
    subtitle: "@venkateshmadari answered discussions.",
  },
  {
    name: "YOLO",
    image:
      "https://github.githubassets.com/images/modules/profile/achievements/yolo-default.png",
    coverImage:
      "https://github.githubassets.com/assets/yolo-detail-9511d3a21745.png",
    subtitle: "You want it? You merge it.",
  },
  {
    name: "Pull Shark",
    image:
      "https://github.githubassets.com/images/modules/profile/achievements/pull-shark-default.png",
    coverImage:
      "https://github.githubassets.com/assets/pull-shark-detail-5c9ced120632.png",
    subtitle:
      "@venkateshmadari opened pull requests that have been merged.",
  },
  {
    name: "Quickdraw",
    image:
      "https://github.githubassets.com/images/modules/profile/achievements/quickdraw-default.png",
    coverImage:
      "https://github.githubassets.com/assets/quickdraw-detail-9de989a01ded.png",
    subtitle: "Gitty up!",
  },
  {
    name: "Pair Extraordinaire",
    image:
      "https://github.githubassets.com/images/modules/profile/achievements/pair-extraordinaire-default.png",
    coverImage:
      "https://github.githubassets.com/assets/pair-extraordinaire-detail-5c9ced120632.png",
    subtitle:
      "@venkateshmadari coauthored commits on merged pull requests.",
  },
];

type Achievement = (typeof ACHIEVEMENTS)[number];

export default function GithubActivityClient({
  activity,
  profile,
}: {
  activity: Activity;
  profile: GithubProfile;
}) {
  const [selectedAchievement, setSelectedAchievement] =
    useState<Achievement | null>(null);

  const days = activity?.days ?? [];

  // Calculate initial empty cells
  const pad = days.length
    ? new Date(days[0].date + "T00:00:00Z").getUTCDay()
    : 0;

  const cells: (Day | null)[] = [
    ...Array(pad).fill(null),
    ...days,
  ];

  const weeks = Math.ceil(cells.length / 7);

  // Calculate month labels
  const labels = Array.from({ length: weeks }, (_, w) => {
    const day = cells
      .slice(w * 7, w * 7 + 7)
      .find(Boolean);

    return day
      ? new Date(day.date + "T00:00:00Z").getUTCMonth()
      : -1;
  }).map((month, index, array) =>
    month !== -1 && month !== array[index - 1]
      ? MONTHS[month]
      : "",
  );

  // GitHub Statistics
  const stats = [
    {
      label: "Followers",
      value: profile?.followers,
      icon: Users,
    },
    {
      label: "Following",
      value: profile?.following,
      icon: UserRound,
    },
    {
      label: "Repositories",
      value: profile?.public_repos,
      icon: BookOpen,
    },
  ];

  const achievementsUrl = `https://github.com/${USER}?tab=achievements`;

  return (
    <div>
      {/* Contribution Graph */}
      <div className="w-full overflow-x-auto">
        <div className="flex min-w-max justify-center px-4 py-4 sm:px-6">
          {activity ? (
            <div className="w-max">
              {/* Month Labels */}
              <div className="relative mb-1 h-3 text-[8px] text-neutral-400">
                {labels.map(
                  (label, index) =>
                    label && (
                      <span
                        key={index}
                        className="absolute"
                        style={{
                          left: index * 10,
                        }}
                      >
                        {label}
                      </span>
                    ),
                )}
              </div>

              {/* Contribution Grid */}
              <div className="grid grid-flow-col grid-rows-7 gap-[3px]">
                {cells.map((day, index) => (
                  <i
                    key={index}
                    title={
                      day
                        ? `${day.count} contributions on ${day.date}`
                        : undefined
                    }
                    className={`size-[7px] shrink-0 rounded-[1px] ${
                      day
                        ? shade[day.level]
                        : "bg-transparent"
                    }`}
                  />
                ))}
              </div>

              {/* Contribution Information */}
              <div className="mt-3 flex items-center justify-between gap-6 whitespace-nowrap text-[10px] text-neutral-400">
                <span>
                  {activity.total} contributions in the last year
                </span>

                <span className="flex items-center gap-1">
                  Less

                  {shade.map((color) => (
                    <i
                      key={color}
                      className={`size-[7px] shrink-0 rounded-[1px] ${color}`}
                    />
                  ))}

                  More
                </span>
              </div>
            </div>
          ) : (
            <p className="py-6 text-center text-[10px] text-neutral-400">
              Live activity unavailable right now.{" "}

              <Link
                className="underline"
                href={`https://github.com/${USER}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                View on GitHub ↗
              </Link>
            </p>
          )}
        </div>
      </div>

      {/* GitHub Statistics */}
      <div className="mt-3 flex flex-wrap items-center justify-center gap-x-7 gap-y-3 border-t border-neutral-800/70 px-4 py-4">
        {stats.map(({ label, value, icon: Icon }) => (
          <div
            key={label}
            className="flex items-center justify-center gap-1.5"
          >
            <Icon
              size={18}
              className="text-primary"
            />

            <span className="font-semibold text-base">
              {value ?? "--"}
            </span>

            <span className="font-medium text-neutral-300 mt-0.5">
              {label}
            </span>
          </div>
        ))}
      </div>

      {/* Achievements */}
      <div className="border-t border-neutral-800/70 px-4 pt-4 pb-2">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-neutral-200">
            Achievements
          </h3>

          <Link
            href={achievementsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs text-neutral-400 transition-colors hover:text-primary"
          >
            View all
            <ArrowUpRight size={13} />
          </Link>
        </div>

        {/* Achievement Badges */}
        <div className="mb-5 flex flex-wrap items-start justify-center gap-5 sm:gap-7">
          {ACHIEVEMENTS.map((achievement) => (
            <button
              key={achievement.name}
              type="button"
              onClick={() =>
                setSelectedAchievement(achievement)
              }
              title={achievement.name}
              className="group flex cursor-pointer flex-col items-center justify-start gap-2 rounded-lg outline-none"
            >
              <img
                src={achievement.image}
                alt={achievement.name}
                className="size-12 shrink-0 object-contain transition-transform duration-200 group-hover:scale-110 sm:size-14"
              />

              <span className="flex min-h-[36px] max-w-[90px] items-start justify-center text-center text-sm leading-relaxed font-medium text-neutral-300 transition-colors group-hover:text-white">
                {achievement.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* GitHub Style Achievement Modal */}
      {selectedAchievement && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 px-4 py-6 backdrop-blur-sm"
          onClick={() => setSelectedAchievement(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="achievement-title"
            className="w-full max-w-[390px] overflow-hidden rounded-lg border border-[#30363d] bg-[#0d1117] shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            {/* Cover Image */}
            <div className="relative h-[135px] w-full bg-[#351b80] sm:h-[150px]">
              <img
                src={selectedAchievement.coverImage}
                alt=""
                className="h-full w-full object-cover"
              />

              {/* Main Achievement Image */}
              <div className="absolute inset-0 flex items-center justify-center">
                <img
                  src={selectedAchievement.image}
                  alt={selectedAchievement.name}
                  className="size-[100px] object-contain drop-shadow-lg sm:size-[110px]"
                />
              </div>

              {/* Close Icon */}
              <button
                type="button"
                onClick={() => setSelectedAchievement(null)}
                aria-label="Close achievement"
                className="absolute top-3 right-3 flex size-8 cursor-pointer items-center justify-center rounded-full bg-[#21262d] text-white transition-colors hover:bg-[#30363d]"
              >
                <X size={17} />
              </button>
            </div>

            {/* Achievement Details */}
            <div className="px-4 py-4 sm:px-5">
              <h3
                id="achievement-title"
                className="text-lg font-semibold text-[#e6edf3]"
              >
                {selectedAchievement.name}
              </h3>

              <p className="mt-1.5 text-sm leading-5 font-medium text-[#e6edf3]">
                {selectedAchievement.subtitle}
              </p>

              <div className="my-4 border-t border-[#30363d]" />

              {/* View on GitHub */}
              <Link
                href={achievementsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-md border border-[#30363d] bg-[#21262d] px-4 py-2 text-sm font-semibold text-[#e6edf3] transition-colors hover:bg-[#30363d]"
              >
                View on GitHub
                <ArrowUpRight size={15} />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}