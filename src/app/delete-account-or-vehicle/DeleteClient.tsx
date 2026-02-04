"use client";

import { useState } from "react";
import {
  AlertTriangle,
  Trash2,
} from "lucide-react";

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
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Props = {
  vehi1_num?: string;
  vehi2_num?: string;
};

export default function DeleteCarClient({
  vehi1_num,
  vehi2_num,
}: Props) {
  const [selectedVehicle, setSelectedVehicle] = useState<string>("");
  const [confirmText, setConfirmText] = useState("");
  const [openVehicleDialog, setOpenVehicleDialog] = useState(false);
  const [openAccountDialog, setOpenAccountDialog] = useState(false);

  const handleVehicleDelete = () => {
    if (confirmText !== "delete") return;

    console.log("Deleting vehicle:", selectedVehicle);
    // 👉 call server action / API here

    resetState();
  };

  const handleAccountDelete = () => {
    if (confirmText !== "delete") return;

    console.log("Deleting account");
    // 👉 call server action / API here

    resetState();
  };

  const resetState = () => {
    setConfirmText("");
    setSelectedVehicle("");
    setOpenVehicleDialog(false);
    setOpenAccountDialog(false);
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-50">
      <main className="mx-auto max-w-225 px-6 py-10 space-y-14">

        {/* TITLE */}
        <section className="space-y-2">
          <h1 className="text-4xl font-black tracking-tight">
            Delete Account or Vehicle
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Proceed with caution.
          </p>
        </section>

        {/* SECTION 1 — DELETE VEHICLE */}
        <section className="rounded-xl border border-slate-200 dark:border-slate-800 p-6 space-y-6">
          <div className="flex items-center gap-3">
            <Trash2 className="text-danger" />
            <h2 className="text-xl font-bold">Delete a Vehicle</h2>
          </div>

          <Select onValueChange={setSelectedVehicle}>
            <SelectTrigger className="max-w-sm">
              <SelectValue placeholder="Select a vehicle" />
            </SelectTrigger>
            <SelectContent>
              {vehi1_num && (
                <SelectItem value={vehi1_num}>
                  {vehi1_num}
                </SelectItem>
              )}
              {vehi2_num && (
                <SelectItem value={vehi2_num}>
                  {vehi2_num}
                </SelectItem>
              )}
            </SelectContent>
          </Select>

          <Dialog open={openVehicleDialog} onOpenChange={setOpenVehicleDialog}>
            <DialogTrigger asChild>
              <Button
                variant="destructive"
                disabled={!selectedVehicle}
              >
                Delete Vehicle
              </Button>
            </DialogTrigger>

            <DialogContent>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-danger">
                  <AlertTriangle />
                  Confirm Vehicle Deletion
                </DialogTitle>
              </DialogHeader>

              <p className="text-sm text-slate-600 dark:text-slate-400">
                Type <span className="font-bold">delete</span> to permanently remove
                this vehicle.
              </p>

              <Input
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder="delete"
              />

              <DialogFooter>
                <Button
                  variant="destructive"
                  disabled={confirmText !== "delete"}
                  onClick={handleVehicleDelete}
                >
                  Confirm Delete
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </section>

        {/*SECTION 2 — DELETE ACCOUNT*/}
        <section className="rounded-xl border-2 border-danger/30 bg-danger/5 dark:bg-danger/10 p-6 space-y-6">
          <div className="flex items-center gap-3">
            <AlertTriangle className="text-danger" />
            <h2 className="text-xl font-bold text-danger">
              Delete Entire Account
            </h2>
          </div>

          <p className="text-sm text-danger/80">
            This will delete everything.
            Your profile, vehicles, and all associated QR codes will be permanently removed.
            This action cannot be undone, and all data will be lost forever.
            Access to the platform will require creating a new account.
          </p>

          <Dialog open={openAccountDialog} onOpenChange={setOpenAccountDialog}>
            <DialogTrigger asChild>
              <Button variant="destructive">
                Delete Account
              </Button>
            </DialogTrigger>

            <DialogContent>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-danger">
                  <AlertTriangle />
                  Final Account Deletion
                </DialogTitle>
              </DialogHeader>

              <p className="text-sm text-slate-600 dark:text-slate-400">
                Type <span className="font-bold">delete</span> to confirm account deletion.
              </p>

              <Input
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder="delete"
              />

              <DialogFooter>
                <Button
                  variant="destructive"
                  disabled={confirmText !== "delete"}
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
