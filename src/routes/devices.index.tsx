import { createFileRoute, Link } from "@tanstack/react-router";
import { Battery, Wifi, Wind, Thermometer, Plus } from "lucide-react";
import { PageHeader, StatusPill } from "@/components/app/ui";
import { devices } from "@/lib/demo-data";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/devices/")({ head: () => seo("Appareils", "Gérez et surveillez vos boîtiers ESP32 SmartMeet."), component: Devices });

function Devices() {
  return (
    <>
      <PageHeader title="Appareils IoT" subtitle="3 boîtiers ESP32 enregistrés" actions={<button className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm text-primary-foreground"><Plus className="h-4 w-4" />Ajouter</button>} />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {devices.map((d) => (
          <Link key={d.id} to="/devices/$id" params={{ id: d.id }} className="panel block p-5 transition hover:shadow-glow">
            <div className="flex items-start justify-between"><div><div className="font-display text-lg font-semibold">{d.name}</div><div className="text-xs text-muted-foreground">{d.room} · {d.id}</div></div><StatusPill status={d.status} /></div>
            <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
              <Stat icon={<Battery className="h-4 w-4" />} label="Batterie" v={`${d.battery}%`} />
              <Stat icon={<Wifi className="h-4 w-4" />} label="Wi-Fi" v={`${d.wifi} dBm`} />
              <Stat icon={<Wind className="h-4 w-4" />} label="CO₂" v={d.co2 ? `${d.co2} ppm` : "—"} />
              <Stat icon={<Thermometer className="h-4 w-4" />} label="Temp." v={d.temp ? `${d.temp}°C` : "—"} />
            </div>
            <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-muted"><div className="h-full bg-brand" style={{ width: `${d.battery}%` }} /></div>
            <div className="mt-3 text-xs text-muted-foreground">Firmware {d.firmware} · vu {d.lastSeen}</div>
          </Link>
        ))}
      </div>
    </>
  );
}
function Stat({ icon, label, v }: { icon: React.ReactNode; label: string; v: string }) {
  return <div className="rounded-lg bg-muted/50 p-2.5"><div className="flex items-center gap-1.5 text-xs text-muted-foreground">{icon}{label}</div><div className="mt-1 font-medium">{v}</div></div>;
}
