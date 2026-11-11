import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { Bar, BarChart, Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";
import { ArrowLeft, Gavel, ListChecks, Sparkles, Download } from "lucide-react";
import { PageHeader, Panel, Kpi, tooltipStyle } from "@/components/app/ui";
import { meetings, transcript, decisions, tasks, topics, speakingTime, co2Series } from "@/lib/demo-data";
import { seo } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/meetings/$id")({
  loader: ({ params }) => { const m = meetings.find((x) => x.id === params.id); if (!m) throw notFound(); return m; },
  head: ({ loaderData }) => seo(loaderData?.title ?? "Réunion", "Résumé IA, transcription, décisions et tâches de la réunion."),
  component: MeetingDetails,
});
const colors = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)"];
const tabs = ["Vue d'ensemble", "Transcription", "Décisions", "Tâches", "Sujets", "Timeline", "Environnement"] as const;

function MeetingDetails() {
  const m = Route.useLoaderData();
  const [tab, setTab] = useState<(typeof tabs)[number]>("Vue d'ensemble");
  const [q, setQ] = useState("");
  return (
    <>
      <Link to="/meetings" className="mb-3 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="h-4 w-4" />Réunions</Link>
      <PageHeader title={m.title} subtitle={`${m.date} · ${m.time} · ${m.duration} · ${m.room} · ${m.participants} participants`} actions={<button className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm"><Download className="h-4 w-4" />Export PDF</button>} />
      <div className="mb-6 flex gap-1 overflow-x-auto border-b border-border">
        {tabs.map((t) => <button key={t} onClick={() => setTab(t)} className={cn("whitespace-nowrap border-b-2 px-4 py-2 text-sm", tab === t ? "border-primary text-foreground" : "border-transparent text-muted-foreground")}>{t}</button>)}
      </div>
      {tab === "Vue d'ensemble" && (
        <div className="grid gap-6 lg:grid-cols-3">
          <Panel title="Résumé IA" className="lg:col-span-2" action={<Sparkles className="h-4 w-4 text-violet" />}>
            <p className="leading-relaxed text-foreground/90">L'équipe a planifié le sprint v2 de SmartMeet. Les priorités retenues sont la diarisation des intervenants et la transcription française via Whisper. Une alerte qualité de l'air sera ajoutée. Lina prend en charge le dashboard analytics et Ahmed l'export PDF ; la démo jury est fixée au 12 novembre.</p>
            <div className="mt-5 grid grid-cols-3 gap-3">
              <Kpi label="Score" value={m.score ? `${m.score}` : "—"} icon={<Sparkles className="h-4 w-4" />} />
              <Kpi label="Décisions" value={`${m.decisions}`} icon={<Gavel className="h-4 w-4" />} />
              <Kpi label="Tâches" value={`${m.tasks}`} icon={<ListChecks className="h-4 w-4" />} />
            </div>
          </Panel>
          <Panel title="Temps de parole">
            <div className="h-56"><ResponsiveContainer><PieChart><Pie data={speakingTime} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80} paddingAngle={3}>{speakingTime.map((_, i) => <Cell key={i} fill={colors[i]} stroke="none" />)}</Pie><Tooltip contentStyle={tooltipStyle} /></PieChart></ResponsiveContainer></div>
            <div className="space-y-1 text-sm">{speakingTime.map((s, i) => <div key={s.name} className="flex items-center gap-2"><span className="h-2 w-2 rounded-full" style={{ background: colors[i] }} />{s.name}<span className="ml-auto text-muted-foreground">{s.value}%</span></div>)}</div>
          </Panel>
        </div>
      )}
      {tab === "Transcription" && (
        <Panel>
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Rechercher dans la transcription…" className="mb-4 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" />
          <div className="space-y-3">
            {transcript.filter((l) => l.text.toLowerCase().includes(q.toLowerCase())).map((l, i) => (
              <div key={i} className={cn("flex gap-4 rounded-lg p-3", l.decision && "bg-primary/10", l.task && "bg-violet/10")}>
                <span className="font-mono text-xs text-muted-foreground">{l.t}</span>
                <div><div className="text-sm font-semibold">{l.who} {l.decision && <span className="ml-2 text-xs text-primary">● Décision</span>}{l.task && <span className="ml-2 text-xs text-violet">● Tâche</span>}</div><p className="text-sm text-foreground/85">{l.text}</p></div>
              </div>
            ))}
          </div>
        </Panel>
      )}
      {tab === "Décisions" && (
        <div className="grid gap-4 md:grid-cols-2">{decisions.map((d) => (
          <div key={d.id} className="panel p-5"><div className="flex items-center gap-2 text-primary"><Gavel className="h-4 w-4" /><span className="text-xs uppercase tracking-wider">Décision #{d.id}</span></div><p className="mt-2 font-medium">{d.text}</p>
            <div className="mt-3 flex justify-between text-xs text-muted-foreground"><span>{d.by} · {d.at}</span><span>Confiance IA {d.confidence}%</span></div></div>
        ))}</div>
      )}
      {tab === "Tâches" && (
        <Panel><div className="divide-y divide-border">{tasks.slice(0, 4).map((t) => (
          <div key={t.id} className="flex items-center gap-4 py-3 text-sm"><span className="font-mono text-xs text-muted-foreground">{t.id}</span><span className="flex-1 font-medium">{t.title}</span><span className="text-muted-foreground">{t.owner}</span><span className="text-muted-foreground">{t.due}</span></div>
        ))}</div><Link to="/tasks" className="mt-4 inline-block text-sm text-primary">Ouvrir le Kanban →</Link></Panel>
      )}
      {tab === "Sujets" && (
        <Panel title="Répartition des sujets"><div className="h-72"><ResponsiveContainer><BarChart data={topics} layout="vertical"><XAxis type="number" stroke="var(--muted-foreground)" fontSize={12} /><YAxis type="category" dataKey="name" width={130} stroke="var(--muted-foreground)" fontSize={12} /><Tooltip contentStyle={tooltipStyle} /><Bar dataKey="pct" name="%" radius={[0, 6, 6, 0]}>{topics.map((_, i) => <Cell key={i} fill={colors[i]} />)}</Bar></BarChart></ResponsiveContainer></div></Panel>
      )}
      {tab === "Timeline" && (
        <Panel title="Timeline interactive">
          <div className="relative ml-3 border-l border-border">
            {transcript.map((l, i) => (
              <div key={i} className="relative mb-5 pl-6">
                <span className={cn("absolute -left-[7px] top-1 h-3 w-3 rounded-full", l.decision ? "bg-primary" : l.task ? "bg-violet" : "bg-muted-foreground")} />
                <div className="font-mono text-xs text-muted-foreground">{l.t} · {l.who}</div><div className="text-sm">{l.text}</div>
              </div>
            ))}
          </div>
        </Panel>
      )}
      {tab === "Environnement" && (
        <Panel title="CO₂ et température pendant la réunion"><div className="h-72"><ResponsiveContainer><LineChart data={co2Series}><CartesianGrid stroke="var(--border)" vertical={false} /><XAxis dataKey="t" stroke="var(--muted-foreground)" fontSize={11} /><YAxis yAxisId="a" stroke="var(--muted-foreground)" fontSize={11} /><YAxis yAxisId="b" orientation="right" stroke="var(--muted-foreground)" fontSize={11} /><Tooltip contentStyle={tooltipStyle} /><Line yAxisId="a" dataKey="co2" name="CO₂" stroke="var(--primary)" dot={false} strokeWidth={2} /><Line yAxisId="b" dataKey="temp" name="°C" stroke="var(--warning)" dot={false} strokeWidth={2} /></LineChart></ResponsiveContainer></div></Panel>
      )}
    </>
  );
}
