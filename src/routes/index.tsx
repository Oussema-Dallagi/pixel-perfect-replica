import { createFileRoute, Link } from "@tanstack/react-router";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { CalendarClock, Clock, Gavel, ListChecks, Cpu, Gauge, AlertTriangle, Info, CheckCircle2, Radio } from "lucide-react";
import { PageHeader, Panel, Kpi, StatusPill, tooltipStyle } from "@/components/app/ui";
import { devices, meetings, weekly, insights } from "@/lib/demo-data";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/")({ head: () => seo("Dashboard", "Vue d'ensemble de vos salles, appareils et réunions intelligentes."), component: Dashboard });

function Dashboard() {
  return (
    <>
      <PageHeader title="Bonjour, Oussama 👋" subtitle="Mardi 10 novembre 2026 · 1 réunion en cours dans la Salle Innovation"
        actions={<Link to="/live" className="inline-flex items-center gap-2 rounded-lg bg-brand px-4 py-2 text-sm font-medium text-primary-foreground shadow-glow"><Radio className="h-4 w-4" />Rejoindre le live</Link>} />
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-6">
        <Kpi label="Réunions" value="48" delta="+8 cette semaine" icon={<CalendarClock className="h-4 w-4" />} />
        <Kpi label="Temps total" value="32h 15m" delta="+3h vs sem. passée" icon={<Clock className="h-4 w-4" />} />
        <Kpi label="Décisions" value="126" delta="+14" icon={<Gavel className="h-4 w-4" />} />
        <Kpi label="Tâches" value="94" delta="68 % terminées" icon={<ListChecks className="h-4 w-4" />} />
        <Kpi label="Appareils" value="2/3" icon={<Cpu className="h-4 w-4" />} />
        <Kpi label="Précision IA" value="95%" delta="+1.2 pt" icon={<Gauge className="h-4 w-4" />} />
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Panel title="Activité des réunions" className="lg:col-span-2">
          <div className="h-64">
            <ResponsiveContainer>
              <AreaChart data={weekly}>
                <defs><linearGradient id="g1" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="var(--primary)" stopOpacity={0.5} /><stop offset="100%" stopColor="var(--primary)" stopOpacity={0} /></linearGradient></defs>
                <CartesianGrid stroke="var(--border)" vertical={false} />
                <XAxis dataKey="day" stroke="var(--muted-foreground)" fontSize={12} /><YAxis stroke="var(--muted-foreground)" fontSize={12} />
                <Tooltip contentStyle={tooltipStyle} />
                <Area dataKey="meetings" name="Réunions" stroke="var(--primary)" fill="url(#g1)" strokeWidth={2} />
                <Area dataKey="hours" name="Heures" stroke="var(--violet)" fill="transparent" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Panel>
        <Panel title="État des appareils">
          <div className="space-y-3">
            {devices.map((d) => (
              <Link key={d.id} to="/devices/$id" params={{ id: d.id }} className="flex items-center justify-between rounded-lg border border-border p-3 hover:bg-accent/50">
                <div><div className="text-sm font-medium">{d.room}</div><div className="text-xs text-muted-foreground">{d.status === "offline" ? `Vu ${d.lastSeen}` : `CO₂ ${d.co2} ppm · ${d.temp}°C`}</div></div>
                <StatusPill status={d.status} />
              </Link>
            ))}
          </div>
        </Panel>
        <Panel title="Réunions récentes" className="lg:col-span-2">
          <div className="divide-y divide-border">
            {meetings.slice(0, 5).map((m) => (
              <Link key={m.id} to="/meetings/$id" params={{ id: m.id }} className="flex items-center gap-4 py-3 hover:opacity-80">
                <div className="flex-1"><div className="text-sm font-medium">{m.title}</div><div className="text-xs text-muted-foreground">{m.date} · {m.duration} · {m.room}</div></div>
                <div className="hidden text-xs text-muted-foreground sm:block">{m.decisions} décisions · {m.tasks} tâches</div>
                <StatusPill status={m.status as "live"} />
              </Link>
            ))}
          </div>
        </Panel>
        <Panel title="Insights IA">
          <div className="space-y-3">
            {insights.map((i, k) => {
              const Icon = i.kind === "warning" ? AlertTriangle : i.kind === "success" ? CheckCircle2 : Info;
              const c = i.kind === "warning" ? "text-warning" : i.kind === "success" ? "text-success" : "text-primary";
              return <div key={k} className="flex gap-3 rounded-lg bg-muted/50 p-3 text-sm"><Icon className={`h-4 w-4 shrink-0 ${c}`} />{i.text}</div>;
            })}
          </div>
        </Panel>
      </div>
    </>
  );
}
