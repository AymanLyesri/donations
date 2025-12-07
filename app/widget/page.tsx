"use client";

import { useEffect, useState } from "react";
import DonationCard from "@/components/DonationCard";

export default function WidgetPage() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Set initial theme from URL before rendering
    const params = new URLSearchParams(window.location.search);
    const theme = params.get("theme");
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
      document.documentElement.style.colorScheme = "dark";
    } else {
      document.documentElement.style.colorScheme = "light";
    }

    // Mark as ready to prevent flash
    setIsReady(true);

    // Listen for theme messages from parent
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === "SET_THEME") {
        document.documentElement.classList.toggle(
          "dark",
          event.data.theme === "dark"
        );
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  if (!isReady) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-950 dark:to-black p-4 py-8 flex items-center justify-center overflow-y-auto">
      <DonationCard />
    </div>
  );
}
