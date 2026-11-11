import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type Device = Tables<"devices">;
export type Meeting = Tables<"meetings">;
export type Task = Tables<"tasks">;
export type Decision = Tables<"decisions">;
export type Line = Tables<"transcript_lines">;
export type Reading = Tables<"sensor_readings">;

export async function uid() {
  const { data } = await supabase.auth.getUser();
  if (!data.user) throw new Error("Non connecté");
  return data.user.id;
}
function must<T>(r: { data: T | null; error: { message: string } | null }): T {
  if (r.error) throw new Error(r.error.message);
  return r.data as T;
}

export const useDevices = () => useQuery({ queryKey: ["devices"], queryFn: async () => must(await supabase.from("devices").select("*").order("created_at")) });
export const useDevice = (id: string) => useQuery({ queryKey: ["devices", id], queryFn: async () => must(await supabase.from("devices").select("*").eq("id", id).maybeSingle()) });
export const useReadings = (deviceId?: string, limit = 200) => useQuery({
  queryKey: ["readings", deviceId ?? "all", limit],
  queryFn: async () => {
    let q = supabase.from("sensor_readings").select("*").order("created_at", { ascending: false }).limit(limit);
    if (deviceId) q = q.eq("device_id", deviceId);
    return must(await q).reverse();
  },
});
export const useCommands = (deviceId: string) => useQuery({ queryKey: ["commands", deviceId], queryFn: async () => must(await supabase.from("device_commands").select("*").eq("device_id", deviceId).order("created_at", { ascending: false }).limit(20)), refetchInterval: 5000 });
export const useMeetings = () => useQuery({ queryKey: ["meetings"], queryFn: async () => must(await supabase.from("meetings").select("*").order("created_at", { ascending: false })) });
export const useMeeting = (id: string) => useQuery({ queryKey: ["meetings", id], queryFn: async () => must(await supabase.from("meetings").select("*").eq("id", id).maybeSingle()) });
export const useLines = (meetingId: string) => useQuery({ queryKey: ["lines", meetingId], queryFn: async () => must(await supabase.from("transcript_lines").select("*").eq("meeting_id", meetingId).order("offset_seconds").order("created_at")) });
export const useDecisions = (meetingId?: string) => useQuery({
  queryKey: ["decisions", meetingId ?? "all"],
  queryFn: async () => { let q = supabase.from("decisions").select("*").order("created_at", { ascending: false }); if (meetingId) q = q.eq("meeting_id", meetingId); return must(await q); },
});
export const useTasks = (meetingId?: string) => useQuery({
  queryKey: ["tasks", meetingId ?? "all"],
  queryFn: async () => { let q = supabase.from("tasks").select("*").order("created_at", { ascending: false }); if (meetingId) q = q.eq("meeting_id", meetingId); return must(await q); },
});
export const useProfile = () => useQuery({ queryKey: ["profile"], queryFn: async () => must(await supabase.from("profiles").select("*").eq("id", await uid()).maybeSingle()) });

/** Live updates: refetch the given query keys when these tables change. */
export function useRealtime(tables: string[], keys: string[][]) {
  const qc = useQueryClient();
  useEffect(() => {
    const ch = supabase.channel(`rt-${Math.random().toString(36).slice(2)}`);
    tables.forEach((t) => ch.on("postgres_changes", { event: "*", schema: "public", table: t }, () => keys.forEach((k) => qc.invalidateQueries({ queryKey: k }))));
    ch.subscribe();
    return () => { supabase.removeChannel(ch); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tables.join(",")]);
}

export const isOnline = (d: Device) => !!d.last_seen && Date.now() - new Date(d.last_seen).getTime() < 2 * 60 * 1000;
export const deviceStatus = (d: Device) => (!isOnline(d) ? "offline" : d.recording ? "recording" : "online") as "offline" | "recording" | "online";
export const fmtDate = (s?: string | null) => (s ? new Date(s).toLocaleString("fr-FR", { dateStyle: "medium", timeStyle: "short" }) : "—");
export function durationMin(m: Meeting) {
  if (!m.started_at) return 0;
  const end = m.ended_at ? new Date(m.ended_at).getTime() : Date.now();
  return Math.max(0, Math.round((end - new Date(m.started_at).getTime()) / 60000));
}
export const fmtDur = (min: number) => (min >= 60 ? `${Math.floor(min / 60)}h ${String(min % 60).padStart(2, "0")}m` : `${min} min`);
export const ago = (s?: string | null) => {
  if (!s) return "jamais";
  const sec = Math.round((Date.now() - new Date(s).getTime()) / 1000);
  if (sec < 60) return `il y a ${sec} s`; if (sec < 3600) return `il y a ${Math.round(sec / 60)} min`;
  if (sec < 86400) return `il y a ${Math.round(sec / 3600)} h`; return `il y a ${Math.round(sec / 86400)} j`;
};
