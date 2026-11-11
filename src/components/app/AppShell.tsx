import { Link, useRouterState } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { LayoutDashboard, Cpu, CalendarClock, Radio, BarChart3, KanbanSquare, Sparkles, Settings, Search, Bell } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";

const nav = [{ to: "/dashboard", label: "Dashboard", icon: LayoutDashboard }] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const path = useRouterState({ select: (s) => s.location.pathname });
  return (
    <div className="flex min-h-screen">
      <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-r border-sidebar-border bg-sidebar/80 p-4 md:flex">
        <Link to="/dashboard" className="mb-8 flex items-center gap-2 px-2">
          <div className="grid h-9 w-9 place-items-center rounded-lg bg-brand shadow-glow"><Sparkles className="h-5 w-5 text-primary-foreground" /></div>
          <div className="font-display text-lg font-semibold">SmartMeet <span className="text-brand">AI</span></div>
        </Link>
        <nav className="flex flex-1 flex-col gap-1">
          {nav.map(({ to, label, icon: Icon }) => {
            const active = path.startsWith(to);
            return (
              <Link key={to} to={to} className={cn("flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                active ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-glow" : "text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground")}>
                <Icon className="h-4 w-4" />{label}
                
              </Link>
            );
          })}
        </nav>
        <div className="panel p-3 text-xs text-muted-foreground">
          <button onClick={() => supabase.auth.signOut().then(() => { window.location.href = "/auth"; })} className="hover:text-foreground">Se déconnecter</button>
        </div>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-10 flex items-center gap-3 border-b border-border bg-background/70 px-4 py-3 backdrop-blur md:px-8">
          <div className="flex flex-1 items-center gap-2 rounded-lg border border-input bg-card/60 px-3 py-2 text-sm text-muted-foreground md:max-w-md">
            <Search className="h-4 w-4" /><input placeholder="Rechercher réunions, décisions, tâches…" className="w-full bg-transparent outline-none placeholder:text-muted-foreground" />
          </div>
          <div className="ml-auto flex items-center gap-3">
            <button className="relative rounded-lg p-2 hover:bg-accent" aria-label="Notifications"><Bell className="h-4 w-4" /><span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-warning" /></button>
            <div className="grid h-8 w-8 place-items-center rounded-full bg-brand text-xs font-semibold text-primary-foreground">OD</div>
          </div>
        </header>
        <nav className="flex gap-1 overflow-x-auto border-b border-border px-3 py-2 md:hidden">
          {nav.map(({ to, label }) => <Link key={to} to={to} className="whitespace-nowrap rounded-md px-3 py-1 text-xs text-muted-foreground" activeProps={{ className: "bg-accent text-foreground" }} >{label}</Link>)}
        </nav>
        <main className="flex-1 px-4 py-6 md:px-8">{children}</main>
        <footer className="border-t border-border px-8 py-2 text-xs text-muted-foreground">SmartMeet AI · données enregistrées dans votre compte</footer>
      </div>
    </div>
  );
}
