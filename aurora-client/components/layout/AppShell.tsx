"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FadeIn } from "@/components/motion/FadeIn";
import { Button } from "@/components/ui/Button";
import { useCurrentUser, useLogout } from "@/lib/queries/use-auth";
import { cn } from "@/lib/utils/cn";

const navItems = [
  { href: "/settings", label: "Settings" },
  { href: "/mappings", label: "Mappings" },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: user } = useCurrentUser();
  const logout = useLogout();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <FadeIn>
        <header className="border-b border-border bg-surface">
          <div className="mx-auto flex max-w-(--container-max) items-center justify-between px-(--spacing-page) py-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-foreground">
                Aurora
              </p>
              <h1 className="text-lg font-semibold">Integration Hub</h1>
            </div>

            <div className="flex items-center gap-4">
              <nav className="flex items-center gap-2">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "rounded-app px-4 py-2 text-sm font-medium transition",
                      pathname === item.href
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-surface-muted",
                    )}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>

              <div className="hidden text-right sm:block">
                <p className="text-sm font-medium">{user?.name}</p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
              </div>

              <Button
                variant="secondary"
                size="sm"
                onClick={() => logout.mutate()}
                disabled={logout.isPending}
              >
                {logout.isPending ? "Leaving..." : "Logout"}
              </Button>
            </div>
          </div>
        </header>
      </FadeIn>

      <main className="mx-auto max-w-(--container-max) px-(--spacing-page) py-8">
        {children}
      </main>
    </div>
  );
}
