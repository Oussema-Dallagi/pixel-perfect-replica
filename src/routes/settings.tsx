import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { PageHeader, Panel } from "@/components/app/ui";
import { Switch } from "@/components/ui/switch";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/settings")({ head: () => seo("Paramètres", "Profil, notifications, seuils capteurs et connexion MQTT."), component: Settings });
const field = "w-full rounded-lg border border-input bg-background px-3 py-2 text-sm";

function Settings() {
  return (
    <>
      <PageHeader title="Paramètres" />
      <div className="grid max-w-4xl gap-6 md:grid-cols-2">
        <Panel title="Profil"><div className="space-y-3"><input className={field} defaultValue="Oussema Dallagi" /><input className={field} defaultValue="oussema@smartmeet.ai" /><select className={field} defaultValue="admin"><option value="admin">Administrateur</option><option>Manager</option><option>Membre</option></select></div></Panel>
        <Panel title="Connexion MQTT"><div className="space-y-3"><input className={field} defaultValue="mqtts://broker.smartmeet.ai:8883" /><input className={field} defaultValue="smartmeet/+/telemetry" /></div></Panel>
        <Panel title="Seuils d'alerte"><div className="space-y-3 text-sm"><label className="block">CO₂ max (ppm)<input className={field} type="number" defaultValue={1000} /></label><label className="block">Température max (°C)<input className={field} type="number" defaultValue={27} /></label></div></Panel>
        <Panel title="Notifications"><div className="space-y-4 text-sm">{["Alertes qualité de l'air", "Appareil hors ligne", "Résumé IA prêt", "Tâches en retard"].map((l) => <label key={l} className="flex items-center justify-between">{l}<Switch defaultChecked /></label>)}</div></Panel>
      </div>
      <button onClick={() => toast.success("Paramètres enregistrés")} className="mt-6 rounded-lg bg-brand px-5 py-2.5 text-sm text-primary-foreground">Enregistrer</button>
    </>
  );
}
