// middleware.ts

import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Ignore Next.js internals & static assets
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Country (available on Vercel)
  const country = request.headers.get("x-vercel-ip-country") || "Unknown";

  // City (optional)
  const city = request.headers.get("x-vercel-ip-city") || "";

  // Region (optional)
  const region = request.headers.get("x-vercel-ip-country-region") || "";

  // Client IP
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    request.headers.get("x-real-ip") ||
    "127.0.0.1";

  //   console.log({
  //     page: pathname,
  //     ip,
  //     country,
  //     city,
  //     region,
  //   });
  //   console.log(Object.fromEntries(request.headers.entries()));

  //   try {
  //     await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/visit`, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         page: pathname,
  //         ipHash: ip,
  //         country,
  //         city,
  //         region,
  //       }),
  //     });
  //   } catch (err) {
  //     console.error("Analytics Error:", err);
  //   }

  //   return NextResponse.next();

  const response = NextResponse.next();

  response.cookies.set(
    "visit",
    JSON.stringify({
      page: pathname,
      ipHash: ip,
      country,
      city,
      region,
    }),
    {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // 1 day
    },
  );

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api).*)"],
};
