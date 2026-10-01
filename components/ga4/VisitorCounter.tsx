"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Section from "@/components/Section";

export default function VisitorCounter() {
  const [visitors, setVisitors] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    async function fetchVisitors() {
      try {
        const { data } = await axios.get<{ totalUsers: number }>(
          "/api/visitors",
        );
        setVisitors(data.totalUsers);
      } catch (err) {
        console.error("Failed to load visitor count:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    fetchVisitors();
  }, []);

  return (
    <Section
      id="visitors"
      title="Total Visitors"
      right={
        <span className="font-mono text-[9px] text-neutral-500">
          since Oct 1, 2026
        </span>
      }
    >
      <div className="flex flex-col items-center justify-center px-4 py-10 sm:px-6 gap-4">
        <p className="mt-2 font-serif text-[48px] leading-none text-white">
          {loading ? (
            <span className="animate-pulse text-neutral-600">...</span>
          ) : error ? (
            <span className="font-mono text-[11px] text-red-400">
              Couldn't load count
            </span>
          ) : (
            visitors?.toLocaleString()
          )}
        </p>
        <p className="font-mono text-[9px] uppercase tracking-widest text-neutral-500">
          Powered by GA4
        </p>
      </div>
    </Section>
  );
}
