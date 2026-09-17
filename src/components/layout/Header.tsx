import Link from "next/link";
import { buttonVariants } from "@/components/ui/Button";
    
const navLinks = [
  { href: "/map", label: "Map" },
  { href: "/education", label: "Education" },
  { href: "/login", label: "Login" },
];

export function Header() {
  return (
    <header className="border-b bg-white">
      <div className="container mx-auto flex items-center justify-between px-4 py-4">
        <Link href="/" className="text-lg font-bold text-green-700">
          EcoPonto
        </Link>

        <nav className="hidden gap-6 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-gray-600 hover:text-green-700"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <Link
            href="/map"
            className={buttonVariants({ size: "sm", className: "md:hidden" })}
        >
            Map
        </Link>
      </div>
    </header>
  );
}
