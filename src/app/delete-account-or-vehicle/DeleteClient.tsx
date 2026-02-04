"use client";

import { useState } from "react";
import { AlertTriangle, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { setAllCookie } from "@/app/actions";

type Props = {
  vehi1_num?: string;
  vehi2_num?: string;
};

export default function DeleteCarClient({
  vehi1_num,
  vehi2_num,
}: Props) {
  const router = useRouter();

  const [selectedVehicle, setSelectedVehicle] = useState("");
  const [confirmText, setConfirmText] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [message, setMessage] = useState("");

  const [openVehicleDialog, setOpenVehicleDialog] = useState(false);
  const [openAccountDialog, setOpenAccountDialog] = useState(false);

  const resetState = () => {
    setConfirmText("");
    setSelectedVehicle("");
    setOpenVehicleDialog(false);
    setOpenAccountDialog(false);
  };

  const handleVehicleDelete = async () => {
    if (confirmText !== "delete" || !selectedVehicle) return;

    setDeleting(true);
    try {
      const res = await fetch("/api/delete-vehi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ selectedVehicle }),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result?.error || "Failed to delete vehicle");
      }

      await setAllCookie(result.user);

      setMessage("Vehicle deleted successfully");
      router.replace("/home");
    } catch (err: any) {
      setMessage(err.message || "Something went wrong");
    } finally {
      setDeleting(false);
    }
  };

  const handleAccountDelete = async () => {
    if (confirmText !== "delete") return;

    setDeleting(true);
    try {
      const res = await fetch("/api/delete-account", {
        method: "POST",
      });

      if (!res.ok) {
        throw new Error("Failed to delete account");
      }

      resetState();
      router.replace("/signup");
    } catch (err: any) {
      setMessage(err.message || "Something went wrong");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50">
      <main className="mx-auto max-w-225 px-6 py-10 space-y-14">

        {/* TITLE */}
        <section className="space-y-2">
          <h1 className="text-4xl font-black tracking-tight">
            Delete Account or Vehicle
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Proceed with caution. These actions cannot be undone.
          </p>
        </section>

        {/* DELETE VEHICLE */}
        <section className="rounded-xl border border-slate-200 dark:border-slate-800 p-6 space-y-6">
          <div className="flex items-center gap-3">
            <Trash2 className="text-red-600 dark:text-red-500" />
            <h2 className="text-xl font-bold">Delete a Vehicle</h2>
          </div>

          <Select onValueChange={setSelectedVehicle}>
            <SelectTrigger className="max-w-sm">
              <SelectValue placeholder="Select a vehicle" />
            </SelectTrigger>
            <SelectContent>
              {vehi1_num && <SelectItem value={vehi1_num}>{vehi1_num}</SelectItem>}
              {vehi2_num && <SelectItem value={vehi2_num}>{vehi2_num}</SelectItem>}
            </SelectContent>
          </Select>

          <Dialog open={openVehicleDialog} onOpenChange={setOpenVehicleDialog}>
            <DialogTrigger asChild>
              <Button variant="destructive" disabled={!selectedVehicle || deleting}>
                Delete Vehicle
              </Button>
            </DialogTrigger>

            <DialogContent aria-description="flex">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-red-600 dark:text-red-500">
                  <AlertTriangle className="h-5 w-5" />
                  Confirm Vehicle Deletion
                </DialogTitle>
                <DialogDescription>
                  This action cannot be undone.
                </DialogDescription>
              </DialogHeader>

              <p className="text-sm text-slate-600 dark:text-slate-400">
                Type <span className="font-semibold">delete</span> to permanently
                remove this vehicle.
              </p>

              <Input
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder="delete"
              />

              {message && (
                <p className="text-sm text-red-600 dark:text-red-400">
                  {message}
                </p>
              )}

              <DialogFooter>
                <Button
                  variant="destructive"
                  disabled={confirmText !== "delete" || deleting}
                  onClick={handleVehicleDelete}
                >
                  Confirm Delete
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </section>

        {/* DELETE ACCOUNT */}
        <section className="rounded-xl border-2 border-red-300 dark:border-red-900 bg-red-50 dark:bg-red-950/30 p-6 space-y-6">
          <div className="flex items-center gap-3">
            <AlertTriangle className="text-red-600 dark:text-red-500" />
            <h2 className="text-xl font-bold text-red-700 dark:text-red-500">
              Delete Entire Account
            </h2>
          </div>

          <p className="text-sm text-red-700 dark:text-red-400 leading-relaxed">
            Delete everything? You are about to permanently remove your profile
            and vehicles. All associated QR codes will be deactivated.
            <br />
            This action is irreversible. To use the platform again, you will need
            to create a new account.
          </p>

          <Dialog open={openAccountDialog} onOpenChange={setOpenAccountDialog}>
            <DialogTrigger asChild>
              <Button variant="destructive" disabled={deleting}>Delete Account</Button>
            </DialogTrigger>

            <DialogContent>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-red-600 dark:text-red-500">
                  <AlertTriangle className="h-5 w-5" />
                  Final Account Deletion
                </DialogTitle>
                <DialogDescription>
                  This action cannot be undone.
                </DialogDescription>
              </DialogHeader>

              <p className="text-sm text-slate-600 dark:text-slate-400">
                Type <span className="font-semibold">delete</span> to confirm
                permanent account deletion.
              </p>

              <Input
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder="delete"
              />

              {message && (
                <p className="text-sm text-red-600 dark:text-red-400">
                  {message}
                </p>
              )}

              <DialogFooter>
                <Button
                  variant="destructive"
                  disabled={confirmText !== "delete" || deleting}
                  onClick={handleAccountDelete}
                >
                  Permanently Delete Account
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </section>
      </main>
    </div>
  );
}
