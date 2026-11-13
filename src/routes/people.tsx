import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Camera, Upload, Trash2, UserPlus } from "lucide-react";
import { PageHeader, Panel } from "@/components/app/ui";
import { seo } from "@/lib/seo";
import type { Person } from "@/lib/faces";

export const Route = createFileRoute("/people")({ head: () => seo("Participants", "Enregistrez le visage des participants pour la reconnaissance faciale."), component: People });

function People() {
  const [people, setPeople] = useState<Person[]>([]);
  const [name, setName] = useState("");
  const [cam, setCam] = useState(false);
  const [busy, setBusy] = useState(false);
  const video = useRef<HTMLVideoElement>(null);
  const stream = useRef<MediaStream | null>(null);

  useEffect(() => { import("@/lib/faces").then((m) => { setPeople(m.loadPeople()); m.loadFaceApi().catch(() => toast.error("Impossible de charger le modèle")); }); return () => stream.current?.getTracks().forEach((t) => t.stop()); }, []);

  async function startCam() {
    try { stream.current = await navigator.mediaDevices.getUserMedia({ video: true }); setCam(true); setTimeout(() => { if (video.current) { video.current.srcObject = stream.current; video.current.play(); } }); }
    catch { toast.error("Accès caméra refusé"); }
  }

  async function enroll(src: HTMLVideoElement | HTMLImageElement) {
    if (!name.trim()) { toast.error("Saisissez d'abord le nom"); return; }
    setBusy(true);
    try {
      const m = await import("@/lib/faces");
      const d = await m.describe(src);
      if (!d) { toast.error("Aucun visage détecté, réessayez"); return; }
      const list = m.loadPeople();
      const existing = list.find((p) => p.name.toLowerCase() === name.trim().toLowerCase());
      if (existing) existing.descriptors.push(d); else list.push({ id: crypto.randomUUID(), name: name.trim(), descriptors: [d], photo: m.snapshot(src) });
      m.savePeople(list); setPeople([...list]);
      toast.success(existing ? `Visage ajouté pour ${existing.name}` : `${name.trim()} enregistré`);
    } finally { setBusy(false); }
  }

  function onFile(file?: File) {
    if (!file) return;
    const img = new Image(); img.onload = () => enroll(img); img.src = URL.createObjectURL(file);
  }

  async function remove(id: string) {
    const m = await import("@/lib/faces"); const list = m.loadPeople().filter((p) => p.id !== id); m.savePeople(list); setPeople(list);
  }

  return (
    <>
      <PageHeader title="Participants" subtitle="Enregistrez chaque visage une fois : il sera reconnu pendant les réunions." />
      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="Ajouter un visage">
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nom de la personne" className="mb-4 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" />
          <div className="aspect-video overflow-hidden rounded-lg bg-muted/50">
            {cam ? <video ref={video} muted playsInline className="h-full w-full -scale-x-100 object-cover" /> : <div className="grid h-full place-items-center text-sm text-muted-foreground">Caméra éteinte</div>}
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {!cam ? <button onClick={startCam} className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm"><Camera className="h-4 w-4" />Allumer la webcam</button>
              : <button disabled={busy} onClick={() => video.current && enroll(video.current)} className="inline-flex items-center gap-2 rounded-lg bg-brand px-4 py-2 text-sm text-primary-foreground disabled:opacity-50"><UserPlus className="h-4 w-4" />{busy ? "Analyse…" : "Capturer le visage"}</button>}
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm"><Upload className="h-4 w-4" />Envoyer une photo<input type="file" accept="image/*" className="hidden" onChange={(e) => onFile(e.target.files?.[0])} /></label>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">Astuce : capturez 2-3 fois la même personne pour une meilleure reconnaissance.</p>
        </Panel>
        <Panel title={`Visages enregistrés (${people.length})`}>
          {people.length === 0 ? <p className="text-sm text-muted-foreground">Aucun participant pour l'instant.</p> : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {people.map((p) => (
                <div key={p.id} className="rounded-lg bg-muted/50 p-3 text-center">
                  <img src={p.photo} alt={p.name} className="mx-auto h-20 w-20 rounded-full object-cover" />
                  <div className="mt-2 text-sm font-medium">{p.name}</div>
                  <div className="text-xs text-muted-foreground">{p.descriptors.length} capture(s)</div>
                  <button onClick={() => remove(p.id)} className="mt-2 text-xs text-destructive"><Trash2 className="inline h-3 w-3" /> Supprimer</button>
                </div>
              ))}
            </div>
          )}
        </Panel>
      </div>
    </>
  );
}
