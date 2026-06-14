"use client";
import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export default function TrafficTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Helper to get or create a session ID
    let sessionId = localStorage.getItem("traffic_session_id");
    if (!sessionId) {
      sessionId = crypto.randomUUID();
      localStorage.setItem("traffic_session_id", sessionId);
    }

    const url = pathname + (searchParams?.toString() ? `?${searchParams}` : "");
    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        event_type: "page_view",
        url,
        referrer: document.referrer,
        utm_source: searchParams?.get("utm_source"),
        utm_medium: searchParams?.get("utm_medium"),
        utm_campaign: searchParams?.get("utm_campaign"),
        utm_content: searchParams?.get("utm_content"),
        utm_term: searchParams?.get("utm_term"),
        session_id: sessionId,
      }),
    }).catch(console.error);
  }, [pathname, searchParams]);

  return null;
}