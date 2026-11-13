import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Play, Square, Flag, Camera, Mic, Users } from "lucide-react";
import { PageHeader, Panel, StatusPill } from "@/components/app/ui";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/live")({ head: () => seo("Réunion en direct", "Caméra, reconnaissance faciale et transcription attribuée à chaque intervenant."), component: Live });

type Line = { t: string; who: string; text: string };
const LS = "smartmeet.live.transcript";
const fmtT = (s: number) => `${String(Math.floor(s / 3600)).padStart(2, "0")}:${String(Math.floor((s % 3600) / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

function Live() {
  const [running, setRunning] = useState(false);
  const [sec, setSec] = useState(0);
  const [lines, setLines] = useState<Line[]>([]);
  const [interim, setInterim] = useState("");
  const [faces, setFaces] = useState<{ name: string; speaking: boolean }[]>([]);
  const [speaker, setSpeaker] = useState<string | null>(null);
  const [enrolled, setEnrolled] = useState(0);
  const video = useRef<HTMLVideoElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const stop = useRef<() => void>(() => {});
  const startAt = useRef(0);
  const talk = useRef<Record<string, number>>({});

  useEffect(() => {
    try { setLines(JSON.parse(localStorage.getItem(LS) || "[]")); } catch { /* empty */ }
    import("@/lib/faces").then((m) => setEnrolled(m.loadPeople().length));
    return () => stop.current();
  }, []);
  useEffect(() => { if (!running) return; const i = setInterval(() => setSec(Math.floor((Date.now() - startAt.current) / 1000)), 500); return () => clearInterval(i); }, [running]);

  function addLine(text: string) {
    const scores = talk.current; talk.current = {};
    const best = Object.entries(scores).sort((a, b) => b[1] - a[1])[0];
    const who = best && best[1] > 0 ? best[0] : "Inconnu";
    setLines((l) => { const n = [...l, { t: fmtT(Math.floor((Date.now() - startAt.current) / 1000)), who, text }]; localStorage.setItem(LS, JSON.stringify(n)); return n; });
  }

  async function start() {
    let media: MediaStream;
    try { media = await navigator.mediaDevices.getUserMedia({ video: { width: 960, height: 540 }, audio: true }); }
    catch { toast.error("Autorisez la caméra et le micro"); return; }
    const v = video.current!; v.srcObject = media; await v.play();
    startAt.current = Date.now(); setSec(0); setRunning(true);
    toast("Chargement du modèle de reconnaissance…");
    const m = await import("@/lib/faces");
    const f = await m.loadFaceApi();
    const people = m.loadPeople();
    const matcher = people.length ? new f.FaceMatcher(people.map((p) => new f.LabeledFaceDescriptors(p.name, p.descriptors.map((d) => new Float32Array(d)))), 0.55) : null;
    const hist: Record<string, number[]> = {};
    let alive = true;

    const loop = async () => {
      if (!alive) return;
      const res = await f.detectAllFaces(v, new f.TinyFaceDetectorOptions({ inputSize: 320 })).withFaceLandmarks().withFaceDescriptors();
      const c = canvas.current; if (!c || !alive) return;
      c.width = v.videoWidth; c.height = v.videoHeight;
      const ctx = c.getContext("2d")!; ctx.clearRect(0, 0, c.width, c.height);
      const seen: { name: string; speaking: boolean }[] = [];
      res.forEach((r, idx) => {
        const name = matcher ? matcher.findBestMatch(r.descriptor).label.replace("unknown", "Inconnu") : "Inconnu";
        const key = name === "Inconnu" ? `Inconnu-${idx}` : name;
        const h = (hist[key] ||= []); h.push(m.mouthOpen(r.landmarks.positions)); if (h.length > 8) h.shift();
        const mean = h.reduce((a, b) => a + b, 0) / h.length;
        const sd = Math.sqrt(h.reduce((a, b) => a + (b - mean) ** 2, 0) / h.length);
        const speaking = h.length > 3 && sd > 0.012;
        if (speaking && name !== "Inconnu") talk.current[name] = (talk.current[name] || 0) + sd;
        seen.push({ name, speaking });
        const b = r.detection.box; const x = c.width - b.x - b.width; // mirrored
        ctx.lineWidth = 3; ctx.strokeStyle = speaking ? "#22c55e" : "#38bdf8"; ctx.strokeRect(x, b.y, b.width, b.height);
        ctx.fillStyle = ctx.strokeStyle; ctx.font = "bold 18px sans-serif"; ctx.fillText(`${name}${speaking ? " 🎙" : ""}`, x, b.y - 8);
      });
      setFaces(seen);
      const cur = seen.find((s) => s.speaking && s.name !== "Inconnu"); setSpeaker(cur?.name ?? null);
      setTimeout(loop, 120);
    };
    loop();

    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    let rec: any = null;
    if (!SR) toast.error("Transcription vocale non supportée : utilisez Chrome ou Edge");
    else {
      rec = new SR(); rec.lang = "fr-FR"; rec.continuous = true; rec.interimResults = true;
      rec.onresult = (e: any) => {
        let tmp = "";
        for (let i = e.resultIndex; i < e.results.length; i++) {
          const t = e.results[i][0].transcript.trim();
          if (e.results[i].isFinal) { if (t) addLine(t); } else tmp += t + " ";
        }
        setInterim(tmp);
      };
      rec.onend = () => { if (alive) try { rec.start(); } catch { /* restarting */ } };
      rec.start();
    }

    stop.current = () => { alive = false; rec?.stop(); media.getTracks().forEach((t) => t.stop()); };
  }

  function end() { stop.current(); setRunning(false); setInterim(""); setFaces([]); setSpeaker(null); toast.success("Réunion terminée · transcription enregistrée"); }
  function clear() { localStorage.removeItem(LS); setLines([]); }
  const speakTime = lines.reduce<Record<string, number>>((a, l) => ({ ...a, [l.who]: (a[l.who] || 0) + l.text.split(" ").length }), {});
  const total = Object.values(speakTime).reduce((a, b) => a + b, 0) || 1;

  return (
    <>
      <PageHeader title="Réunion en direct" subtitle="Webcam · reconnaissance faciale · transcription par intervenant" actions={<StatusPill status={running ? "live" : "done"} />} />
      {enrolled === 0 && <div className="mb-4 rounded-lg border border-warning/40 bg-warning/10 p-3 text-sm">Aucun visage enregistré. <Link to="/people" className="text-primary underline">Ajoutez les participants</Link> pour que leurs noms apparaissent.</div>}
      <div className="grid gap-6 lg:grid-cols-3">
        <Panel className="lg:col-span-2" title="Caméra" action={<span className="font-mono text-lg text-brand">{fmtT(sec)}</span>}>
          <div className="relative aspect-video overflow-hidden rounded-lg bg-muted/50">
            <video ref={video} muted playsInline className="h-full w-full -scale-x-100 object-cover" />
            <canvas ref={canvas} className="pointer-events-none absolute inset-0 h-full w-full object-cover" />
            {!running && <div className="absolute inset-0 grid place-items-center text-sm text-muted-foreground"><Camera className="mb-2 h-8 w-8" /></div>}
          </div>
          <div className="mt-4 flex flex-wrap justify-center gap-3">
            {!running ? <button onClick={start} className="inline-flex items-center gap-2 rounded-lg bg-brand px-5 py-2.5 text-sm text-primary-foreground"><Play className="h-4 w-4" />Démarrer la réunion</button> : <>
              <button onClick={() => toast("Moment marqué à " + fmtT(sec))} className="inline-flex items-center gap-2 rounded-lg border border-border px-5 py-2.5 text-sm"><Flag className="h-4 w-4" />Marquer</button>
              <button onClick={end} className="inline-flex items-center gap-2 rounded-lg bg-destructive px-5 py-2.5 text-sm text-destructive-foreground"><Square className="h-4 w-4" />Terminer</button></>}
          </div>
        </Panel>
        <Panel title="Personnes détectées" action={<Users className="h-4 w-4 text-muted-foreground" />}>
          <div className="mb-4 rounded-lg bg-muted/50 p-3 text-sm"><Mic className="mr-2 inline h-4 w-4 text-success" />Parle maintenant : <b>{speaker ?? "—"}</b></div>
          <div className="space-y-2">{faces.length === 0 ? <p className="text-sm text-muted-foreground">Aucun visage à l'écran.</p> : faces.map((p, i) => <div key={i} className="flex items-center gap-2 text-sm"><span className={`h-2 w-2 rounded-full ${p.speaking ? "bg-success" : "bg-muted-foreground"}`} />{p.name}</div>)}</div>
          <h3 className="mb-2 mt-6 text-xs uppercase tracking-wider text-muted-foreground">Temps de parole</h3>
          <div className="space-y-2">{Object.entries(speakTime).map(([n, v]) => <div key={n} className="text-sm"><div className="flex justify-between"><span>{n}</span><span className="text-muted-foreground">{Math.round((v / total) * 100)}%</span></div><div className="mt-1 h-1.5 rounded-full bg-muted"><div className="h-full rounded-full bg-brand" style={{ width: `${(v / total) * 100}%` }} /></div></div>)}</div>
        </Panel>
        <Panel title="Transcription live" className="lg:col-span-3" action={lines.length > 0 && !running ? <button onClick={clear} className="text-xs text-muted-foreground">Effacer</button> : undefined}>
          <div className="space-y-2">
            {lines.length === 0 && !interim && <p className="text-sm text-muted-foreground">Démarrez la réunion et parlez : chaque phrase sera attribuée à la personne dont les lèvres bougent.</p>}
            {lines.map((l, i) => <div key={i} className="flex gap-3 text-sm"><span className="font-mono text-xs text-muted-foreground">{l.t}</span><b className={l.who === "Inconnu" ? "text-muted-foreground" : "text-primary"}>{l.who}</b><span className="text-foreground/85">{l.text}</span></div>)}
            {interim && <div className="text-sm italic text-muted-foreground">{speaker ?? "…"} : {interim}</div>}
          </div>
        </Panel>
      </div>
    </>
  );
}
