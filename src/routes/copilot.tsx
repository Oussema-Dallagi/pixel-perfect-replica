import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Send, Sparkles } from "lucide-react";
import { PageHeader } from "@/components/app/ui";
import { decisions, tasks } from "@/lib/demo-data";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/copilot")({ head: () => seo("AI Copilot", "Posez vos questions sur vos réunions, décisions et tâches."), component: Copilot });
const suggestions = ["Quelles décisions ont été prises cette semaine ?", "Quelles tâches sont en retard ?", "Résume la dernière réunion", "Quelle salle a la pire qualité d'air ?"];

function answer(q: string) {
  const s = q.toLowerCase();
  if (s.includes("décision")) return "Décisions récentes :\n" + decisions.map((d) => `• ${d.text} (${d.by})`).join("\n");
  if (s.includes("tâche")) return "Tâches ouvertes :\n" + tasks.filter((t) => t.status !== "done").map((t) => `• ${t.title} → ${t.owner}, échéance ${t.due}`).join("\n");
  if (s.includes("air") || s.includes("co2") || s.includes("salle")) return "L'Open Space (ESP32-C3) a dépassé 1000 ppm de CO₂ pendant 14 min hier. L'appareil est actuellement hors ligne (batterie 12 %).";
  return "La réunion « Sprint Planning – SmartMeet v2 » a validé la diarisation et Whisper pour la transcription. 7 tâches ont été créées, dont le dashboard analytics (Lina) et l'export PDF (Ahmed).";
}

function Copilot() {
  const [msgs, setMsgs] = useState<{ r: "u" | "a"; t: string }[]>([{ r: "a", t: "Bonjour Oussama ! Je connais toutes vos réunions. Que voulez-vous savoir ?" }]);
  const [v, setV] = useState("");
  const ask = (q: string) => { if (!q.trim()) return; setMsgs((m) => [...m, { r: "u", t: q }]); setV(""); setTimeout(() => setMsgs((m) => [...m, { r: "a", t: answer(q) }]), 600); };
  return (
    <>
      <PageHeader title="AI Copilot" subtitle="Assistant de démonstration — réponses basées sur les données d'exemple" />
      <div className="panel mx-auto flex h-[65vh] max-w-3xl flex-col">
        <div className="flex-1 space-y-4 overflow-auto p-5">
          {msgs.map((m, i) => (
            <div key={i} className={`flex gap-3 ${m.r === "u" ? "justify-end" : ""}`}>
              {m.r === "a" && <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-brand"><Sparkles className="h-4 w-4 text-primary-foreground" /></div>}
              <div className={`max-w-[80%] whitespace-pre-line rounded-2xl px-4 py-2.5 text-sm ${m.r === "u" ? "bg-primary text-primary-foreground" : "bg-muted"}`}>{m.t}</div>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap gap-2 px-5 pb-3">{suggestions.map((s) => <button key={s} onClick={() => ask(s)} className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground hover:border-primary hover:text-primary">{s}</button>)}</div>
        <form onSubmit={(e) => { e.preventDefault(); ask(v); }} className="flex gap-2 border-t border-border p-4">
          <input value={v} onChange={(e) => setV(e.target.value)} placeholder="Posez une question…" className="flex-1 rounded-lg border border-input bg-background px-3 py-2 text-sm" />
          <button aria-label="Envoyer" className="rounded-lg bg-brand px-4 text-primary-foreground"><Send className="h-4 w-4" /></button>
        </form>
      </div>
    </>
  );
}
