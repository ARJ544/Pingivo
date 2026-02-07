import { ModeToggle } from "@/components/ui/mode_toggle";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { IsLoggedIn, getAllCookie, IsVerified } from "@/app/actions";
import ProfileDropdown from "@/components/my_ui/profile-dropdown";
import Image from "next/image";

export async function Navigation() {
  const isLoggedIn = await IsLoggedIn();
  const isVerified = await IsVerified();
  const cookies = await getAllCookie();

  const vehicles = [
    { name: cookies.vehi1_name, number: cookies.vehi1 },
    { name: cookies.vehi2_name, number: cookies.vehi2 },
  ].filter((v): v is { name: string; number: string } => Boolean(v.number));

  return (
    <nav className="sticky top-0 z-50 w-full rounded-b-sm backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5">

        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-1 transition hover:opacity-90"
        >
          <Image
            src="/logo.png"
            alt="ParkPing Logo"
            className="h-8 w-8 rounded-sm"
            height={32}
            width={32}
            priority={true}
          />
          <span className="text-lg font-bold tracking-tight text-foreground">
            ParkPing
          </span>
        </Link>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          <ModeToggle />

          {!isLoggedIn && (
            <>
              <Link href="/login">
                <Button className="rounded-full px-2">
                  Login
                </Button>
              </Link>
              <Link href="/signup">
                <Button className="rounded-full px-2">
                  Sign Up
                </Button>
              </Link>
            </>
          )}

          {isLoggedIn && (
            <div className="flex flex-col items-center leading-none">
              <ProfileDropdown
                user_name={cookies.name ?? "Unknown"}
                totalVehicle={cookies.total_vehi ?? "0"}
                isVerified={isVerified}
                vehicles={vehicles}
              />

              <span className="mt-1 text-[11px] text-orange-600 font-bold">
                View Profile
              </span>
            </div>
          )}

        </div>
      </div>
    </nav>
  );
}
