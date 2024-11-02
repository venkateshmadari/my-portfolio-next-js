import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Venkatesh Madari",
  description: "A Web Developer",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/me.jpg" type="image/jpeg" />
      </head>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {/* <div className="flex flex-col md:flex-row">
            <Sidebar />
            <main className="flex-1 p-4 md:ml-20">{children}</main>
          </div> */}
          <Toaster
            position="top-center"
            toastOptions={{
              style: {
                background: "#D90D3D",
                color: "white",
              },
            }}
            reverseOrder={false}
          />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
