"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Megaphone, PlusCircle, Settings, FolderOpen } from "lucide-react";

const ITEMS = [
  { href: "/dashboard", label: "Tableau de bord", short: "Accueil", icon: LayoutDashboard },
  { href: "/offers/new", label: "Nouvelle mission", short: "Mission", icon: PlusCircle },
  { href: "/offers", label: "Mes offres", short: "Offres", icon: FolderOpen },
  { href: "/campaigns", label: "Campagnes Meta", short: "Meta", icon: Megaphone },
  { href: "/settings", label: "Réglages", short: "Réglages", icon: Settings },
] as const;

function isActive(pathname: string, href: string) {
  if (href === "/offers") return pathname === "/offers" || (pathname.startsWith("/offers/") && pathname !== "/offers/new");
  return pathname === href || pathname.startsWith(href + "/");
}

export function SideNav() {
  const pathname = usePathname();
  return (
    <nav aria-label="Navigation principale" className="flex flex-col gap-1">
      {ITEMS.map(({ href, label, icon: Icon }) => {
        const active = isActive(pathname, href);
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
              active ? "bg-surface-2 text-text" : "text-muted hover:bg-surface hover:text-text"
            }`}
          >
            <Icon size={17} className={active ? "text-sun" : ""} aria-hidden="true" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}

export function BottomNav() {
  const pathname = usePathname();
  return (
    <nav
      aria-label="Navigation principale"
      className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-5 border-t border-line bg-bg/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden"
    >
      {ITEMS.map(({ href, short, icon: Icon }) => {
        const active = isActive(pathname, href);
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={`flex min-h-14 flex-col items-center justify-center gap-1 text-[0.68rem] font-medium ${
              active ? "text-sun" : "text-muted"
            }`}
          >
            <Icon size={19} aria-hidden="true" />
            {short}
          </Link>
        );
      })}
    </nav>
  );
}
