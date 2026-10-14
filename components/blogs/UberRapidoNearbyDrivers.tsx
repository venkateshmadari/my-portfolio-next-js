"use client";
import { useState } from "react";
import {
  ArrowDown,
  ArrowDownRight,
  ArrowLeft,
  ArrowUpLeft,
  ArrowUpRight,
  Car,
  Check,
  Copy,
  Flag,
  Hash,
  Map as MapIcon,
  MapPin,
  Ruler,
  User,
  X,
  Zap,
} from "lucide-react";
import Image from "next/image";

/* ───────────── SEO / meta ─────────────
   Keep these strings in sync with `metadata` in app/blogs/<slug>/page.tsx
   (a "use client" file can't export metadata). */
const SEO = {
  title: "How Uber and Rapido Find Nearby Drivers: Geohash, Redis & Haversine",
  description:
    "How ride apps find nearby drivers in milliseconds: Geohash narrows the search, Redis stores live locations and Haversine filters by radius. Worked example included.",
  h1: "How Uber and Rapido Find Nearby Drivers in Real Time",
  date: "2026-10-14",
  dateLabel: "Oct 14, 2026",
  read: "13 min read",
  tags: ["System Design", "Geohash", "Redis", "Haversine"],
  stack: ["Geohash", "Redis", "Haversine", "Node.js", "ngeohash", "GEOSEARCH"],
  relatedHref: "/blogs/book-my-show-hld",
  relatedTitle: "BookMyShow: HLD Breakdown",
  image: "/how-uber-and-rapido-find-nearby-drivers-inside.png",
};

/* ───────────── Types ───────────── */
type Cell = string | { v: string; tone: "ok" | "no" | "hl" };
type FlowItem = { icon?: keyof typeof ICONS; title: string; sub?: string };
type Block =
  | { t: "p"; v: string }
  | { t: "h"; v: string }
  | { t: "ul" | "ol"; v: string[] }
  | { t: "code"; v: string; lang?: string }
  | { t: "note"; v: string; kind?: "note" | "warn" | "tip" }
  | { t: "quote"; v: string }
  | { t: "kv"; rows: [string, string][] }
  | { t: "table"; head: string[]; rows: Cell[][]; minW?: number }
  | { t: "flow"; items: FlowItem[] }
  | { t: "alphabet"; mark: string[] }
  | {
      t: "link";
      href: string;
      label: string;
      text: string;
      dir?: "down" | "up";
    };
type Step = { id?: string; title: string; body: Block[] };

const ICONS = {
  car: Car,
  hash: Hash,
  zap: Zap,
  user: User,
  map: MapIcon,
  pin: MapPin,
  ruler: Ruler,
  check: Check,
  flag: Flag,
};

/* ───────────── Geohash worked example (computed, so the tables can't drift) ───────────── */
const B32 = "0123456789bcdefghjkmnpqrstuvwxyz";
const PICKUP_LAT = 17.400441666657823;
const PICKUP_LON = 78.56072868878287;

function geohashSteps(lat: number, lon: number, bitCount: number) {
  let lonMin = -180,
    lonMax = 180,
    latMin = -90,
    latMax = 90;
  const rows: {
    step: number;
    axis: string;
    range: string;
    mid: number;
    cmp: string;
    bit: 0 | 1;
  }[] = [];
  for (let i = 0; i < bitCount; i++) {
    const isLon = i % 2 === 0;
    const value = isLon ? lon : lat;
    const lo = isLon ? lonMin : latMin;
    const hi = isLon ? lonMax : latMax;
    const mid = (lo + hi) / 2;
    const bit: 0 | 1 = value >= mid ? 1 : 0;
    rows.push({
      step: i + 1,
      axis: isLon ? "Longitude" : "Latitude",
      range: `${lo} to ${hi}`,
      mid,
      cmp: `${value.toFixed(4)} ${bit ? "≥" : "<"} ${mid}`,
      bit,
    });
    if (isLon) {
      if (bit) lonMin = mid;
      else lonMax = mid;
    } else if (bit) latMin = mid;
    else latMax = mid;
  }
  return rows;
}

const STEP_ROWS = geohashSteps(PICKUP_LAT, PICKUP_LON, 30);
const BIT_STRING = STEP_ROWS.map((r) => r.bit).join("");
const GROUPS = Array.from({ length: 6 }, (_, k) => {
  const bits = BIT_STRING.slice(k * 5, k * 5 + 5);
  const parts = [16, 8, 4, 2, 1].filter((_, i) => bits[i] === "1");
  const dec = parts.reduce((a, b) => a + b, 0);
  return { bits, calc: parts.join(" + "), dec, ch: B32[dec] };
});
const HASH = GROUPS.map((g) => g.ch).join(""); // "tepfgx"

