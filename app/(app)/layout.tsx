import { redirect } from "next/navigation";
import { LogOut } from "lucide-react";
import { Logo } from "@/components/logo";
import { BottomNav, SideNav } from "@/components/app-nav";
import { requireUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

async function signOut() {
  "use server";
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const { user } = await requireUser();

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[250px_1fr]">
      <aside className="sticky top-0 hidden h-screen flex-col justify-between border-r border-line bg-surface/40 p-4 lg:flex">
        <div className="space-y-8">
          <div className="px-2 pt-1">
            <Logo href="/dashboard" />
          </div>
          <SideNav />
        </div>
        <div className="space-y-3 border-t border-line pt-4">
          <p className="truncate px-2 text-xs text-muted" title={user.email}>{user.email}</p>
          <form action={signOut}>
            <button type="submit" className="btn btn-ghost btn-sm w-full justify-start">
              <LogOut size={15} aria-hidden="true" /> Déconnexion
            </button>
          </form>
        </div>
      </aside>

      <div className="min-w-0 pb-24 lg:pb-0">
        <header className="flex h-14 items-center justify-between border-b border-line px-4 lg:hidden">
          <Logo href="/dashboard" />
          <form action={signOut}>
            <button type="submit" className="btn btn-ghost btn-sm" aria-label="Déconnexion">
              <LogOut size={15} aria-hidden="true" />
            </button>
          </form>
        </header>
        <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-8 sm:py-10">{children}</main>
      </div>
      <BottomNav />
    </div>
  );
}
