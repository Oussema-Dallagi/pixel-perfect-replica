import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/auth")({
  validateSearch: (s: Record<string, unknown>) => ({ redirect: typeof s.redirect === "string" ? s.redirect : undefined }),
  head: () => seo("Connexion", "Connectez-vous à votre espace SmartMeet AI."),
  component: AuthPage,
});
const field = "w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-primary";

function AuthPage() {
  const { redirect } = Route.useSearch();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"in" | "up">("in");
  const [email, setEmail] = useState(""); const [password, setPassword] = useState(""); const [name, setName] = useState("");
  const [busy, setBusy] = useState(false); const [sent, setSent] = useState(false);
  const go = () => { const r = redirect && redirect.startsWith("/") && !redirect.startsWith("//") ? redirect : "/dashboard"; navigate({ to: r }); };

  async function submit(e: React.FormEvent) {
    e.preventDefault(); setBusy(true);
    try {
      if (mode === "in") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error; go();
      } else {
        const { data, error } = await supabase.auth.signUp({ email, password, options: { emailRedirectTo: window.location.origin + "/dashboard", data: { full_name: name } } });
        if (error) throw error;
        if (data.session) go(); else setSent(true);
      }
    } catch (err) { toast.error((err as Error).message); } finally { setBusy(false); }
  }
  async function google() {
    const r = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin + "/auth" });
    if (r.error) return toast.error(String(r.error.message ?? r.error));
    if (r.redirected) return;
    go();
  }

  return (
    <div className="grid min-h-screen place-items-center px-4">
      <div className="panel w-full max-w-sm p-8">
        <div className="mb-6 flex items-center gap-2">
          <div className="grid h-9 w-9 place-items-center rounded-lg bg-brand shadow-glow"><Sparkles className="h-5 w-5 text-primary-foreground" /></div>
          <div className="font-display text-lg font-semibold">SmartMeet <span className="text-brand">AI</span></div>
        </div>
        {sent ? (
          <p className="text-sm">Un e-mail de confirmation a été envoyé à <b>{email}</b>. Cliquez sur le lien pour activer votre compte.</p>
        ) : (
          <>
            <h1 className="text-xl font-semibold">{mode === "in" ? "Connexion" : "Créer un compte"}</h1>
            <button type="button" onClick={google} className="mt-5 flex w-full items-center justify-center gap-2.5 rounded-lg border border-[#8E918F] bg-[#131314] px-3 py-2.5 text-sm font-medium text-[#E3E3E3]">
              <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z"/><path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09C3.26 21.3 7.31 24 12 24z"/><path fill="#FBBC05" d="M5.27 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.98-3.09z"/><path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.98 3.09c.95-2.85 3.6-4.96 6.73-4.96z"/></svg>
              Continue with Google
            </button>
            <div className="my-4 text-center text-xs text-muted-foreground">ou par e-mail</div>
            <form onSubmit={submit} className="space-y-3">
              {mode === "up" && <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Nom complet" className={field} />}
              <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="E-mail" className={field} />
              <input required type="password" minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Mot de passe" className={field} />
              <button disabled={busy} className="w-full rounded-lg bg-brand py-2.5 text-sm font-medium text-primary-foreground disabled:opacity-60">{busy ? "…" : mode === "in" ? "Se connecter" : "Créer le compte"}</button>
            </form>
            <button onClick={() => setMode(mode === "in" ? "up" : "in")} className="mt-4 w-full text-center text-sm text-muted-foreground hover:text-foreground">
              {mode === "in" ? "Pas de compte ? Inscrivez-vous" : "Déjà inscrit ? Connectez-vous"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
