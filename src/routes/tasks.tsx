import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader, StatusPill } from "@/components/app/ui";
import { tasks as initial, type TaskStatus } from "@/lib/demo-data";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/tasks")({ head: () => seo("Tâches", "Kanban des tâches extraites automatiquement de vos réunions."), component: Tasks });
const cols: { k: TaskStatus; l: string }[] = [{ k: "todo", l: "À faire" }, { k: "progress", l: "En cours" }, { k: "review", l: "En revue" }, { k: "done", l: "Terminé" }];

function Tasks() {
  const [list, setList] = useState(initial); const [drag, setDrag] = useState<string | null>(null);
  return (
    <>
      <PageHeader title="Tâches" subtitle="Glissez une carte pour changer son statut" />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {cols.map((c) => (
          <div key={c.k} onDragOver={(e) => e.preventDefault()} onDrop={() => drag && setList((l) => l.map((t) => (t.id === drag ? { ...t, status: c.k } : t)))} className="panel min-h-64 p-3">
            <div className="mb-3 flex items-center justify-between px-1 text-sm font-medium">{c.l}<span className="rounded-full bg-muted px-2 text-xs text-muted-foreground">{list.filter((t) => t.status === c.k).length}</span></div>
            <div className="space-y-2">
              {list.filter((t) => t.status === c.k).map((t) => (
                <div key={t.id} draggable onDragStart={() => setDrag(t.id)} className="cursor-grab rounded-lg border border-border bg-background/60 p-3 hover:border-primary">
                  <div className="flex items-center justify-between"><span className="font-mono text-xs text-muted-foreground">{t.id}</span><StatusPill status={t.priority as "Haute"} /></div>
                  <div className="mt-2 text-sm font-medium">{t.title}</div>
                  <div className="mt-2 flex justify-between text-xs text-muted-foreground"><span>{t.owner}</span><span>{t.due}</span></div>
                  <div className="mt-1 text-xs text-muted-foreground/70">↳ {t.meeting}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
