import type { Metadata } from "next";
import { Geist, Geist_Mono, Instrument_Serif, Barlow } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
const mono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });
const serif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-serif",
});
const barlow = Barlow({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-barlow",
});
import { Analytics } from "@vercel/analytics/next";
import { GoogleAnalytics } from "@next/third-parties/google";
import Header from "@/components/Header";
import Closing from "@/components/Closing";

export const metadata: Metadata = {
  title: "Madari Venkatesh",
  description: "Full-Stack Developer portfolio",
  icons: {
    icon: "/profile-2.png",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${mono.variable} ${serif.variable} ${barlow.variable} antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <Header />
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: "#0a0a0a",
              color: "#fff",
              border: "1px solid rgba(255,255,255,.1)",
              fontSize: "12px",
            },
          }}
        />
        <Analytics />
        <Closing />
      </body>
      <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID!} />
    </html>
  );
}
