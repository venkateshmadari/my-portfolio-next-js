import Image from "next/image";
import { ArrowLeft, ArrowRight, ArrowUpRight, Dot } from "lucide-react";
import Link from "next/link";
import Tags from "../common/Tags";
import ImageViewer from "../common/ImageViewer";
import RelatedBlog from "../common/RelatedBlog";
/* ───────────── Edit these ───────────── */
const META = {
  title: "BookMyShow: HLD Breakdown",
  desc: "Ticket booking looks simple: pick a seat, pay, done. The hard part is guaranteeing that one seat belongs to exactly one person.",
  date: "Aug 31, 2026",
  read: "4 min read",
  image: "/bookmyshow-hld.png", // file in /public/blogs
  imageAlt: "BookMyShow high level design diagram",
  linkedin: "https://lnkd.in/p/dVBvRy5J",
  tags: ["System Design", "HLD", "Redis", "AWS"],
  hashtags: [
    "SystemDesign",
    "BookMyShow",
    "HLD",
    "AWS",
    "Redis",
    "DistributedSystems",
    "Scalability",
    "Concurrency",
    "BackendEngineering",
    "SoftwareArchitecture",
    "Backend",
  ],
};
const LOCK_MINUTES = 5; // matches the diagram (TTL 5 min)

const SCENARIOS = [
  "Payment failures and retries",
  "Duplicate payment requests",
  "Regional traffic spikes",
  "Load balancing and Auto Scaling",
  "Caching and CDN",
  "Show cancellations and rescheduling",
  "Notification delivery",
  "API timeouts and retries",
  "Idempotency",
];

const SCALE = [
  [
    "CloudFront",
    "Serves cacheable content from edge locations, so most read traffic never reaches your servers.",
  ],
  ["Load Balancer", "Distributes incoming traffic across healthy servers."],
  [
    "Auto Scaling",
    "Adds or removes instances based on demand, then scales back when the rush ends.",
  ],
];

