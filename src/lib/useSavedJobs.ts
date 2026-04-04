"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";

/**
 * Unified saved jobs hook.
 * - Logged-in users: syncs with /api/saved-jobs (DB)
 * - Logged-out users: falls back to localStorage
 */
export function useSavedJobs() {
  const { data: session, status } = useSession();
  const isLoggedIn = status === "authenticated";

  const [savedJobs, setSavedJobs] = useState<string[]>([]);
  const [loaded, setLoaded] = useState(false);

  // Load saved jobs on mount
  useEffect(() => {
    if (status === "loading") return;

    if (isLoggedIn) {
      fetch("/api/saved-jobs")
        .then((r) => r.json())
        .then((data) => {
          if (data.savedJobs) {
            setSavedJobs(data.savedJobs.map((s: { job: { id: string } }) => s.job.id));
          }
        })
        .catch(() => {})
        .finally(() => setLoaded(true));
    } else {
      try {
        const local = JSON.parse(localStorage.getItem("nextstep_saved") || "[]");
        setSavedJobs(local);
      } catch {
        setSavedJobs([]);
      }
      setLoaded(true);
    }
  }, [isLoggedIn, status]);

  // Persist localStorage changes for logged-out users
  useEffect(() => {
    if (!isLoggedIn && loaded) {
      localStorage.setItem("nextstep_saved", JSON.stringify(savedJobs));
    }
  }, [savedJobs, isLoggedIn, loaded]);

  const toggleSave = useCallback(
    async (jobId: string) => {
      const isSaved = savedJobs.includes(jobId);

      // Optimistic update
      setSavedJobs((prev) =>
        isSaved ? prev.filter((id) => id !== jobId) : [...prev, jobId]
      );

      if (isLoggedIn) {
        try {
          if (isSaved) {
            await fetch("/api/saved-jobs", {
              method: "DELETE",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ jobId }),
            });
          } else {
            await fetch("/api/saved-jobs", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ jobId }),
            });
          }
        } catch {
          // Revert on failure
          setSavedJobs((prev) =>
            isSaved ? [...prev, jobId] : prev.filter((id) => id !== jobId)
          );
        }
      }
    },
    [savedJobs, isLoggedIn]
  );

  const isSaved = useCallback(
    (jobId: string) => savedJobs.includes(jobId),
    [savedJobs]
  );

  return { savedJobs, toggleSave, isSaved, loaded };
}
