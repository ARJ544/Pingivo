import { ModeToggle } from "@/components/ui/mode_toggle";

export function Navigation() {
  return (
    <nav className="flex items-center justify-between px-6 py-4 border-b">
      <div className="flex items-center gap-2">
        <img
          src="/logo.png"
          alt="ParkPing Logo"
          className="h-8 w-8"
        />
        <span className="text-xl font-bold">ParkPing</span>
      </div>
      <ModeToggle />
    </nav>
  );
}