"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  CircleUserRound,
  LogOut,
  BadgeCheck,
  Phone,
  Trash2,
  ChevronRight,
  MessageCircle,
  WifiOff,
} from "lucide-react";
import { deleteAllCookie } from "@/app/actions";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";

type ProfileDropdownProps = {
  isVerified: boolean;
  bsuid?: string;
  token?: string;
};

export default function ProfileDropdown({ isVerified, bsuid, token }: ProfileDropdownProps) {
  const [showDisconnectWarning, setShowDisconnectWarning] = useState(false);
  const router = useRouter();

  const handleConnectWhatsApp = () => {
    if (!token) {
      router.push("/signin");
      router.refresh();
      return;
    }
    const message = `CONNECT_${token}`;
    const url = `https://wa.me/916124530919?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  const handleDisconnectWhatsApp = async () => {
    const response = await fetch("/api/disconnect-whatsapp", { method: "POST" });
    const result = await response.json();
    if (!response.ok) {
      alert(`Failed to disconnect WhatsApp. Please try again. Error: ${result.error || "Unknown error"}`);
      return;
    }
    router.push("/signin");
    router.refresh();
    setShowDisconnectWarning(false);
  };

  return (
    <>
      <DropdownMenu>
        {/* ── Trigger ── */}
        <DropdownMenuTrigger asChild>
          <button
            className={cn(
              "group relative flex items-center justify-center",
              "h-9 w-9 rounded-full cursor-pointer",
              "bg-linear-to-br from-blue-500 via-blue-600 to-indigo-600",
              "shadow-[0_2px_12px_rgba(59,130,246,0.45)]",
              "hover:shadow-[0_4px_20px_rgba(59,130,246,0.6)]",
              "hover:scale-[1.08] active:scale-95",
              "transition-all duration-200 ease-out",
              "ring-[2.5px] ring-blue-400/40 hover:ring-blue-400/70",
              "outline-none focus-visible:ring-[3px] focus-visible:ring-blue-500/70"
            )}
            aria-label="Open profile menu"
          >
            <CircleUserRound className="h-4.5 w-4.5 text-white drop-shadow-sm" />
            <span
              className={cn(
                "absolute inset-0 rounded-full",
                "bg-linear-to-br from-blue-400/20 to-indigo-500/20",
                "opacity-0 group-hover:opacity-100 group-hover:scale-110",
                "transition-all duration-300"
              )}
            />
            {isVerified && (
              <span className="absolute -top-0.5 -right-0.5 flex h-3 w-3 items-center justify-center rounded-full bg-emerald-400 ring-2 ring-background shadow-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-white" />
              </span>
            )}
          </button>
        </DropdownMenuTrigger>

        {/* ── Content ── */}
        <DropdownMenuContent
          align="end"
          sideOffset={8}
          className={cn(
            "z-50 w-64 rounded-2xl p-0 overflow-hidden",
            "border border-border/60",
            "bg-background/95 backdrop-blur-xl",
            "shadow-[0_8px_40px_rgba(0,0,0,0.12),0_2px_8px_rgba(0,0,0,0.08)]",
            "dark:shadow-[0_8px_40px_rgba(0,0,0,0.4)]",
            "animate-in fade-in-0 zoom-in-95 slide-in-from-top-1 duration-150"
          )}
        >
          {/* ── Profile Header ── */}
          <div className="relative px-4 pt-4 pb-3 overflow-hidden">
            <div className="absolute inset-0 bg-linear-to-br from-blue-500/8 via-indigo-500/5 to-transparent pointer-events-none" />
            <div className="relative flex items-center gap-3">
              <div className="relative shrink-0">
                <div
                  className={cn(
                    "flex h-11 w-11 items-center justify-center rounded-full",
                    "bg-linear-to-br from-blue-500 via-blue-600 to-indigo-600",
                    "shadow-[0_2px_12px_rgba(59,130,246,0.4)]",
                    "ring-2 ring-blue-400/30"
                  )}
                >
                  <CircleUserRound className="h-5 w-5 text-white" />
                </div>
                {isVerified && (
                  <span className="absolute -bottom-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-400 ring-2 ring-background">
                    <BadgeCheck className="h-2.5 w-2.5 text-white" />
                  </span>
                )}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-semibold text-foreground leading-tight tracking-tight">
                  My Account
                </span>
                {isVerified ? (
                  <span className="mt-0.5 inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                    <BadgeCheck className="h-3 w-3" />
                    Verified account
                  </span>
                ) : (
                  <span className="mt-0.5 text-[11px] text-muted-foreground">
                    Unverified account
                  </span>
                )}
              </div>
            </div>
          </div>

          <DropdownMenuSeparator className="my-0 bg-border/50" />

          {/* ── Settings Section ── */}
          <div className="px-2 py-2 space-y-0.5">
            <p className="px-2 pb-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-muted-foreground/70">
              Account
            </p>

            {/* Update Phone */}
            <DropdownMenuItem asChild className="group p-0 focus:bg-transparent">
              <Link
                href="/update"
                className={cn(
                  "flex items-center gap-2.5 px-2.5 py-2 rounded-lg w-full",
                  "text-sm text-foreground/80 hover:text-foreground",
                  "hover:bg-accent/60",
                  "transition-all duration-150 cursor-pointer",
                  "focus:outline-none focus:bg-accent/60"
                )}
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-md bg-muted/80 group-hover:bg-blue-500/10 transition-colors">
                  <Phone className="h-3.5 w-3.5 text-muted-foreground group-hover:text-blue-500 transition-colors" />
                </span>
                <span className="flex-1 font-medium">Update Phone</span>
                <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/40 group-hover:text-muted-foreground/70 group-hover:translate-x-0.5 transition-all" />
              </Link>
            </DropdownMenuItem>

            {/* WhatsApp Connect / Disconnect */}
            {bsuid ? (
              <DropdownMenuItem
                onSelect={(e) => {
                  setShowDisconnectWarning(true);
                }}
                className={cn(
                  "group flex items-center gap-2.5 px-2.5 py-2 rounded-lg",
                  "text-sm text-orange-500/80 hover:text-orange-600",
                  "hover:bg-orange-500/8 focus:bg-orange-500/8",
                  "cursor-pointer transition-all duration-150"
                )}
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-md bg-orange-500/8 group-hover:bg-orange-500/15 transition-colors">
                  <WifiOff className="h-3.5 w-3.5 text-orange-400 group-hover:text-orange-500 transition-colors" />
                </span>
                <span className="flex-1 font-medium">Disconnect WhatsApp</span>
                <ChevronRight className="h-3.5 w-3.5 text-orange-300/60 group-hover:text-orange-400/80 group-hover:translate-x-0.5 transition-all" />
              </DropdownMenuItem>
            ) : (
              // Not connected — show Connect
              <DropdownMenuItem
                onSelect={(e) => {
                  e.preventDefault();
                  handleConnectWhatsApp();
                }}
                className={cn(
                  "group flex items-center gap-2.5 px-2.5 py-2 rounded-lg",
                  "text-sm text-green-600/80 hover:text-green-700",
                  "hover:bg-green-500/8 focus:bg-green-500/8",
                  "cursor-pointer transition-all duration-150"
                )}
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-md bg-green-500/8 group-hover:bg-green-500/15 transition-colors">
                  <MessageCircle className="h-3.5 w-3.5 text-green-500 group-hover:text-green-600 transition-colors" />
                </span>
                <span className="flex-1 font-medium">Connect WhatsApp</span>
                <ChevronRight className="h-3.5 w-3.5 text-green-300/60 group-hover:text-green-400/80 group-hover:translate-x-0.5 transition-all" />
              </DropdownMenuItem>
            )}

            {/* Delete Account */}
            <DropdownMenuItem asChild className="group p-0 focus:bg-transparent">
              <Link
                href="/delete-account"
                className={cn(
                  "flex items-center gap-2.5 px-2.5 py-2 rounded-lg w-full",
                  "text-sm text-red-500/80 hover:text-red-600",
                  "hover:bg-red-500/8",
                  "transition-all duration-150 cursor-pointer",
                  "focus:outline-none focus:bg-red-500/8"
                )}
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-md bg-red-500/8 group-hover:bg-red-500/15 transition-colors">
                  <Trash2 className="h-3.5 w-3.5 text-red-400 group-hover:text-red-500 transition-colors" />
                </span>
                <span className="flex-1 font-medium">Delete Account</span>
                <ChevronRight className="h-3.5 w-3.5 text-red-300/60 group-hover:text-red-400/80 group-hover:translate-x-0.5 transition-all" />
              </Link>
            </DropdownMenuItem>
          </div>

          <DropdownMenuSeparator className="my-0 bg-border/50" />

          {/* ── Logout ── */}
          <div className="px-2 py-2">
            <DropdownMenuItem
              onClick={deleteAllCookie}
              className={cn(
                "group flex items-center gap-2.5 px-2.5 py-2 rounded-lg",
                "text-sm font-medium text-red-500/80 hover:text-red-600",
                "hover:bg-red-500/8 focus:bg-red-500/8",
                "cursor-pointer transition-all duration-150"
              )}
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-md bg-red-500/8 group-hover:bg-red-500/15 transition-colors">
                <LogOut className="h-3.5 w-3.5 text-red-400 group-hover:text-red-500 group-hover:-translate-x-0.5 group-hover:scale-95 transition-transform" />
              </span>
              <span className="flex-1">Sign Out</span>
            </DropdownMenuItem>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* ── Disconnect Warning Modal ── */}
      {showDisconnectWarning && createPortal(
        <div className="fixed inset-0 z-9999 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="w-full max-w-xs bg-white dark:bg-slate-900 rounded-xl p-4 shadow-xl border border-slate-200 dark:border-slate-800">
            <h2 className="text-base font-semibold text-slate-900 dark:text-white mb-1">
              Disconnect WhatsApp?
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
              You will <span className="font-semibold text-red-500">stop receiving messages</span> from finders.
              They will only be able to reach you via call.
            </p>

            <div className="text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 rounded-lg px-3 py-2 mb-3">
              To reconnect later, you'll need to go through the WhatsApp setup again from this menu.
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleDisconnectWhatsApp}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded-lg px-3 py-2 transition-colors"
              >
                Disconnect
              </button>
              <button
                onClick={() => setShowDisconnectWarning(false)}
                className="flex-1 border border-slate-200 dark:border-slate-700 text-sm font-medium rounded-lg px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}