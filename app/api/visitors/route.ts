import { BetaAnalyticsDataClient } from "@google-analytics/data";
import { NextResponse } from "next/server";

function formatPrivateKey(key: string | undefined) {
  if (!key) return undefined;

  return key.replace(/^"|"$/g, "").replace(/\\n/g, "\n").trim();
}

export async function GET() {
  try {
    const clientEmail = process.env.GA_CLIENT_EMAIL;
    const rawPrivateKey = process.env.GA_PRIVATE_KEY;
    const propertyId = process.env.GA_PROPERTY_ID;

    const privateKey = formatPrivateKey(rawPrivateKey);

    const analyticsDataClient = new BetaAnalyticsDataClient({
      credentials: {
        client_email: clientEmail,
        private_key: privateKey,
      },
    });

    const [response] = await analyticsDataClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [
        {
          startDate: "30daysAgo",
          endDate: "today",
        },
      ],
      metrics: [
        {
          name: "totalUsers",
        },
      ],
    });

    const totalUsers = response.rows?.[0]?.metricValues?.[0]?.value ?? "0";

    return NextResponse.json({
      totalUsers: Number(totalUsers),
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        error: error?.message || "Google Analytics failed",
        code: error?.code,
      },
      { status: 500 },
    );
  }
}
