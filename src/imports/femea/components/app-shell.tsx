import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { ThemeToggle } from "./theme-toggle";
import { topics } from "@/imports/femea/lib/topics";

const phases = topics.filter((t) => t.group === "fases");
const umbigo = topics.filter((t) => t.group === "umbigo");
const loose = topics.filter((t) => !t.group);


function PhaseLink({
  to,
  tag,
  label,
  active,
  onNavigate,
}: {
  to: string;
  tag: string;
  label: string;
  active: boolean;
  onNavigate?: () => void;
}) {
  return (
    <Link
      to={to}
      onClick={onNavigate}
      className={[
        "group flex items-baseline gap-3 rounded-md px-3 py-1.5 text-[11px] tracking-[0.18em] transition-colors",
        active
          ? "bg-sidebar-active text-sidebar-active-foreground"
          : "text-sidebar-foreground hover:bg-sidebar-hover",
      ].join(" ")}
    >
      <span
        className={[
          "w-3 text-right font-mono text-[11px]",
          active ? "text-sidebar-active-foreground/80" : "text-muted-foreground",
        ].join(" ")}
      >
        {tag}
      </span>
      <span className="truncate uppercase">{label}</span>
    </Link>
  );
}

function FlatLink({
  to,
  label,
  active,
  onNavigate,
}: {
  to: string;
  label: string;
  active: boolean;
  onNavigate?: () => void;
}) {
  return (
    <Link
      to={to}
      onClick={onNavigate}
      className={[
        "group block rounded-md px-3 py-1.5 text-[11px] tracking-[0.22em] transition-colors",
        active
          ? "bg-sidebar-active text-sidebar-active-foreground"
          : "text-sidebar-foreground hover:bg-sidebar-hover",
      ].join(" ")}
    >
      <span className="truncate uppercase">{label}</span>
    </Link>
  );
}

function GroupLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="px-3 pb-1.5 pt-3 text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
      {children}
    </div>
  );
}

function NavBody({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isActive = (slug: string) => pathname === `/${slug}`;

  return (
    <nav className="flex flex-col gap-0.5 px-2">
      <div className="px-3 pb-1 pt-1 text-[13px] uppercase tracking-[0.32em] text-foreground">
        fases
      </div>
      <div className="ml-4 flex flex-col gap-0.5 border-l border-sidebar-border pl-2">
        {phases.map((p) => (
          <PhaseLink
            key={p.slug}
            to={`/femea/${p.slug}`}
            tag={p.groupTag ?? ""}
            label={p.label}
            active={isActive(p.slug)}
            onNavigate={onNavigate}
          />
        ))}
      </div>

      <div className="mx-3 my-3 h-px bg-sidebar-border" />

      <div className="px-3 pb-1 pt-1 text-[13px] uppercase tracking-[0.32em] text-foreground">
        umbigo
      </div>
      <div className="ml-4 flex flex-col gap-0.5 border-l border-sidebar-border pl-2">
        {umbigo.map((e) => (
          <FlatLink
            key={e.slug}
            to={`/femea/${e.slug}`}
            label={e.label}
            active={isActive(e.slug)}
            onNavigate={onNavigate}
          />
        ))}
      </div>

      <div className="mx-3 my-3 h-px bg-sidebar-border" />

      <div className="flex flex-col gap-0.5">
        {loose.map((e) => (
          <FlatLink
            key={e.slug}
            to={`/femea/${e.slug}`}
            label={e.label}
            active={isActive(e.slug)}
            onNavigate={onNavigate}
          />
        ))}
      </div>

    </nav>
  );
}

function SidebarBrand({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const homeActive = pathname === "/";

  return (
    <Link
      to="/femea/"
      onClick={onNavigate}
      className="block px-5 pb-3 pt-6"
      aria-current={homeActive ? "page" : undefined}
    >
      <div className="font-display text-[1.75rem] font-light leading-none tracking-[0.28em] text-foreground">
        F È M E A
      </div>
      <div className="mt-3 text-[10px] uppercase tracking-[0.35em] text-muted-foreground">
        obra completa
      </div>

    </Link>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen w-full bg-background text-foreground">
      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar md:flex">
        <SidebarBrand />
        <div className="flex-1 overflow-y-auto py-2">
          <NavBody />
        </div>
        <div className="flex items-center justify-between border-t border-sidebar-border px-5 py-4">
          <div className="flex flex-col">
            <span className="text-[11px] font-medium uppercase tracking-[0.22em] text-foreground">
              tema
            </span>
            <span className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
              claro / escuro
            </span>
          </div>
          <ThemeToggle />
        </div>
      </aside>

      {/* Mobile */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-border bg-background/80 px-4 py-3 backdrop-blur md:hidden">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="rounded-md border border-border p-2 text-foreground"
              aria-label="Abrir menu"
            >
              <Menu className="h-4 w-4" />
            </button>
            <Link to="/femea/" className="font-display text-xl font-light tracking-[0.26em] text-foreground">
              F È M E A
            </Link>
          </div>

          <ThemeToggle />
        </header>

        {mobileOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            <button
              type="button"
              aria-label="Fechar menu"
              className="absolute inset-0 bg-foreground/40"
              onClick={() => setMobileOpen(false)}
            />
            <div className="absolute inset-y-0 left-0 flex w-72 flex-col bg-sidebar shadow-xl">
              <div className="flex items-center justify-between pr-2">
                <SidebarBrand onNavigate={() => setMobileOpen(false)} />
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  className="mr-2 rounded-md p-2 text-foreground"
                  aria-label="Fechar"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto py-2">
                <NavBody onNavigate={() => setMobileOpen(false)} />
              </div>
            </div>
          </div>
        )}

        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
