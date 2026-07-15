import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  const country = request.headers.get("x-vercel-ip-country") || "Unknown";
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0] ||
    "::1";

  const response = NextResponse.next();

  response.cookies.set(
    "analytics-debug",
    JSON.stringify({
      page: pathname,
      country,
      ip,
    }),
    {
      maxAge: 60,
    }
  );

  return response;
}
