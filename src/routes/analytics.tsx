import { createFileRoute } from "@tanstack/react-router";
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Cell } from "recharts";
import { Clock, Gauge, Gavel, ListChecks } from "lucide-react";
import { PageHeader, Panel, Kpi, tooltipStyle } from "@/components/app/ui";
import { weekly, speakingTime, meetings, co2Series } from "@/lib/demo-data";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/analytics")({ head: () => seo("Analytics", "Performance, participation, décisions et environnement de vos réunions."), component: Analytics });
const ax = { stroke: "var(--muted-foreground)", fontSize: 12 };
const durations = [{ r: "<15m", n: 6 }, { r: "15-30m", n: 14 }, { r: "30-60m", n: 18 }, { r: "1-2h", n: 9 }, { r: ">2h", n: 1 }];
const completion = [{ w: "S41", v: 52 }, { w: "S42", v: 58 }, { w: "S43", v: 61 }, { w: "S44", v: 64 }, { w: "S45", v: 68 }];

function Analytics() {
  return (
    <>
      <PageHeader title="Analytics" subtitle="30 derniers jours" />
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Kpi label="Durée moyenne" value="42 min" icon={<Clock className="h-4 w-4" />} />
        <Kpi label="Score productivité" value="84" delta="+4" icon={<Gauge className="h-4 w-4" />} />
        <Kpi label="Décisions / réunion" value="2.6" icon={<Gavel className="h-4 w-4" />} />
        <Kpi label="Tâches terminées" value="68%" delta="+12 %" icon={<ListChecks className="h-4 w-4" />} />
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Panel title="Réunions par jour"><div className="h-60"><ResponsiveContainer><BarChart data={weekly}><CartesianGrid stroke="var(--border)" vertical={false} /><XAxis dataKey="day" {...ax} /><YAxis {...ax} /><Tooltip contentStyle={tooltipStyle} /><Bar dataKey="meetings" name="Réunions" fill="var(--primary)" radius={[6, 6, 0, 0]} /></BarChart></ResponsiveContainer></div></Panel>
        <Panel title="Distribution des durées"><div className="h-60"><ResponsiveContainer><BarChart data={durations}><CartesianGrid stroke="var(--border)" vertical={false} /><XAxis dataKey="r" {...ax} /><YAxis {...ax} /><Tooltip contentStyle={tooltipStyle} /><Bar dataKey="n" name="Réunions" fill="var(--violet)" radius={[6, 6, 0, 0]} /></BarChart></ResponsiveContainer></div></Panel>
        <Panel title="Temps de parole par participant"><div className="h-60"><ResponsiveContainer><BarChart data={speakingTime} layout="vertical"><XAxis type="number" {...ax} /><YAxis type="category" dataKey="name" width={80} {...ax} /><Tooltip contentStyle={tooltipStyle} /><Bar dataKey="value" name="%" radius={[0, 6, 6, 0]}>{speakingTime.map((_, i) => <Cell key={i} fill={`var(--chart-${i + 1})`} />)}</Bar></BarChart></ResponsiveContainer></div></Panel>
        <Panel title="Décisions par réunion"><div className="h-60"><ResponsiveContainer><BarChart data={meetings.filter((m) => m.status === "done")}><CartesianGrid stroke="var(--border)" vertical={false} /><XAxis dataKey="id" {...ax} /><YAxis {...ax} /><Tooltip contentStyle={tooltipStyle} /><Bar dataKey="decisions" name="Décisions" fill="var(--success)" radius={[6, 6, 0, 0]} /></BarChart></ResponsiveContainer></div></Panel>
        <Panel title="Taux de complétion des tâches"><div className="h-60"><ResponsiveContainer><LineChart data={completion}><CartesianGrid stroke="var(--border)" vertical={false} /><XAxis dataKey="w" {...ax} /><YAxis {...ax} /><Tooltip contentStyle={tooltipStyle} /><Line dataKey="v" name="%" stroke="var(--success)" strokeWidth={2} /></LineChart></ResponsiveContainer></div></Panel>
        <Panel title="CO₂ moyen par heure"><div className="h-60"><ResponsiveContainer><LineChart data={co2Series}><CartesianGrid stroke="var(--border)" vertical={false} /><XAxis dataKey="t" {...ax} /><YAxis {...ax} /><Tooltip contentStyle={tooltipStyle} /><Line dataKey="co2" name="ppm" stroke="var(--warning)" dot={false} strokeWidth={2} /></LineChart></ResponsiveContainer></div></Panel>
      </div>
    </>
  );
}
