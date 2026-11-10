import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function PageHeader({ title, subtitle, actions }: { title: string; subtitle?: string; actions?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-2xl font-semibold md:text-3xl">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      {actions && <div className="flex gap-2">{actions}</div>}
    </div>
  );
}

export function Panel({ title, children, className, action }: { title?: string; children: ReactNode; className?: string; action?: ReactNode }) {
  return (
    <section className={cn("panel p-5", className)}>
      {title && (
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">{title}</h2>
          {action}
        </div>
      )}
      {children}
    </section>
  );
}

export function Kpi({ label, value, delta, icon }: { label: string; value: string; delta?: string; icon: ReactNode }) {
  return (
    <div className="panel p-4">
      <div className="flex items-center justify-between text-muted-foreground">
        <span className="text-xs uppercase tracking-wider">{label}</span>
        <span className="text-primary">{icon}</span>
      </div>
      <div className="mt-3 font-display text-3xl font-semibold">{value}</div>
      {delta && <div className="mt-1 text-xs text-success">{delta}</div>}
    </div>
  );
}

const tones = {
  online: "bg-success/15 text-success", recording: "bg-destructive/15 text-destructive", offline: "bg-muted text-muted-foreground",
  live: "bg-destructive/15 text-destructive", done: "bg-success/15 text-success", scheduled: "bg-primary/15 text-primary",
  Haute: "bg-destructive/15 text-destructive", Moyenne: "bg-warning/15 text-warning", Basse: "bg-muted text-muted-foreground",
} as const;
const labels: Record<string, string> = { online: "En ligne", recording: "Enregistrement", offline: "Hors ligne", live: "En direct", done: "Terminée", scheduled: "Planifiée" };

export function StatusPill({ status }: { status: keyof typeof tones }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium", tones[status])}>
      {(status === "recording" || status === "live" || status === "online") && <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-current" />}
      {labels[status] ?? status}
    </span>
  );
}

export const tooltipStyle = { background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 10, color: "var(--foreground)" };