/* ───────────── Code samples ───────────── */
const REDIS_CMDS = `# longitude first, then latitude
GEOADD drivers:online 78.54825 17.41232 driver:A
GEOADD drivers:online 78.59361 17.40694 driver:B
GEOADD drivers:online 78.60995 17.39912 driver:C
GEOADD drivers:online 78.52963 17.42066 driver:D

# drivers within 2 km of the pickup, nearest first
GEOSEARCH drivers:online FROMLONLAT 78.56073 17.40044 BYRADIUS 2 km ASC WITHDIST

# 1) "driver:A"
# 2) "1.8707"`;

const HAVERSINE_JS = `function haversineKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's mean radius in km
  const toRad = (deg) => (deg * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;

  return 2 * R * Math.asin(Math.sqrt(a));
}

// pickup -> Driver C
haversineKm(17.40044, 78.56073, 17.39912, 78.60995); // 5.2246 km  (excluded)
// pickup -> Driver A
haversineKm(17.40044, 78.56073, 17.41232, 78.54825); // 1.8704 km  (kept)`;

const NGEOHASH_JS = `// npm i ngeohash
const ngeohash = require("ngeohash");

const latitude = 17.400441666657823;
const longitude = 78.56072868878287;

const geohash = ngeohash.encode(latitude, longitude, 6);
console.log(geohash); // tepfgx

console.log(ngeohash.decode(geohash));
// { latitude: 17.39959..., longitude: 78.55773..., error: {...} }
// the centre of the Geohash cell, not your exact point

console.log(ngeohash.neighbors("tepfg"));
// the 8 cells around a 5-character cell:
// [ 'tepg5', 'tepgh', 'tepfu', 'tepfs', 'tepfe', 'tepfd', 'tepff', 'tepg4' ]`;

