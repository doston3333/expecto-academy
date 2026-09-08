import { cn } from "@/lib/cn";

interface LogoProps {
  className?: string;
}

/** Official Expecto Academy mark — winged book, diamond, and star. */
export function Logo({ className }: LogoProps) {
  return (
    <img
      src="/logo.png"
      alt="Expecto Academy"
      width={256}
      height={206}
      className={cn("w-auto max-w-none object-contain object-center select-none", className)}
      draggable={false}
    />
  );
}
