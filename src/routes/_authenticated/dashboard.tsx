import { createFileRoute } from "@tanstack/react-router";
import { CalendarClock, Cpu, Gavel, ListChecks } from "lucide-react";
import { PageHeader, Panel, Kpi, StatusPill } from "@/components/app/ui";
import { useDevices, useMeetings, useTasks, useDecisions, deviceStatus, ago, fmtDate } from "@/lib/data";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/_authenticated/dashboard")({ head: () => seo("Dashboard", "Vue d'ensemble de vos appareils et réunions."), component: Dashboard });

function Dashboard() {
  const devices = useDevices().data ?? []; const meetings = useMeetings().data ?? [];
  const tasks = useTasks().data ?? []; const decisions = useDecisions().data ?? [];
  return (
    <>
      <PageHeader title="Dashboard" subtitle="Vos données réelles" />
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Kpi label="Réunions" value={`${meetings.length}`} icon={<CalendarClock className="h-4 w-4" />} />
        <Kpi label="Décisions" value={`${decisions.length}`} icon={<Gavel className="h-4 w-4" />} />
        <Kpi label="Tâches" value={`${tasks.length}`} icon={<ListChecks className="h-4 w-4" />} />
        <Kpi label="Appareils" value={`${devices.filter((d) => deviceStatus(d) !== "offline").length}/${devices.length}`} icon={<Cpu className="h-4 w-4" />} />
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Panel title="Appareils">{devices.length ? devices.map((d) => <div key={d.id} className="flex justify-between py-2 text-sm"><span>{d.room} · vu {ago(d.last_seen)}</span><StatusPill status={deviceStatus(d)} /></div>) : <p className="text-sm text-muted-foreground">Aucun appareil pour l'instant.</p>}</Panel>
        <Panel title="Réunions">{meetings.length ? meetings.slice(0, 6).map((m) => <div key={m.id} className="py-2 text-sm">{m.title} <span className="text-muted-foreground">· {fmtDate(m.scheduled_at ?? m.created_at)}</span></div>) : <p className="text-sm text-muted-foreground">Aucune réunion pour l'instant.</p>}</Panel>
      </div>
    </>
  );
}