/* ───────────── Content ───────────── */
const STEPS: Step[] = [
  {
    title: "The problem: finding nearby drivers",
    body: [
      {
        t: "p",
        v: "Imagine you book a ride in Hyderabad. There are thousands of drivers online across the city. How does the backend find drivers near you within seconds, without checking every driver's location one by one?",
      },
      { t: "p", v: "Every driver continuously shares their GPS coordinates:" },
      { t: "ul", v: ["Latitude", "Longitude"] },
      {
        t: "p",
        v: "If the backend calculated the distance between the passenger and every online driver for every ride request, the computation would become expensive as the number of drivers grows. We need a way to narrow down the search before calculating distances.",
      },
      {
        t: "p",
        v: "That's where Geohash helps. In this article you'll see how Geohash, Redis and the Haversine formula work together.",
      },
    ],
  },
  {
    title: "How does Geohash work?",
    body: [
      {
        t: "p",
        v: "Geohash divides the Earth's surface into rectangular grid cells and represents each cell using a string of characters. For example, our passenger's pickup location is:",
      },
      {
        t: "kv",
        rows: [
          ["Pickup", "17.40044, 78.56073"],
          ["Pickup Geohash", "tepfgx"],
        ],
      },
      {
        t: "link",
        label: "Deep dive",
        text: "Check how these coordinates convert into the Geohash tepfgx, bit by bit",
        href: "#geohash-conversion",
      },
      { t: "p", v: "Suppose four drivers have the following locations:" },
      {
        t: "table",
        head: ["Driver", "Latitude, Longitude", "Geohash"],
        rows: [
          ["Driver A", "17.41232, 78.54825", "tepg53"],
          ["Driver B", "17.40694, 78.59361", "tepgh2"],
          ["Driver C", "17.39912, 78.60995", "tepfuz"],
          ["Driver D", "17.42066, 78.52963", "tepg4g"],
        ],
        minW: 420,
      },
      {
        t: "p",
        v: "Each driver belongs to a Geohash cell based on their coordinates. Instead of searching across the entire city, the backend can search the pickup cell and the relevant neighbouring cells. This significantly reduces the number of driver locations that need to be considered.",
      },
    ],
  },
  {
    title: "Where does Redis come in?",
    body: [
      {
        t: "p",
        v: "A real-time driver-tracking system needs fast access to frequently changing GPS locations. Redis can store each driver's latest location and associated Geohash. Whenever a driver sends a new GPS update, the backend updates their location in Redis.",
      },
      { t: "p", v: "When a passenger requests a ride, the backend:" },
      {
        t: "ol",
        v: [
          "Reads the pickup coordinates.",
          "Identifies the pickup Geohash cell.",
          "Searches the cells that cover the requested search radius.",
          "Retrieves candidate drivers from those cells.",
          "Calculates the actual distance to each candidate.",
          "Filters out drivers outside the requested radius.",
        ],
      },
      {
        t: "note",
        kind: "warn",
        v: "Redis is the fast storage layer in this example. The system also needs a suitable spatial or Geohash-based index to retrieve nearby candidates efficiently.",
      },
      {
        t: "p",
        v: "Redis ships with exactly that kind of index: the GEO commands. `GEOADD` stores each driver in a sorted set, using a Geohash-derived score, and `GEOSEARCH` (Redis 6.2+) returns the members inside a radius. Note that Redis takes longitude first.",
      },
      { t: "code", lang: "redis-cli", v: REDIS_CMDS },
      {
        t: "p",
        v: "Redis does the radius filtering for you here. The rest of this article shows what that filtering actually means.",
      },
    ],
  },
  {
    title: "Why do we need neighbouring Geohash cells?",
    body: [
      {
        t: "p",
        v: "Our pickup Geohash is `tepfgx`, but Driver A's Geohash is `tepg53`. They are different strings, yet Driver A is close to the pickup location.",
      },
      {
        t: "p",
        v: "This is an important property of Geohash: two geographically close points can belong to different cells, especially when they lie on opposite sides of a cell boundary. Searching only the exact pickup cell can therefore miss nearby drivers. The backend must search the relevant neighbouring cells as well.",
      },
      {
        t: "p",
        v: "Also, sharing a Geohash prefix does not guarantee that two locations are close. A prefix can help narrow a search, but it cannot replace a proper radius search. Compare Driver A and Driver C against the pickup `tepfgx`:",
      },
      {
        t: "table",
        head: ["Driver", "Geohash", "Shared prefix", "Actual distance"],
        rows: [
          ["Driver A", "tepg53", "tep (3 characters)", "1.87 km"],
          ["Driver C", "tepfuz", "tepf (4 characters)", "5.22 km"],
        ],
        minW: 480,
      },
      {
        t: "p",
        v: "`tepf` identifies a four-character grid cell. Both the pickup location and Driver C fall inside it. `tepg` is a different four-character cell, and Driver A falls in that one. Think of Geohash cells as squares on a map: two points on opposite sides of a boundary can be very close even though their Geohashes differ, while two points inside the same larger square can be several kilometres apart.",
      },
      {
        t: "note",
        kind: "tip",
        v: "Choose the precision to match your radius. A 6-character cell here is only about 1.17 km wide and 0.61 km tall, so the 8 neighbours of `tepfgx` do not include Driver A's cell `tepg53`, even though Driver A is 1.87 km away. With 5 characters (cells of about 4.7 × 4.9 km), the pickup cell `tepfg` and its 8 neighbours (`tepfd`, `tepfe`, `tepff`, `tepfs`, `tepfu`, `tepg4`, `tepg5`, `tepgh`) cover all four drivers, and the distance filter then keeps only Driver A.",
      },
      { t: "p", v: "So the correct approach in your application is:" },
      {
        t: "ol",
        v: [
          "Encode the user's coordinates with `ngeohash`.",
          "Use Geohash prefixes and neighbouring cells to narrow the search.",
          "Calculate the actual distance to the candidate locations.",
          "Sort by distance and return the nearest one.",
        ],
      },
      {
        t: "p",
        v: "Don't sort Geohash strings alphabetically, and don't pick the one with the longest matching prefix. Geohash organises and filters locations. The actual distance calculation decides which one is nearest.",
      },
    ],
  },
  {
    title: "How do we calculate the actual distance?",
    body: [
      {
        t: "p",
        v: "Finding candidate drivers is only the first step. Suppose the passenger wants a driver within a 2 km radius. Let's calculate the distance to Driver C.",
      },
      {
        t: "kv",
        rows: [
          ["Pickup coordinates", "17.40044, 78.56073"],
          ["Driver C coordinates", "17.39912, 78.60995"],
        ],
      },
      { t: "p", v: "The coordinate differences are approximately:" },
      {
        t: "ul",
        v: [
          "Latitude: 0.00132° ≈ 0.147 km",
          "Longitude: 0.04922° ≈ 5.22 km east-west at this latitude",
        ],
      },
      {
        t: "p",
        v: "The backend uses a geographical distance formula, such as the Haversine formula, to calculate the straight-line distance between the two coordinates. The calculated distance is approximately 5.22 km.",
      },
      {
        t: "link",
        label: "Deep dive",
        text: "See the full Haversine calculation for Driver C, step by step",
        href: "#haversine-calculation",
      },
      {
        t: "p",
        v: "The requested radius is 2 km, so Driver C is excluded. Now consider Driver A. The calculated distance between the pickup location and Driver A is approximately 1.87 km. Since 1.87 km is less than 2 km, Driver A passes the distance filter.",
      },
      {
        t: "note",
        v: "Haversine gives the straight-line (great-circle) distance, not the road distance. It is a fast way to filter candidates. Road distance and ETA come from a routing service afterwards.",
      },
    ],
  },
  {
    title: "What happens to the drivers?",
    body: [
      {
        t: "p",
        v: "Here is the result after calculating the distances using the coordinates above, with a 2 km radius:",
      },
      {
        t: "table",
        head: ["Driver", "Geohash", "Approx. distance", "Result"],
        rows: [
          ["A", "tepg53", "1.87 km", { v: "Keep", tone: "ok" }],
          ["B", "tepgh2", "3.56 km", { v: "Exclude", tone: "no" }],
          ["C", "tepfuz", "5.22 km", { v: "Exclude", tone: "no" }],
          ["D", "tepg4g", "3.99 km", { v: "Exclude", tone: "no" }],
        ],
        minW: 440,
      },
      {
        t: "p",
        v: "The system keeps Driver A as a candidate because the driver is within the requested 2 km radius. The other drivers are excluded because they are farther away.",
      },
      {
        t: "p",
        v: "In a real implementation, drivers whose cells cannot intersect the search area can be eliminated before their exact distances are calculated.",
      },
    ],
  },
  {
    title: "The complete system design flow",
    body: [
      {
        t: "flow",
        items: [
          { icon: "car", title: "Driver GPS location" },
          { icon: "hash", title: "Convert coordinates to Geohash" },
          { icon: "zap", title: "Update the latest location in Redis" },
          { icon: "user", title: "Passenger requests a ride" },
          {
            icon: "map",
            title: "Search the pickup cell and relevant neighbouring cells",
          },
          { icon: "pin", title: "Retrieve candidate drivers" },
          {
            icon: "ruler",
            title: "Calculate the actual distance using Haversine",
          },
          { icon: "check", title: "Apply the requested radius filter" },
          { icon: "flag", title: "Rank eligible drivers and match a driver" },
        ],
      },
      { t: "h", v: "Key takeaway" },
      { t: "p", v: "Each component has a different responsibility:" },
      {
        t: "table",
        head: ["Component", "Responsibility"],
        rows: [
          ["Geohash", "Narrows the geographical search area."],
          [
            "Redis",
            "Provides fast access to frequently updated driver locations.",
          ],
          [
            "Haversine formula",
            "Calculates the approximate straight-line distance between two GPS coordinates.",
          ],
          [
            "Radius filter",
            "Removes candidates outside the requested distance.",
          ],
        ],
        minW: 460,
      },
      {
        t: "quote",
        v: "Don't calculate the distance to every driver first. Narrow down the candidates geographically, then calculate their actual distances.",
      },
      {
        t: "p",
        v: "Together, these techniques make an efficient nearby-driver discovery system, and a useful building block for ride-hailing platforms, delivery applications and other real-time location-based systems.",
      },
      { t: "h", v: "In short" },
      {
        t: "flow",
        items: [
          {
            title: "Drivers send GPS coordinates",
            sub: "Latitude + longitude",
          },
          {
            title: "Convert to Geohash and update Redis",
            sub: "Store each driver's latest location",
          },
          {
            title: "Passenger requests a ride",
            sub: "Pickup coordinates → tepfgx",
          },
          {
            title: "Search the relevant Geohash cells",
            sub: "Retrieve nearby driver candidates",
          },
          {
            title: "Calculate distance and filter",
            sub: "Keep suitable drivers within the radius",
          },
          { title: "Match an available driver", sub: "Send the ride request" },
        ],
      },
    ],
  },
  {
    id: "haversine-calculation",
    title: "Haversine calculation, step by step",
    body: [
      {
        t: "p",
        v: "Here is the complete Haversine calculation for Driver C, using the exact pickup and driver coordinates.",
      },
      { t: "h", v: "1. Given coordinates" },
      {
        t: "kv",
        rows: [
          ["Pickup latitude φ₁", "17.40044"],
          ["Pickup longitude λ₁", "78.56073"],
          ["Driver C latitude φ₂", "17.39912"],
          ["Driver C longitude λ₂", "78.60995"],
          ["Earth's mean radius R", "6371 km"],
        ],
      },
      { t: "h", v: "2. Calculate the coordinate differences" },
      {
        t: "code",
        lang: "formula",
        v: "Δφ = φ₂ − φ₁ = 17.39912 − 17.40044 = −0.00132°\nΔλ = λ₂ − λ₁ = 78.60995 − 78.56073 = 0.04922°",
      },
      { t: "h", v: "3. Convert degrees into radians" },
      {
        t: "p",
        v: "The Haversine formula needs radians, not degrees. Radians = degrees × π / 180.",
      },
      {
        t: "code",
        lang: "formula",
        v: "Δφ = −0.00132 × π/180 ≈ −0.0000230383\nΔλ =  0.04922 × π/180 ≈  0.00085905\nφ₁ = 17.40044 × π/180 ≈  0.303695\nφ₂ = 17.39912 × π/180 ≈  0.303672",
      },
      { t: "h", v: "4. Apply the Haversine formula" },
      {
        t: "code",
        lang: "formula",
        v: "a = sin²(Δφ / 2) + cos(φ₁) · cos(φ₂) · sin²(Δλ / 2)",
      },
      { t: "p", v: "Calculate each part." },
      {
        t: "code",
        lang: "formula",
        v: "Part A (latitude component)\n  Δφ / 2 = −0.0000115192\n  sin²(−0.0000115192) ≈ 1.3269 × 10⁻¹⁰\n\nPart B (longitude component)\n  Δλ / 2 = 0.00042953\n  sin²(0.00042953) ≈ 1.8449 × 10⁻⁷\n\nPart C (cosines)\n  cos(0.303695) ≈ 0.954238\n  cos(0.303672) ≈ 0.954245\n  cos(φ₁) · cos(φ₂) ≈ 0.910577\n  0.910577 × 1.8449 × 10⁻⁷ ≈ 1.6799 × 10⁻⁷\n\nPart D (add both components)\n  a ≈ 1.3269 × 10⁻¹⁰ + 1.6799 × 10⁻⁷\n  a ≈ 1.6813 × 10⁻⁷",
      },
      { t: "h", v: "5. Calculate the distance" },
      {
        t: "code",
        lang: "formula",
        v: "d = 2R · arcsin(√a)\n\n√a = √(1.6813 × 10⁻⁷) ≈ 0.00041003\narcsin(0.00041003) ≈ 0.00041003   (for tiny angles, arcsin(x) ≈ x)\n\nd = 2 × 6371 × 0.00041003\nd ≈ 5.22 km",
      },
      { t: "h", v: "6. Apply the 2 km radius filter" },
      {
        t: "p",
        v: "The actual distance is approximately 5.22 km and the requested radius is 2 km. Since 5.22 > 2, Driver C is excluded.",
      },
      {
        t: "note",
        v: "Intermediate values above are rounded for readability. With full-precision values the result is 5.2246 km.",
      },
      { t: "h", v: "The same calculation in JavaScript" },
      { t: "code", lang: "javascript", v: HAVERSINE_JS },
      {
        t: "link",
        dir: "up",
        label: "Back to the article",
        text: "Return to “How do we calculate the actual distance?”",
        href: "#step-5",
      },
    ],
  },
  {
    id: "geohash-conversion",
    title: "Geohash encoding, bit by bit",
    body: [
      {
        t: "p",
        v: "Let's convert the pickup location into the Geohash `tepfgx` step by step, showing every range division, every binary bit and every character.",
      },
      { t: "h", v: "How Geohash turns coordinates into characters" },
      {
        t: "p",
        v: "Geohash uses a special Base32 alphabet. There are 32 characters, and the letters `a`, `i`, `l` and `o` are excluded. The characters used by our pickup Geohash are highlighted.",
      },
      { t: "alphabet", mark: HASH.split("") },
      {
        t: "ul",
        v: [
          "Each character represents 5 binary bits.",
          "The algorithm generates bits by dividing geographic ranges in half, alternating between longitude and latitude.",
          "Longitude starts in the range [−180, 180]. Latitude starts in the range [−90, 90].",
          "If the coordinate is in the upper half, write `1`. Otherwise write `0`. Then repeat with the smaller range.",
          "Group every 5 bits and convert each group to one Base32 character.",
        ],
      },
      {
        t: "p",
        v: "A six-character Geohash therefore represents 30 bits: 15 for longitude and 15 for latitude.",
      },
      { t: "h", v: "The input" },
      {
        t: "kv",
        rows: [
          ["Latitude", "17.400441666657823"],
          ["Longitude", "78.56072868878287"],
        ],
      },
      {
        t: "p",
        v: "These are the full-precision coordinates. The rounded pickup `17.40044, 78.56073` used earlier produces the same Geohash.",
      },
      { t: "h", v: "Step A: divide the ranges" },
      {
        t: "p",
        v: "Initially, longitude runs from −180 to +180 and latitude from −90 to +90. The first longitude midpoint is (−180 + 180) / 2 = 0. The longitude 78.5607 is greater than 0, so the first bit is `1` and the algorithm keeps the upper half, 0 to 180.",
      },
      {
        t: "p",
        v: "Next it divides latitude at 0. The latitude 17.4004 is greater than 0, so the second bit is also `1`. The algorithm keeps alternating longitude and latitude, halving the selected range each time.",
      },
      { t: "h", v: "Every one of the 30 divisions" },
      {
        t: "ol",
        v: [
          "Calculate the midpoint: (minimum + maximum) / 2.",
          "If the coordinate is greater than or equal to the midpoint, output `1` and keep the upper half. Otherwise output `0` and keep the lower half.",
          "Alternate longitude, latitude, longitude, latitude until 30 bits are produced.",
        ],
      },
      {
        t: "table",
        head: ["Step", "Axis", "Range before", "Midpoint", "Comparison", "Bit"],
        rows: STEP_ROWS.map((r) => [
          String(r.step),
          r.axis,
          r.range,
          String(r.mid),
          r.cmp,
          { v: String(r.bit), tone: "hl" as const },
        ]),
        minW: 640,
      },
      { t: "h", v: "Step B: combine all 30 bits" },
      {
        t: "p",
        v: "Take the bit from every row, in order, without changing anything:",
      },
      { t: "code", lang: "bits", v: BIT_STRING },
      {
        t: "p",
        v: "Split it into groups of five bits. Why five? Because 2⁵ = 32, so five bits can represent exactly 32 different values, from 0 to 31.",
      },
      { t: "code", lang: "groups", v: GROUPS.map((g) => g.bits).join("  ") },
      { t: "h", v: "Step C: convert each group to a character" },
      {
        t: "p",
        v: "In a five-bit group the place values are 16, 8, 4, 2 and 1. For example, `11001` = 1×16 + 1×8 + 0×4 + 0×2 + 1×1 = 25. In the Base32 alphabet above, index 25 is `t`. Do the same for all six groups:",
      },
      {
        t: "table",
        head: ["Group", "Bits", "Calculation", "Decimal", "Character"],
        rows: GROUPS.map((g, i) => [
          String(i + 1),
          g.bits,
          g.calc,
          String(g.dec),
          { v: g.ch, tone: "hl" as const },
        ]),
        minW: 520,
      },
      {
        t: "p",
        v: `Join the characters in the same order and the final Geohash is \`${HASH}\`: 30 bits, 6 groups, 6 characters.`,
      },
      { t: "h", v: "Verify it with ngeohash" },
      { t: "code", lang: "javascript", v: NGEOHASH_JS },
      {
        t: "p",
        v: "The package performs the same repeated range divisions and Base32 conversion internally.",
      },
      {
        t: "note",
        kind: "tip",
        v: "The letters are labels assigned to five-bit binary values. They are not chosen by the spelling of a place or by distance. Geohash encodes a position inside a grid, and the actual distance must be calculated separately.",
      },
      {
        t: "link",
        dir: "up",
        label: "Back to the article",
        text: "Return to “How does Geohash work?”",
        href: "#step-2",
      },
    ],
  },
];

