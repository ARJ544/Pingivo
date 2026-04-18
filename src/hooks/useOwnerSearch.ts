"use client";

import { useState, useEffect } from "react";

export function useOwnerSearch(queryFinderId: string | null) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [ownerFound, setOwnerFound] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (!queryFinderId) return;

    const fetchOwner = async () => {
      try {
        setLoading(true);
        setIsError(false);
        const res = await fetch(`/api/search?finder_id=${queryFinderId}`);
        const result = await res.json();
        if (!res.ok) throw new Error(result.error || "Request failed");
        setOwnerFound(true);
      } catch (err: any) {
        setMessage(err.message || "User not found");
        setOwnerFound(false);
        setIsError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchOwner();
  }, [queryFinderId]);

  return {
    loading,
    message,
    ownerFound,
    isError,
  };
}
