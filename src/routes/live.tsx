import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Pause, Play, Square, Flag } from "lucide-react";
import { PageHeader, Panel, StatusPill } from "@/components/app/ui";
import { transcript } from "@/lib/demo-data";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/live")({ head: () => seo("Réunion en direct", "Suivez l'enregistrement, la transcription et l'environnement en temps réel."), component: Live });

function Live() {
  const [sec, setSec] = useState(18 * 60 + 42); const [paused, setPaused] = useState(false); const [ended, setEnded] = useState(false);
  const [env, setEnv] = useState({ co2: 720, temp: 24.3, hum: 48, light: 350 });
  const [shown, setShown] = useState(3);
  useEffect(() => {
    if (paused || ended) return;
    const i = setInterval(() => {
      setSec((s) => s + 1);
      setEnv((e) => ({ co2: Math.round(e.co2 + (Math.random() * 6 - 2)), temp: +(e.temp + (Math.random() * 0.06 - 0.02)).toFixed(1), hum: e.hum, light: e.light }));
    }, 1000);
    const j = setInterval(() => setShown((n) => Math.min(transcript.length, n + 1)), 4000);
    return () => { clearInterval(i); clearInterval(j); };
  }, [paused, ended]);
  const fmt = `${String(Math.floor(sec / 3600)).padStart(2, "0")}:${String(Math.floor((sec % 3600) / 60)).padStart(2, "0")}:${String(sec % 60).padStart(2, "0")}`;
  return (
    <>
      <PageHeader title="Sprint Planning – SmartMeet v2" subtitle="Salle Innovation · ESP32-A1 · 5 participants" actions={<StatusPill status={ended ? "done" : "live"} />} />
      <div className="grid gap-6 lg:grid-cols-3">
        <Panel className="lg:col-span-2">
          <div className="text-center">
            <div className="font-mono text-6xl font-semibold tracking-tight text-brand">{fmt}</div>
            <div className="mx-auto mt-8 flex h-24 max-w-xl items-center justify-center gap-1">
              {Array.from({ length: 48 }).map((_, i) => <span key={i} className="wave-bar w-1.5 rounded-full bg-brand" style={{ height: `${30 + ((i * 37) % 70)}%`, animationDelay: `${(i % 12) * 0.08}s`, animationPlayState: paused || ended ? "paused" : "running" }} />)}
            </div>
            {!ended ? (
              <div className="mt-8 flex justify-center gap-3">
                <button onClick={() => setPaused(!paused)} className="inline-flex items-center gap-2 rounded-lg border border-border px-5 py-2.5 text-sm">{paused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}{paused ? "Reprendre" : "Pause"}</button>
                <button onClick={() => toast("Moment marqué à " + fmt)} className="inline-flex items-center gap-2 rounded-lg border border-border px-5 py-2.5 text-sm"><Flag className="h-4 w-4" />Marquer</button>
                <button onClick={() => { setEnded(true); toast.success("Réunion terminée · analyse IA en cours"); }} className="inline-flex items-center gap-2 rounded-lg bg-destructive px-5 py-2.5 text-sm text-destructive-foreground"><Square className="h-4 w-4" />Terminer</button>
              </div>
            ) : (
              <Link to="/meetings/$id" params={{ id: "m-1042" }} className="mt-8 inline-block rounded-lg bg-brand px-5 py-2.5 text-sm text-primary-foreground">Voir l'analyse IA →</Link>
            )}
          </div>
        </Panel>
        <Panel title="Environnement en direct">
          <div className="grid grid-cols-2 gap-3">
            {[["CO₂", `${env.co2}`, "ppm", env.co2 > 1000 ? "text-destructive" : env.co2 > 800 ? "text-warning" : "text-success"], ["Temp.", `${env.temp}`, "°C", "text-foreground"], ["Humidité", `${env.hum}`, "%", "text-foreground"], ["Lumière", `${env.light}`, "lx", "text-foreground"]].map(([k, v, u, c]) => (
              <div key={k} className="rounded-lg bg-muted/50 p-4"><div className="text-xs text-muted-foreground">{k}</div><div className={`font-display text-3xl font-semibold ${c}`}>{v}<span className="ml-1 text-sm text-muted-foreground">{u}</span></div></div>
            ))}
          </div>
        </Panel>
        <Panel title="Transcription live" className="lg:col-span-3">
          <div className="space-y-2">{transcript.slice(0, shown).map((l, i) => <div key={i} className="flex gap-3 text-sm"><span className="font-mono text-xs text-muted-foreground">{l.t}</span><b>{l.who}</b><span className="text-foreground/85">{l.text}</span></div>)}</div>
        </Panel>
      </div>
    </>
  );
}
