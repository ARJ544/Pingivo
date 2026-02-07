"use client";

import { useState } from "react";
import { MessageCircle, Lock, Send, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface MessageOwnerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vehicleId?: string;
  onSubmit?: (issue: string, message: string) => void;
}

export function MessageOwnerModal({
  open,
  onOpenChange,
  vehicleId = "",
  onSubmit,
}: MessageOwnerModalProps) {
  const [issue, setIssue] = useState<string>("");
  const [customMessage, setCustomMessage] = useState("");

  const handleSubmit = () => {
    if (!issue) {
      return;
    }

    onSubmit?.(issue, customMessage);

    setIssue("");
    setCustomMessage("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-130 p-0 gap-0 bg-white dark:bg-[#10171c] border-slate-200 dark:border-slate-800">
        {/* Header */}
        <DialogHeader className="px-6 py-5 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <MessageCircle className="h-6 w-6" />
              </div>

              <div>
                <DialogTitle className="text-xl font-bold text-slate-900 dark:text-slate-50">
                  Message Owner
                </DialogTitle>
                <DialogDescription className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                  Vehicle ID:{" "}
                  <span className="font-mono uppercase tracking-wide">
                    {vehicleId}
                  </span>
                </DialogDescription>
              </div>
            </div>
          </div>
        </DialogHeader>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Issue Select */}
          <div className="space-y-2">
            <Label htmlFor="issue-select" className="text-sm font-semibold">
              What is the issue?
            </Label>

            <Select value={issue} onValueChange={setIssue}>
              <SelectTrigger id="issue-select" className="h-12 text-base">
                <SelectValue placeholder="Select an issue..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Emergency/Another Issue">
                  Emergency/Another Issue
                </SelectItem>
                <SelectItem value="Blocking Road">Blocking Road</SelectItem>
                <SelectItem value="Towing Risk">Towing Risk</SelectItem>
                <SelectItem value="Lights On">Lights On</SelectItem>
                <SelectItem value="Fire/Smoke Detected">
                  Fire/Smoke Detected
                </SelectItem>
                <SelectItem value="Window Open">Window Open</SelectItem>
                <SelectItem value="Something Left in Car">
                  Something Left in Car
                </SelectItem>
                <SelectItem value="Fuel Leak">Fuel Leak</SelectItem>
                <SelectItem value="Alarm Triggered">Alarm Triggered</SelectItem>
              </SelectContent>
            </Select>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              The owner will receive an immediate notification.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="custom-message" className="text-sm font-semibold">
              Custom Message{" "}
              <span className="text-slate-400 font-normal text-xs">
                (Optional)
              </span>
            </Label>
            <Textarea
              id="custom-message"
              placeholder="Provide additional details to help the owner..."
              className="min-h-25 text-base resize-none"
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
            />
          </div>

          <div className="flex gap-3 p-4 bg-primary/5 dark:bg-primary/10 rounded-lg border border-primary/10">
            <Lock className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300">
              Your contact information is kept private. The owner will receive
              this message through our secure platform without seeing your phone
              number or email.
            </p>
          </div>
        </div>

        {/* Footer */}
        <DialogFooter className="px-6 py-5 bg-slate-50 dark:bg-slate-900/40 border-t border-slate-100 dark:border-slate-800 flex-col sm:flex-row-reverse gap-3">
          <Button
            onClick={handleSubmit}
            disabled={!issue}
            className="w-full sm:w-auto gap-2 shadow-md shadow-primary/20"
          >
            Send Notification
            <Send className="h-4 w-4" />
          </Button>

          <DialogClose asChild>
            <Button
              variant="outline"
              className="w-full sm:w-auto border-slate-200 dark:border-slate-700"
            >
              Cancel
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
