import { ModeToggle } from "@/components/ui/mode_toggle";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { IsLoggedIn, deleteAllCookie, getAllCookie } from "@/app/actions";
import Image from "next/image";
import { COMPANY_NAME } from "@/config/company";

export async function Navigation() {
  const isLoggedIn = await IsLoggedIn();

  return (
    <nav className="sticky top-0 z-50 w-full rounded-b-sm backdrop-blur-md">
      <div className="flex h-16 max-w-7xl w-full items-center justify-between px-2">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 transition hover:opacity-90"
        >
          <Image
            src="/logo.png"
            alt={`${COMPANY_NAME} Logo`}
            className="h-10 w-10 rounded-sm"
            height={32}
            width={32}
            priority
          />

          <div className="flex flex-col leading-tight">
            <span className="text-lg font-bold tracking-tight text-foreground">
              {COMPANY_NAME}
            </span>
            <span className="text-[10px] text-muted-foreground tracking-wider">
              The ∘ SigmARJ ∘ Company
            </span>
          </div>
        </Link>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          <ModeToggle />

          {!isLoggedIn && (
            <>
              <Link href="/signin">
                <Button className="rounded-full">SignIn</Button>
              </Link>
            </>
          )}

          {isLoggedIn && (
            <div className="flex flex-col items-center leading-none">

              <Button variant="destructive" onClick={deleteAllCookie} className="rounded-full px-2">Log Out</Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
