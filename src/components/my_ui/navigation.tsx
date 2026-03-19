import { ModeToggle } from "@/components/ui/mode_toggle";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getAllCookie } from "@/app/actions";
import Image from "next/image";
import { COMPANY_NAME } from "@/config/company";
import ProfileDropdown from "@/components/my_ui/profile-dropdown";
import { authenticateUser, refreshUserToken } from "@/lib/api-helpers";

export async function Navigation() {
  const { loggedin, verified: isVerified } = await getAllCookie();

  let bsuid: string | undefined;
  let token: string | undefined;

  if (loggedin) {
    const auth = await authenticateUser(false);
    if (auth.success) {
      bsuid = auth.user.bsuid ?? undefined;
      token = auth.user.token ?? undefined;
    }
  }

  return (
    <nav className="sticky border-b border-gray-800 top-0 z-50 w-full rounded-b-sm backdrop-blur-md">
      <div className="flex h-16 max-w-7xl w-full items-center justify-between px-2">
        <Link href="/" className="flex items-center gap-2 transition hover:opacity-90">
          <Image
            src="/logo.png"
            alt={`${COMPANY_NAME} Logo`}
            className="h-10 w-10 rounded-sm"
            height={32}
            width={32}
            priority
          />
          <div className="flex flex-col leading-tight">
            <span className="text-lg font-bold tracking-tight text-foreground">{COMPANY_NAME}</span>
            <span className="text-[10px] text-muted-foreground tracking-wider">The ∘ SigmARJ ∘ Company</span>
          </div>
        </Link>
        <div className="flex items-center gap-3">
          <ModeToggle />
          {!loggedin && (
            <Link href="/signin">
              <Button className="rounded-full">Sign In</Button>
            </Link>
          )}
          {loggedin && (
            <ProfileDropdown isVerified={isVerified} bsuid={bsuid} token={token} />
          )}
        </div>
      </div>
    </nav>
  );
}