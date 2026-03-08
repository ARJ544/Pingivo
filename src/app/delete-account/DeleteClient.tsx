"use client";

import { useState } from "react";
import { AlertTriangle, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function DeleteAccountClient() {
  const router = useRouter();

  const [confirmText, setConfirmText] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [message, setMessage] = useState("");
  const [openDialog, setOpenDialog] = useState(false);

  const handleAccountDelete = async () => {
    if (confirmText !== "delete") return;

    setDeleting(true);
    try {
      const res = await fetch("/api/delete-account", {
        method: "DELETE",
      });
      console.log("Response status:", res.status)

      if (!res.ok) {
        throw new Error("Failed to delete account! Refresh Page again");
      }
      setMessage("Account deleted successfully you may refresh page!");
      router.refresh();
    } catch (err: any) {
      setMessage(err.message || "Something went wrong");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 px-4 py-10">
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-slate-100">
            Delete Account
          </h1>
          <p className="mt-2 text-slate-600 dark:text-slate-400">
            Permanently delete your account and all associated data
          </p>
        </div>

        {/* Delete Account Section */}
        <div className="rounded-xl border-2 border-red-300 dark:border-red-900 bg-red-50 dark:bg-red-950/30 p-8">
          <div className="flex items-center gap-3 mb-6">
            <AlertTriangle className="text-red-600 dark:text-red-500" size={24} />
            <h2 className="text-2xl font-bold text-red-700 dark:text-red-500">
              Delete Your Account
            </h2>
          </div>

          <div className="space-y-4 mb-6">
            <p className="text-sm text-red-700 dark:text-red-400 leading-relaxed">
              This action is <strong>permanent and irreversible</strong>. 
              Once deleted, your account and all associated data will be removed from our system.
            </p>
            <ul className="text-sm text-red-700 dark:text-red-400 list-disc ml-5 space-y-2">
              <li>Your account will be completely removed</li>
              <li>All your data will be permanently deleted</li>
              <li>Your Finder ID will no longer be accessible</li>
              <li>You will need to create a new account to use the service again</li>
            </ul>
          </div>

          <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogTrigger asChild>
              <Button variant="destructive" className="w-full">
                <Trash2 className="mr-2" size={18} />
                Delete My Account
              </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-red-600 dark:text-red-500">
                  <AlertTriangle className="h-5 w-5" />
                  Confirm Account Deletion
                </DialogTitle>
                <DialogDescription>
                  This action cannot be undone.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Type <span className="font-semibold">"delete"</span> to confirm account deletion.
                </p>

                <Input
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  placeholder='Type "delete"'
                  className="font-semibold"
                />

                {message && (
                  <p className="text-sm text-red-600 dark:text-red-400">
                    {message}
                  </p>
                )}
              </div>

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => {
                    setOpenDialog(false);
                    setConfirmText("");
                  }}
                  disabled={deleting}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  disabled={confirmText !== "delete" || deleting}
                  onClick={handleAccountDelete}
                >
                  {deleting ? "Deleting..." : "Delete Account"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Info Box */}
        <div className="mt-8 rounded-lg bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 p-4">
          <p className="text-sm text-blue-900 dark:text-blue-300">
            <strong>Note:</strong> If you're having issues with your account, please contact our support team before deleting.
          </p>
        </div>
      </div>
    </main>
  );
}
