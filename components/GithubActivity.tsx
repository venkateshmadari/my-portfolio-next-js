import Section from "./Section";
const USER = "venkateshmadari";
export type Day = { date: string; count: number; level: 0 | 1 | 2 | 3 | 4 };
export type Activity = { total: number; days: Day[] } | null;
// const shade = [
//   "bg-neutral-800",
//   "bg-neutral-600",
//   "bg-neutral-500",
//   "bg-neutral-300",
//   "bg-white",
// ];

const shade = [
  "bg-neutral-800",  // 0 - No contributions
  "bg-emerald-800",  // 1 - Very low
  "bg-emerald-700",  // 2 - Low
  "bg-emerald-500",  // 3 - Medium
  "bg-emerald-300",  // 4 - High
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

export async function getActivity(): Promise<Activity> {
  try {
    const res = await fetch(
      `https://github-contributions-api.jogruber.de/v4/${USER}?y=last`,
      { next: { revalidate: 3600 } },
    );
    if (!res.ok) return null;
    const json = await res.json();
    const days: Day[] = json.contributions;
    return {
      total: json.total?.lastYear ?? days.reduce((a, d) => a + d.count, 0),
      days,
    };
  } catch {
    return null;
  }
}

export function ActivityGrid({ data }: { data: Activity }) {
  const days = data?.days ?? [];
  const pad = days.length
    ? new Date(days[0].date + "T00:00:00Z").getUTCDay()
    : 0;
  const cells: (Day | null)[] = [...Array(pad).fill(null), ...days];
  const weeks = Math.ceil(cells.length / 7);
  const labels = Array.from({ length: weeks }, (_, w) => {
    const d = cells.slice(w * 7, w * 7 + 7).find(Boolean);
    return d ? new Date(d.date + "T00:00:00Z").getUTCMonth() : -1;
  }).map((m, i, a) => (m !== -1 && m !== a[i - 1] ? MONTHS[m] : ""));
  return (
    <Section
      id="github"
      title="Commit Rhythm"
      right={
        <a
          href={`https://github.com/${USER}`}
          target="_blank"
          rel="noreferrer"
          className="font-mono text-[9px] text-neutral-500"
        >
          @{USER} ↗
        </a>
      }
    >
      <div className="overflow-x-auto p-4 sm:px-6 flex items-center justify-center">
        {data ? (
          <div style={{ width: "max-content" }}>
            <div className="relative mb-1 h-3 font-mono text-[8px] text-neutral-500">
              {labels.map(
                (l, i) =>
                  l && (
                    <span key={i} className="absolute" style={{ left: i * 10 }}>
                      {l}
                    </span>
                  ),
              )}
            </div>
            <div className="grid grid-flow-col grid-rows-7 gap-[3px]">
              {cells.map((d, i) => (
                <i
                  key={i}
                  title={
                    d ? `${d.count} contributions on ${d.date}` : undefined
                  }
                  className={`size-[7px] rounded-[1px] ${d ? shade[d.level] : "bg-transparent"}`}
                />
              ))}
            </div>
            <div className="mt-3 flex items-center justify-between font-mono text-[10px] text-neutral-400">
              <span>{data.total} contributions in the last year</span>
              <span className="flex items-center gap-1">
                Less{" "}
                {shade.map((s) => (
                  <i key={s} className={`size-[7px] rounded-[1px] ${s}`} />
                ))}{" "}
                More
              </span>
            </div>
          </div>
        ) : (
          <p className="py-6 text-center font-mono text-[10px] text-neutral-500">
            Live activity unavailable right now.{" "}
            <a className="underline" href={`https://github.com/${USER}`}>
              View on GitHub ↗
            </a>
          </p>
        )}
      </div>
    </Section>
  );
}

export default async function GithubActivity() {
  return <ActivityGrid data={await getActivity()} />;
}