/* ───────────── Pieces ───────────── */
const LinkedinIcon = ({ size = 14 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

function Sec({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="min-w-0 border-b border-white/10">
      <div className="hatch h-6 border-b border-white/10" />
      <div className="border-b border-white/10 px-4 py-3 sm:px-6">
        <h2 className="font-serif text-[22px] leading-[1.15] text-white">
          {title}
        </h2>
      </div>
      <div className="min-w-0 space-y-4 px-4 py-5 md:text-base text-sm font-medium leading-relaxed text-neutral-300 sm:px-6">
        {children}
      </div>
    </section>
  );
}

const B = ({ children }: { children: React.ReactNode }) => (
  <b className="font-semibold text-white">{children}</b>
);

const STATES = [
  ["AVAILABLE", "border-emerald-400/30 bg-emerald-400/10 text-emerald-300"],
  ["LOCKED", "border-amber-300/30 bg-amber-300/10 text-amber-200"],
  ["BOOKED", "border-rose-400/30 bg-rose-400/10 text-rose-300"],
] as const;

/* ───────────── Page ───────────── */
export default function BookMyShowHLD() {
  return (
    <article className="min-w-0">
      <header className="border-b border-white/10">
        <div className="hatch h-6 border-b border-white/10" />
        <div className="px-4 py-8 sm:px-6">
          <Link
            href="/blogs"
            className="text-base font-semibold flex items-center gap-2 text-neutral-400 transition-colors hover:text-primary"
          >
            <ArrowLeft size={16} /> All blogs
          </Link>
          <div className="mt-6 flex flex-wrap items-center -gap-x-1 gap-y-1 text-xs text-neutral-300">
            <span>{META.date}</span>
            <span>
              <Dot className="text-neutral-300" size={18} />
            </span>
            <span>{META.read}</span>
          </div>
          <h1 className="mt-3 font-serif text-[32px] leading-[1.1] text-white sm:text-[42px]">
            {META.title}
          </h1>
          <p className="mt-4 md:text-base text-sm font-medium leading-relaxed text-neutral-300">
            {META.desc}
          </p>
          <div className="mt-5 flex flex-wrap gap-1">
            {META.tags.map((t) => (
              <Tags name={t} key={t} />
            ))}
          </div>
        </div>

        <ImageViewer image={META.image} title="Fig. 1: High-level design" />
      </header>

      <Sec title="Not as Simple as It Looks">
        <p>A lot of people think ticket booking is simple:</p>
        <p className="md:text-base text-sm font-semibold leading-relaxed text-white">
          Open app <span className="text-neutral-200">→</span> Select movie{" "}
          <span className="text-neutral-200">→</span> Select theater{" "}
          <span className="text-neutral-200">→</span> Select seat{" "}
          <span className="text-neutral-200">→</span> Pay{" "}
          <span className="text-neutral-200">→</span> Done.
        </p>
        <p>
          Sounds simple, right? <B>Wrong.</B>
        </p>
        <div className="rounded-md border border-white/10 bg-white/[.02] px-4 py-4 md:text-base text-sm font-medium leading-relaxed text-white">
          The hardest part of BookMyShow isn't showing movies. It's guaranteeing
          that one seat belongs to exactly one person.
        </div>
      </Sec>

      <Sec title="One Seat, Two Customers">
        <p>
          Imagine a blockbuster release. <B>Thousands of users</B> are trying to
          book tickets for the same show. Two of them see the same seat:
        </p>
        <div className="overflow-hidden rounded-md border border-white/10 bg-black/40">
          <div className="border-b border-white/10 px-3 py-1.5 text-xs capitalize font-medium text-neutral-400">
            race condition
          </div>
          <pre className="overflow-x-auto p-3 text-sm leading-relaxed text-neutral-200">
            {`A1      → AVAILABLE

User A  → "Book A1"
User B  → "Book A1"`}
          </pre>
        </div>
        <p>
          If both requests reach the database at the same time, you have a{" "}
          <B>race condition</B>. One seat. Two customers.
        </p>
        <p>This is where system design comes in.</p>
      </Sec>

      <Sec title="Locking Seats with Redis">
        <p>
          A common solution is <B>seat locking</B> with Redis, which provides
          fast, temporary state management. Instead of booking a seat directly,
          it moves through three states:
        </p>
        <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center">
          {STATES.map(([label, cls], i) => (
            <div
              key={label}
              className="flex min-w-0 flex-col items-stretch gap-2 sm:flex-1 sm:flex-row sm:items-center"
            >
              <span
                className={`flex-1 rounded-md border px-3 py-2 text-center font-mono text-[10px] font-bold tracking-widest ${cls}`}
              >
                {label}
              </span>
              {i < 2 && (
                <ArrowRight
                  size={14}
                  className="mx-auto shrink-0 rotate-90 text-neutral-600 sm:rotate-0"
                />
              )}
            </div>
          ))}
        </div>
        <p>
          When a user selects A1, the seat is temporarily locked, for example
          for {LOCK_MINUTES} minutes. During this period other users cannot book
          the seat, the user completes the payment, and the booking process
          continues.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-md border border-white/10 bg-white/[.02] p-3">
            <p className=" text-xs uppercase tracking-widest text-emerald-400">
              Payment succeeds
            </p>
            <p className="mt-2 text-sm text-neutral-200">LOCKED → BOOKED</p>
          </div>
          <div className="rounded-md border border-white/10 bg-white/[.02] p-3">
            <p className="text-xs uppercase tracking-widest text-amber-300">
              Payment fails or lock expires
            </p>
            <p className="mt-2 text-sm text-neutral-200">LOCKED → AVAILABLE</p>
          </div>
        </div>
      </Sec>

      <Sec title="But That's Not the End">
        <p>
          A production-scale ticket booking system has to handle many other
          failure scenarios and high-traffic situations:
        </p>
        <ul className="grid gap-2 sm:grid-cols-2">
          {SCENARIOS.map((s, i) => (
            <li
              key={s}
              className="flex min-w-0 items-baseline gap-3 rounded-md border border-white/10 bg-white/[.02] px-3 py-2.5 md:text-base text-sm font-medium leading-relaxed"
            >
              <span className="font-serif text-xs tracking-widest font-semibold text-neutral-300">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="min-w-0">{s}</span>
            </li>
          ))}
        </ul>
      </Sec>

      <Sec title="Surviving Release Day">
        <p>During a major movie release, three layers work together:</p>
        <div className="grid gap-3 sm:grid-cols-3">
          {SCALE.map(([name, text]) => (
            <div
              key={name}
              className="min-w-0 rounded-md border border-white/10 bg-white/[.02] p-3"
            >
              <h3 className="md:text-base text-sm font-medium leading-relaxed  text-white">
                {name}
              </h3>
              <p className="mt-2 md:text-sm text-xs font-medium leading-relaxed text-neutral-400">
                {text}
              </p>
            </div>
          ))}
        </div>
        <p>
          So behind a simple <B>Select Seat → Pay → Confirm</B> there is a
          system designed to handle <B>concurrency, consistency, failures</B>{" "}
          and <B>massive traffic spikes</B> without selling the same seat twice.
        </p>
      </Sec>

      <Sec title="The Real Challenge">
        <p className="rounded-md border border-primary/50 bg-primary/5 px-4 py-4 text-base font-medium leading-relaxed tracking-wide text-white">
          The real challenge isn't building a ticket-booking application. It's
          keeping the system correct when thousands of users try to do the same
          thing at the same time.
        </p>
        <div className="flex flex-wrap gap-1.5 pt-2">
          {META.hashtags.map((h) => (
            <Tags key={h} name={h} />
          ))}
        </div>
      </Sec>

      <section className="min-w-0 border-b border-white/10">
        <div className="hatch h-6 border-b border-white/10" />
        <div className="flex flex-col items-start justify-between gap-4 px-4 py-6 sm:flex-row sm:items-center sm:px-6">
          <div className="min-w-0">
            <p className="font-serif text-[20px] leading-none text-white">
              Join the Conversation
            </p>
            <p className="mt-2 md:text-sm text-xs font-medium leading-relaxed text-neutral-300">
              This article started as a post on LinkedIn. Share your take there.
            </p>
          </div>
          <Link
            href={META.linkedin}
            target="_blank"
            rel="noreferrer"
            className="inline-flex shrink-0 items-center gap-2 rounded-md bg-white px-4 py-2 text-xs font-semibold text-black"
          >
            <LinkedinIcon size={13} />
            Show post on LinkedIn
            <ArrowUpRight size={12} />
          </Link>
        </div>
      </section>
      <RelatedBlog title="AWS EC2 Production Deployment Guide" href="/blogs/aws-ec2-production-deployment" />
    </article>
  );
}