/* ───────────── UI ───────────── */
const rich = (s: string) =>
  s.split(/(`[^`]+`)/g).map((p, i) => {
    if (p.length > 1 && p.startsWith("`") && p.endsWith("`")) {
      const text = p.slice(1, -1);
      return /^https?:\/\//.test(text) ? (
        <a
          key={i}
          href={text}
          target="_blank"
          rel="noreferrer"
          className="break-all rounded bg-white/10 px-1 py-0.5 font-mono text-[11px] text-white underline underline-offset-2 hover:bg-white/20"
        >
          {text}
        </a>
      ) : (
        <code
          key={i}
          className="break-words rounded bg-white/10 px-1 py-0.5 font-mono text-[11px] text-neutral-100"
        >
          {text}
        </code>
      );
    }
    return <span key={i}>{p}</span>;
  });

function Code({ v, lang }: { v: string; lang?: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(v);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {}
  };
  return (
    <div
      data-code
      className="min-w-0 overflow-hidden rounded-md border border-white/10 bg-black/40"
    >
      <div className="flex items-center justify-between gap-3 border-b border-white/10 px-3 py-1.5 font-mono text-[9px] text-neutral-400">
        <span className="min-w-0 truncate">{lang ?? "bash"}</span>
        <button
          type="button"
          data-copy
          onClick={copy}
          className="flex shrink-0 items-center gap-1 hover:text-white"
        >
          {copied ? <Check size={10} /> : <Copy size={10} />}
          <span data-copy-label>{copied ? "Copied" : "Copy"}</span>
        </button>
      </div>
      <pre className="overflow-x-auto p-3 font-mono text-[11px] leading-[18px] text-neutral-200">
        <code>{v}</code>
      </pre>
    </div>
  );
}

const NOTE = {
  note: ["NOTE", "text-neutral-400"],
  tip: ["TIP", "text-emerald-400"],
  warn: ["IMPORTANT", "text-amber-300"],
} as const;

function CellView({ c }: { c: Cell }) {
  if (typeof c === "string") return <>{c}</>;
  if (c.tone === "ok")
    return (
      <span className="inline-flex items-center gap-1 text-emerald-400">
        <Check size={11} />
        {c.v}
      </span>
    );
  if (c.tone === "no")
    return (
      <span className="inline-flex items-center gap-1 text-rose-400">
        <X size={11} />
        {c.v}
      </span>
    );
  return <span className="font-bold text-white">{c.v}</span>;
}

function Blocks({ items }: { items: Block[] }) {
  return (
    <div className="min-w-0 space-y-4">
      {items.map((b, i) => {
        switch (b.t) {
          case "p":
            return <p key={i}>{rich(b.v)}</p>;
          case "h":
            return (
              <h3
                key={i}
                className="pt-2 font-mono text-[10px] font-bold uppercase tracking-widest text-neutral-200"
              >
                {b.v}
              </h3>
            );
          case "ul":
          case "ol": {
            const List = b.t;
            return (
              <List
                key={i}
                className={`space-y-2 pl-5 ${b.t === "ol" ? "list-decimal" : "list-disc"} marker:text-neutral-600`}
              >
                {b.v.map((li, j) => (
                  <li key={j}>{rich(li)}</li>
                ))}
              </List>
            );
          }
          case "code":
            return <Code key={i} v={b.v} lang={b.lang} />;
          case "note": {
            const [label, color] = NOTE[b.kind ?? "note"];
            return (
              <div
                key={i}
                className="rounded-md border border-white/10 bg-white/[.02] px-3 py-2.5 text-[12px] leading-[19px] text-neutral-400"
              >
                <span
                  className={`mr-2 font-mono text-[9px] font-bold tracking-widest ${color}`}
                >
                  {label}
                </span>
                {rich(b.v)}
              </div>
            );
          }
          case "quote":
            return (
              <div
                key={i}
                className="rounded-md border border-white/10 bg-white/[.02] px-4 py-4 font-serif text-[18px] leading-[1.3] text-white"
              >
                {b.v}
              </div>
            );
          case "kv":
            return (
              <dl
                key={i}
                className="min-w-0 divide-y divide-white/10 overflow-hidden rounded-md border border-white/10 bg-white/[.02]"
              >
                {b.rows.map(([k, v]) => (
                  <div
                    key={k}
                    className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 px-3 py-2.5"
                  >
                    <dt className="font-mono text-[9px] uppercase tracking-widest text-neutral-400">
                      {k}
                    </dt>
                    <dd className="min-w-0 break-words font-mono text-[12px] text-white">
                      {v}
                    </dd>
                  </div>
                ))}
              </dl>
            );
          case "table":
            return (
              <div
                key={i}
                className="min-w-0 overflow-x-auto rounded-md border border-white/10"
              >
                <table
                  className="w-full border-collapse text-left text-[11px] leading-[17px]"
                  style={{ minWidth: b.minW ?? 460 }}
                >
                  <thead>
                    <tr className="border-b border-white/10 bg-white/[.03] font-mono text-[9px] uppercase tracking-widest text-neutral-400">
                      {b.head.map((h) => (
                        <th key={h} className="px-3 py-2 font-normal">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {b.rows.map((r, ri) => (
                      <tr
                        key={ri}
                        className="border-b border-white/10 last:border-0"
                      >
                        {r.map((cell, j) => (
                          <td
                            key={j}
                            className={`px-3 py-2.5 ${j === 0 ? "font-mono text-white" : "text-neutral-400"}`}
                          >
                            <CellView c={cell} />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          case "flow":
            return (
              <ol key={i} className="min-w-0">
                {b.items.map((it, j) => {
                  const Icon = it.icon ? ICONS[it.icon] : null;
                  return (
                    <li key={j}>
                      <div className="flex items-start gap-3 rounded-md border border-white/10 bg-white/[.02] px-3 py-2.5">
                        {Icon ? (
                          <Icon
                            size={14}
                            className="mt-0.5 shrink-0 text-neutral-400"
                          />
                        ) : (
                          <span className="mt-0.5 w-3.5 shrink-0 text-center font-mono text-[10px] text-neutral-600">
                            {j + 1}
                          </span>
                        )}
                        <div className="min-w-0">
                          <p className="text-[12px] font-semibold leading-[18px] text-white">
                            {it.title}
                          </p>
                          {it.sub && (
                            <p className="mt-0.5 text-[11px] leading-[17px] text-neutral-400">
                              {it.sub}
                            </p>
                          )}
                        </div>
                      </div>
                      {j < b.items.length - 1 && (
                        <div className="flex justify-center py-1 text-neutral-600">
                          <ArrowDown size={12} />
                        </div>
                      )}
                    </li>
                  );
                })}
              </ol>
            );
          case "alphabet":
            return (
              <div
                key={i}
                className="grid grid-cols-8 gap-1 sm:grid-cols-[repeat(16,minmax(0,1fr))]"
              >
                {B32.split("").map((ch, idx) => {
                  const on = b.mark.includes(ch);
                  return (
                    <div
                      key={ch}
                      className={`flex flex-col items-center rounded border py-1.5 ${on ? "border-emerald-400/40 bg-emerald-400/10" : "border-white/10 bg-white/[.02]"}`}
                    >
                      <span className="font-mono text-[8px] text-neutral-600">
                        {idx}
                      </span>
                      <span
                        className={`font-mono text-[13px] ${on ? "font-bold text-emerald-300" : "text-neutral-300"}`}
                      >
                        {ch}
                      </span>
                    </div>
                  );
                })}
              </div>
            );
          case "link": {
            const Icon = b.dir === "up" ? ArrowUpLeft : ArrowDownRight;
            return (
              <a
                key={i}
                href={b.href}
                className="group flex min-w-0 items-start justify-between gap-3 rounded-md border border-white/10 bg-white/[.02] px-3 py-3 transition-colors hover:border-white/25 hover:bg-white/[.04]"
              >
                <span className="min-w-0">
                  <span className="block font-mono text-[9px] uppercase tracking-widest text-neutral-400">
                    {b.label}
                  </span>
                  <span className="mt-1 block text-[12px] leading-[19px] text-neutral-200">
                    {b.text}
                  </span>
                </span>
                <Icon
                  size={14}
                  className="mt-0.5 shrink-0 text-neutral-400 group-hover:text-white"
                />
              </a>
            );
          }
        }
      })}
    </div>
  );
}

/* ───────────── Page ───────────── */
export default function UberRapidoNearbyDrivers() {
  const sectionId = (s: Step, i: number) => s.id ?? `step-${i + 1}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: SEO.title,
    description: SEO.description,
    datePublished: SEO.date,
    dateModified: SEO.date,
    author: { "@type": "Person", name: "Madari Venkatesh" },
    keywords: SEO.tags.join(", "),
  };
  return (
    <article className="min-w-0">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <header className="border-b border-white/10">
        <div className="hatch h-6 border-b border-white/10" />
        <div className="px-4 py-8 sm:px-6">
          <a
            href="/blogs"
            className="inline-flex items-center gap-1.5 font-mono text-[10px] text-neutral-400 hover:text-white"
          >
            <ArrowLeft size={12} /> All articles
          </a>
          <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[10px] text-neutral-400">
            <time dateTime={SEO.date}>{SEO.dateLabel}</time>
            <span>·</span>
            <span>{SEO.read}</span>
          </div>
          <h1 className="mt-3 font-serif text-[32px] leading-[1.1] text-white sm:text-[42px]">
            {SEO.h1}
          </h1>
          <p className="mt-4 text-[13px] leading-[22px] text-neutral-300">
            {SEO.description}
          </p>
          {/* <div className="mt-5 flex flex-wrap gap-1">
            {SEO.tags.map((t) => (<span key={t} className="rounded border border-white/10 px-1.5 py-0.5 font-mono text-[8px] text-neutral-400">{t}</span>))}
          </div> */}
        </div>
        <div className="border-t border-white/10 px-4 py-5 sm:px-6">
          <p className="font-mono text-[9px] uppercase tracking-widest text-neutral-400">
            What you&apos;ll use
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {SEO.stack.map((s) => (
              <span
                key={s}
                className="rounded border border-white/10 px-1.5 py-0.5 font-mono text-[11px] text-neutral-300"
              >
                {s}
              </span>
            ))}
          </div>
        </div>
        <div className="border-t border-white/10 p-4 sm:p-6">
          <a
            href={SEO.image}
            target="_blank"
            rel="noreferrer"
            className="group block min-w-0 rounded-md border border-white/10 bg-white/[.02] p-3"
          >
            <div className="relative aspect-[3/2] w-full overflow-hidden rounded-sm bg-neutral-900">
              <Image
                src={SEO.image}
                alt={"Architecture diagram"}
                fill
                sizes="(min-width: 720px) 640px, 100vw"
                priority
                className="object-contain"
              />
            </div>
            <div className="mt-3 flex items-center justify-between gap-3 font-mono text-[9px] text-neutral-400 group-hover:text-white">
              <span>Fig. 1: Architecture diagram</span>
              <span className="flex shrink-0 items-center gap-1">
                Open full size <ArrowUpRight size={10} />
              </span>
            </div>
          </a>
        </div>
      </header>

      <nav aria-label="On this page" className="border-b border-white/10">
        <div className="hatch h-6 border-b border-white/10" />
        <div className="px-4 py-3 sm:px-6">
          <h2 className="font-serif text-[22px] leading-none text-white">
            On This Page
          </h2>
        </div>
        <ol className="grid gap-x-6 gap-y-1.5 border-t border-white/10 px-4 py-4 font-mono text-[11px] text-neutral-430 sm:grid-cols-2 sm:px-6">
          {STEPS.map((s, i) => (
            <li key={s.title} className="min-w-0">
              <a
                href={`#${sectionId(s, i)}`}
                className="flex gap-2 hover:text-white"
              >
                <span className="text-neutral-600">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="truncate">{s.title}</span>
              </a>
            </li>
          ))}
        </ol>
      </nav>

      {STEPS.map((s, i) => (
        <section
          key={s.title}
          id={sectionId(s, i)}
          className="min-w-0 scroll-mt-12 border-b border-white/10"
        >
          <div className="hatch h-6 border-b border-white/10" />
          <div className="flex items-baseline gap-3 border-b border-white/10 px-4 py-3 sm:px-6">
            <span className="font-mono text-[10px] text-neutral-400">
              {String(i + 1).padStart(2, "0")}
            </span>
            <h2 className="min-w-0 font-serif text-[22px] leading-[1.15] text-white">
              {s.title}
            </h2>
          </div>
          <div className="px-4 py-5 text-[13px] leading-[22px] text-neutral-300 sm:px-6">
            <Blocks items={s.body} />
          </div>
        </section>
      ))}

      <section className="min-w-0 border-b border-white/10">
        <div className="hatch h-6 border-b border-white/10" />
        <div className="flex flex-col items-start justify-between gap-4 px-4 py-6 sm:flex-row sm:items-center sm:px-6">
          <div className="min-w-0">
            <p className="font-mono text-[9px] uppercase tracking-widest text-neutral-400">
              Related article
            </p>
            <p className="mt-2 font-serif text-[20px] leading-[1.15] text-white">
              {SEO.relatedTitle}
            </p>
          </div>
          <a
            href={SEO.relatedHref}
            className="inline-flex shrink-0 items-center gap-2 rounded-md bg-white px-4 py-2 text-[11px] font-semibold text-black"
          >
            Read next <ArrowUpRight size={12} />
          </a>
        </div>
        <div className="border-t border-white/10 px-4 py-4 sm:px-6">
          <a
            href="/blogs"
            className="inline-flex items-center gap-1.5 font-mono text-[10px] text-neutral-400 hover:text-white"
          >
            <ArrowLeft size={12} /> Back to all articles
          </a>
        </div>
      </section>
    </article>
  );
}
