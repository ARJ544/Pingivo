"use client";

import { useState, useEffect } from "react";
import { deleteTempPhone } from "@/app/actions";

export function useCallCredits() {
  const [callCredits, setCallCredits] = useState(3);
  const [usedCallCredits, setUsedCallCredits] = useState(0);
  const [creditsLoading, setCreditsLoading] = useState(true);

  useEffect(() => {
    const fetchCallCredits = async () => {
      try {
        setCreditsLoading(true);
        const res = await fetch("/api/get-call-credits");

        if (!res.ok) {
          await deleteTempPhone();
          setCallCredits(0);
          setUsedCallCredits(0);
          return;
        }

        const result = await res.json();

        if (!result.success) {
          setCallCredits(0);
          setUsedCallCredits(0);
          return;
        }

        setCallCredits(result.callCredits);
        setUsedCallCredits(result.creditsUsed);
      } catch {
        setCallCredits(3);
      } finally {
        setCreditsLoading(false);
      }
    };

    fetchCallCredits();
  }, []);

  const refreshCredits = async () => {
    try {
      const res = await fetch("/api/get-call-credits");
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setCallCredits(data.callCredits);
          setUsedCallCredits(data.creditsUsed);
        }
      }
    } catch (error) {
      console.error("Failed to refresh credits:", error);
    }
  };

  return {
    callCredits,
    usedCallCredits,
    creditsLoading,
    refreshCredits,
  };
}
