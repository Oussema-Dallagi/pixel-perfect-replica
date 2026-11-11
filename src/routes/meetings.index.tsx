import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { PageHeader, StatusPill } from "@/components/app/ui";
import { meetings as initial } from "@/lib/demo-data";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/meetings/")({ head: () => seo("Réunions", "Historique, planification et recherche de toutes vos réunions."), component: Meetings });

function Meetings() {
  const [q, setQ] = useState(""); const [filter, setFilter] = useState("all");
  const [list, setList] = useState(initial); const [open, setOpen] = useState(false); const [title, setTitle] = useState("");
  const rows = list.filter((m) => (filter === "all" || m.status === filter) && m.title.toLowerCase().includes(q.toLowerCase()));
  return (
    <>
      <PageHeader title="Réunions" subtitle={`${list.length} réunions`} actions={<button onClick={() => setOpen(!open)} className="inline-flex items-center gap-2 rounded-lg bg-brand px-4 py-2 text-sm text-primary-foreground"><Plus className="h-4 w-4" />Nouvelle réunion</button>} />
      {open && (
        <form className="panel mb-4 flex flex-wrap gap-2 p-4" onSubmit={(e) => { e.preventDefault(); if (!title.trim()) return;
          setList([{ id: `m-${Date.now()}`, title, date: "À venir", time: "—", duration: "—", room: "Salle Innovation", participants: 0, decisions: 0, tasks: 0, score: 0, status: "scheduled" }, ...list]);
          setTitle(""); setOpen(false); toast.success("Réunion planifiée"); }}>
          <input autoFocus value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Titre de la réunion" className="flex-1 rounded-lg border border-input bg-background px-3 py-2 text-sm" />
          <button className="rounded-lg bg-primary px-4 py-2 text-sm text-primary-foreground">Créer</button>
        </form>
      )}
      <div className="mb-4 flex flex-wrap gap-2">
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Rechercher…" className="rounded-lg border border-input bg-card px-3 py-2 text-sm" />
        {([["all", "Toutes"], ["live", "En direct"], ["done", "Terminées"], ["scheduled", "Planifiées"]] as const).map(([k, l]) => (
          <button key={k} onClick={() => setFilter(k)} className={`rounded-lg px-3 py-2 text-sm ${filter === k ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>{l}</button>
        ))}
      </div>
      <div className="panel overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-left text-xs uppercase tracking-wider text-muted-foreground"><tr>{["Réunion", "Date", "Durée", "Salle", "Décisions", "Tâches", "Score", "Statut"].map((h) => <th key={h} className="px-4 py-3 font-medium">{h}</th>)}</tr></thead>
          <tbody className="divide-y divide-border">
            {rows.map((m) => (
              <tr key={m.id} className="hover:bg-accent/40">
                <td className="px-4 py-3 font-medium">{m.status === "live" ? <Link to="/live" className="hover:text-primary">{m.title}</Link> : <Link to="/meetings/$id" params={{ id: m.id }} className="hover:text-primary">{m.title}</Link>}</td>
                <td className="px-4 py-3 text-muted-foreground">{m.date} {m.time}</td><td className="px-4 py-3">{m.duration}</td><td className="px-4 py-3 text-muted-foreground">{m.room}</td>
                <td className="px-4 py-3">{m.decisions}</td><td className="px-4 py-3">{m.tasks}</td><td className="px-4 py-3">{m.score ? `${m.score}/100` : "—"}</td>
                <td className="px-4 py-3"><StatusPill status={m.status as "live"} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
