import { ModeToggle } from "@/components/ui/mode_toggle";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { IsLoggedIn, deleteAllCookie, getName } from "@/app/actions";

export async function Navigation() {
  const isLoggedIn = await IsLoggedIn();
  const user_name = await getName();

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
          {!isLoggedIn && (
            <Link href="/login">
              <Button className="bg-blue-400 text-white">
                Login
              </Button>
            </Link>
          )}
          {isLoggedIn && (
            <>
              Hello, {user_name?.trim().split(' ')[0].slice(0,9)}
              <Button onClick={deleteAllCookie} className="bg-blue-400 text-white">
                Log Out
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}