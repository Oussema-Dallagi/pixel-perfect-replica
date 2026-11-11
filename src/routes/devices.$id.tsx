import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Line, LineChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ArrowLeft, Play, Square, RotateCcw, Download, Mic } from "lucide-react";
import { PageHeader, Panel, StatusPill, tooltipStyle } from "@/components/app/ui";
import { devices, co2Series } from "@/lib/demo-data";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/devices/$id")({
  loader: ({ params }) => { const d = devices.find((x) => x.id === params.id); if (!d) throw notFound(); return d; },
  head: ({ loaderData }) => seo(loaderData?.name ?? "Appareil", `Capteurs, état et commandes à distance de ${loaderData?.room ?? "l'appareil"}.`),
  component: DeviceDetails,
});

function DeviceDetails() {
  const d = Route.useLoaderData();
  const [log, setLog] = useState<string[]>(["14:00:02 · START_RECORDING · ACK", "13:58:40 · PING · ACK"]);
  const send = (cmd: string) => {
    const t = new Date().toLocaleTimeString("fr-FR");
    setLog((l) => [`${t} · ${cmd} · ${d.status === "offline" ? "TIMEOUT" : "ACK"}`, ...l]);
    d.status === "offline" ? toast.error(`${cmd} : appareil hors ligne`) : toast.success(`${cmd} envoyé via MQTT`);
  };
  return (
    <>
      <Link to="/devices" className="mb-3 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="h-4 w-4" />Appareils</Link>
      <PageHeader title={d.name} subtitle={`${d.room} · ${d.id} · firmware ${d.firmware}`} actions={<StatusPill status={d.status} />} />
      <div className="grid gap-6 lg:grid-cols-3">
        <Panel title="Commandes à distance">
          <div className="grid grid-cols-2 gap-2">
            {[["START_RECORDING", Play], ["STOP_RECORDING", Square], ["MUTE_MIC", Mic], ["REBOOT", RotateCcw], ["OTA_UPDATE", Download]].map(([c, I]) => {
              const Icon = I as typeof Play;
              return <button key={c as string} onClick={() => send(c as string)} className="flex items-center gap-2 rounded-lg border border-border bg-muted/40 px-3 py-2.5 text-xs font-medium hover:border-primary hover:text-primary"><Icon className="h-4 w-4" />{(c as string).replace("_", " ")}</button>;
            })}
          </div>
          <div className="mt-5 text-xs uppercase tracking-wider text-muted-foreground">Journal MQTT</div>
          <div className="mt-2 max-h-48 space-y-1 overflow-auto font-mono text-xs">{log.map((l, i) => <div key={i} className={l.includes("TIMEOUT") ? "text-destructive" : "text-success"}>{l}</div>)}</div>
        </Panel>
        <Panel title="Capteurs (aujourd'hui)" className="lg:col-span-2">
          <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-5">
            {[["CO₂", `${d.co2} ppm`], ["Temp.", `${d.temp}°C`], ["Humidité", `${d.humidity}%`], ["Bruit", `${d.noise} dB`], ["Lumière", `${d.light} lx`]].map(([k, v]) => (
              <div key={k} className="rounded-lg bg-muted/50 p-3"><div className="text-xs text-muted-foreground">{k}</div><div className="font-display text-xl font-semibold">{d.status === "offline" ? "—" : v}</div></div>
            ))}
          </div>
          <div className="h-60"><ResponsiveContainer><LineChart data={co2Series}><CartesianGrid stroke="var(--border)" vertical={false} /><XAxis dataKey="t" stroke="var(--muted-foreground)" fontSize={11} /><YAxis stroke="var(--muted-foreground)" fontSize={11} /><Tooltip contentStyle={tooltipStyle} /><Line dataKey="co2" name="CO₂ ppm" stroke="var(--primary)" dot={false} strokeWidth={2} /></LineChart></ResponsiveContainer></div>
        </Panel>
      </div>
    </>
  );
}
