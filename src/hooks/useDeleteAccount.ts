"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function useDeleteAccount() {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);
  const [message, setMessage] = useState("");

  const handleAccountDelete = async (confirmText: string) => {
    if (confirmText !== "delete") return false;

    setDeleting(true);
    try {
      const res = await fetch("/api/delete-account", {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to delete account! Refresh Page again");
      }
      setMessage("Account deleted successfully you may refresh page!");
      router.refresh();
      return true;
    } catch (err: any) {
      setMessage(err.message || "Something went wrong");
      return false;
    } finally {
      setDeleting(false);
    }
  };

  return {
    deleting,
    message,
    handleAccountDelete,
  };
}
