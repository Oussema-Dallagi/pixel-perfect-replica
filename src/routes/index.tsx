import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { Sparkles, Cpu, Mic, BarChart3 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/")({ head: () => seo("Réunions intelligentes", "SmartMeet AI : pilotez vos boîtiers ESP32, enregistrez et analysez vos réunions avec l'IA."), component: Landing });

function Landing() {
  const navigate = useNavigate();
  useEffect(() => { supabase.auth.getSession().then(({ data }) => { if (data.session) navigate({ to: "/dashboard" }); }); }, [navigate]);
  return (
    <div className="mx-auto flex min-h-screen max-w-5xl flex-col px-6">
      <header className="flex items-center justify-between py-6">
        <div className="flex items-center gap-2"><div className="grid h-9 w-9 place-items-center rounded-lg bg-brand shadow-glow"><Sparkles className="h-5 w-5 text-primary-foreground" /></div><span className="font-display text-lg font-semibold">SmartMeet <span className="text-brand">AI</span></span></div>
        <Link to="/auth" search={{ redirect: undefined }} className="rounded-lg border border-border px-4 py-2 text-sm">Connexion</Link>
      </header>
      <main className="flex flex-1 flex-col justify-center py-16">
        <h1 className="max-w-3xl text-4xl font-semibold leading-tight md:text-6xl">Le centre de contrôle <span className="text-brand">intelligent</span> de vos réunions.</h1>
        <p className="mt-5 max-w-xl text-muted-foreground">Connectez vos boîtiers ESP32, surveillez vos salles en temps réel, transcrivez vos réunions et laissez l'IA extraire décisions et tâches.</p>
        <Link to="/auth" search={{ redirect: undefined }} className="mt-8 w-fit rounded-lg bg-brand px-6 py-3 text-sm font-medium text-primary-foreground shadow-glow">Commencer gratuitement</Link>
        <div className="mt-16 grid gap-4 md:grid-cols-3">
          {[[Cpu, "IoT Control Center", "État des appareils, capteurs et commandes à distance."], [Mic, "Meeting Intelligence", "Transcription live, résumés, décisions et tâches."], [BarChart3, "Analytics", "Productivité, participation et qualité de l'air."]].map(([I, t, d]) => {
            const Icon = I as typeof Cpu;
            return <div key={t as string} className="panel p-5"><Icon className="h-5 w-5 text-primary" /><div className="mt-3 font-medium">{t as string}</div><div className="mt-1 text-sm text-muted-foreground">{d as string}</div></div>;
          })}
        </div>
      </main>
    </div>
  );
}
