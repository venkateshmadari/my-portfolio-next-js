import { NextRequest, NextResponse } from "next/server";
import type { NextFetchEvent } from "next/server";

export async function middleware(request: NextRequest, event: NextFetchEvent) {
  const pathname = request.nextUrl.pathname;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  const country = request.headers.get("x-vercel-ip-country") || "Unknown";
  const city = request.headers.get("x-vercel-ip-city") || "";
  const region = request.headers.get("x-vercel-ip-country-region") || "";
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    request.headers.get("x-real-ip") ||
    "127.0.0.1";
  console.log({
    page: pathname,
    ipHash: ip,
    country,
    city,
    region,
  });
  // Fire-and-forget: don't block the response on this
  event.waitUntil(
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/visit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        page: pathname,
        ipHash: ip,
        country,
        city,
        region,
      }),
    }).catch((err) => console.error("Analytics Error:", err)),
  );

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api).*)"],
};
