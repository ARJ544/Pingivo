import { ModeToggle } from "@/components/ui/mode_toggle";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Navigation() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-white/80 px-6 py-3 backdrop-blur-md dark:bg-black/80">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <div className="flex cursor-pointer items-center gap-2 transition-opacity hover:opacity-90">
          <img src="/logo.png" alt="ParkPing Logo" className="h-8 w-8" />
          <Link href={"/"}>
            <span className="text-xl font-bold tracking-tight">ParkPing</span>
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <ModeToggle />
          <Link href={"/register"}>
            <Button className="bg-blue-400 text-white">
              Login
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}