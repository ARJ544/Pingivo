"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CircleUserRound, LogOut, Car, BadgeCheck } from "lucide-react";
import { deleteAllCookie } from "@/app/actions";

type ProfileDropdownProps = {
  user_name: string;
  totalVehicle: string;
  isVerified: boolean;
  vehicles: {
    name: string;
    number: string;
  }[];
};

export default function ProfileDropdown({
  user_name,
  totalVehicle,
  isVerified,
  vehicles,
}: ProfileDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="rounded-full p-1 transition hover:bg-muted cursor-pointer">
          <CircleUserRound className="h-6 w-6 text-foreground" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="min-w-50 max-w-64 rounded-xl border bg-background p-2 shadow-lg"
      >
        {/* User */}
        <DropdownMenuLabel className="flex flex-col gap-1 px-2">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-foreground">
              {user_name}
            </span>

            {isVerified && (
              <span className="flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-700 ring-1 ring-green-600/20 dark:bg-green-900/30 dark:text-green-400">
                <BadgeCheck className="h-3.5 w-3.5" />
                Verified
              </span>
            )}
          </div>
          {/* <DropdownMenuSeparator /> */}
          <span className="text-xs text-muted-foreground">
            Account Overview
          </span>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        {/* Vehicle Info */}
        <div className="space-y-2 px-2 py-1 text-sm">
          <div className="flex items-center justify-between rounded-md bg-muted px-2 py-1">
            <span className="font-medium text-foreground">Total Vehicles</span>
            <span className="text-muted-foreground">{totalVehicle} / 2</span>
          </div>

          {vehicles.map((v) => (
            <div
              key={v.number}
              className="flex items-center gap-2 rounded-md px-2 py-1 hover:bg-muted transition"
            >
              <Car className="h-4 w-4 text-muted-foreground" />
              <div className="flex flex-col">
                <span className="font-medium text-foreground">{v.name}</span>
                <span className="text-xs text-muted-foreground">
                  {v.number}
                </span>
              </div>
            </div>
          ))}
        </div>

        <DropdownMenuSeparator />

        {/* Logout */}
        <DropdownMenuItem
          onClick={deleteAllCookie}
          className="mt-1 cursor-pointer gap-2 rounded-md text-red-500 focus:bg-red-500/10 focus:text-red-600"
        >
          <LogOut className="h-4 w-4" />
          Log Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
