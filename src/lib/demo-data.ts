export type DeviceStatus = "online" | "offline" | "recording";
export const devices = [
  { id: "esp32-a1", name: "SmartMeet Salle A", room: "Salle Innovation", status: "recording" as DeviceStatus, battery: 86, wifi: -52, firmware: "v1.4.2", co2: 720, temp: 24.3, humidity: 48, noise: 58, light: 350, lastSeen: "maintenant" },
  { id: "esp32-b2", name: "SmartMeet Salle B", room: "Salle Direction", status: "online" as DeviceStatus, battery: 64, wifi: -61, firmware: "v1.4.2", co2: 540, temp: 22.1, humidity: 44, noise: 32, light: 410, lastSeen: "il y a 12 s" },
  { id: "esp32-c3", name: "SmartMeet Salle C", room: "Open Space", status: "offline" as DeviceStatus, battery: 12, wifi: -88, firmware: "v1.3.9", co2: 0, temp: 0, humidity: 0, noise: 0, light: 0, lastSeen: "il y a 3 h" },
];

export const people = ["Oussama", "Sarah", "Ahmed", "Lina", "Youssef"];

export const meetings = [
  { id: "m-1042", title: "Sprint Planning – SmartMeet v2", date: "10 nov. 2026", time: "14:00", duration: "1h 12m", room: "Salle Innovation", participants: 5, decisions: 4, tasks: 7, score: 87, status: "live" },
  { id: "m-1041", title: "Revue technique ESP32", date: "09 nov. 2026", time: "10:30", duration: "48m", room: "Salle Direction", participants: 4, decisions: 3, tasks: 5, score: 91, status: "done" },
  { id: "m-1040", title: "Point client – Tunisie Télécom", date: "08 nov. 2026", time: "16:00", duration: "55m", room: "Salle Direction", participants: 3, decisions: 2, tasks: 3, score: 78, status: "done" },
  { id: "m-1039", title: "Brainstorming dashboard IA", date: "07 nov. 2026", time: "09:00", duration: "1h 30m", room: "Open Space", participants: 6, decisions: 5, tasks: 9, score: 72, status: "done" },
  { id: "m-1038", title: "Daily stand-up", date: "06 nov. 2026", time: "09:15", duration: "18m", room: "Salle Innovation", participants: 5, decisions: 1, tasks: 2, score: 95, status: "done" },
  { id: "m-1043", title: "Démo jury PFE", date: "12 nov. 2026", time: "11:00", duration: "—", room: "Salle Direction", participants: 7, decisions: 0, tasks: 0, score: 0, status: "scheduled" },
];

export const weekly = [
  { day: "Lun", meetings: 6, hours: 4.5 }, { day: "Mar", meetings: 9, hours: 7.2 }, { day: "Mer", meetings: 7, hours: 5.1 },
  { day: "Jeu", meetings: 11, hours: 8.4 }, { day: "Ven", meetings: 8, hours: 5.9 }, { day: "Sam", meetings: 2, hours: 1.1 }, { day: "Dim", meetings: 0, hours: 0 },
];

export const co2Series = Array.from({ length: 24 }, (_, i) => ({
  t: `${String(8 + Math.floor(i / 2)).padStart(2, "0")}:${i % 2 ? "30" : "00"}`,
  co2: Math.round(420 + i * 18 + Math.sin(i / 2) * 40),
  temp: +(21.5 + i * 0.12 + Math.sin(i / 3) * 0.4).toFixed(1),
}));

export const speakingTime = [
  { name: "Oussama", value: 34 }, { name: "Sarah", value: 26 }, { name: "Ahmed", value: 18 }, { name: "Lina", value: 14 }, { name: "Youssef", value: 8 },
];

export const transcript = [
  { t: "00:00:12", who: "Oussama", text: "Bonjour à tous, on commence le sprint planning de la version 2." },
  { t: "00:01:05", who: "Sarah", text: "Côté firmware, l'ESP32 envoie maintenant les données capteurs toutes les 5 secondes via MQTT." },
  { t: "00:03:40", who: "Ahmed", text: "Il faut qu'on ajoute la détection automatique des intervenants avant la démo." },
  { t: "00:06:22", who: "Oussama", text: "D'accord, on valide : la diarisation passe en priorité haute pour ce sprint.", decision: true },
  { t: "00:09:10", who: "Lina", text: "Je peux prendre le dashboard analytics, livraison prévue jeudi.", task: true },
  { t: "00:12:48", who: "Youssef", text: "Le CO₂ dépasse 1000 ppm dans la salle C, il faudrait une alerte." },
  { t: "00:15:30", who: "Sarah", text: "On décide d'utiliser Whisper pour la transcription en français.", decision: true },
  { t: "00:18:02", who: "Ahmed", text: "Je m'occupe de l'export PDF des comptes rendus d'ici vendredi.", task: true },
];

export const decisions = [
  { id: 1, text: "La diarisation des intervenants passe en priorité haute", by: "Oussama", at: "00:06:22", confidence: 94 },
  { id: 2, text: "Utiliser Whisper pour la transcription française", by: "Sarah", at: "00:15:30", confidence: 91 },
  { id: 3, text: "Ajouter une alerte CO₂ au-delà de 1000 ppm", by: "Youssef", at: "00:12:48", confidence: 82 },
  { id: 4, text: "Démo jury fixée au 12 novembre", by: "Oussama", at: "00:20:11", confidence: 97 },
];

export type TaskStatus = "todo" | "progress" | "review" | "done";
export const tasks = [
  { id: "T-21", title: "Dashboard analytics", owner: "Lina", due: "13 nov.", priority: "Haute", status: "progress" as TaskStatus, meeting: "Sprint Planning" },
  { id: "T-22", title: "Export PDF des comptes rendus", owner: "Ahmed", due: "14 nov.", priority: "Moyenne", status: "todo" as TaskStatus, meeting: "Sprint Planning" },
  { id: "T-23", title: "Diarisation des intervenants", owner: "Sarah", due: "15 nov.", priority: "Haute", status: "todo" as TaskStatus, meeting: "Sprint Planning" },
  { id: "T-18", title: "Alerte CO₂ > 1000 ppm", owner: "Youssef", due: "11 nov.", priority: "Haute", status: "review" as TaskStatus, meeting: "Revue technique ESP32" },
  { id: "T-15", title: "Mise à jour OTA firmware", owner: "Sarah", due: "08 nov.", priority: "Moyenne", status: "done" as TaskStatus, meeting: "Revue technique ESP32" },
  { id: "T-14", title: "Maquettes Figma v2", owner: "Lina", due: "07 nov.", priority: "Basse", status: "done" as TaskStatus, meeting: "Brainstorming dashboard IA" },
  { id: "T-24", title: "Préparer slides démo", owner: "Oussama", due: "12 nov.", priority: "Haute", status: "progress" as TaskStatus, meeting: "Point client" },
];

export const insights = [
  { kind: "warning", text: "Le CO₂ a dépassé 1000 ppm pendant 14 min dans Open Space hier." },
  { kind: "info", text: "Les réunions du jeudi durent 32 % plus longtemps que la moyenne." },
  { kind: "success", text: "Taux de complétion des tâches en hausse de 12 % cette semaine." },
];

export const topics = [
  { name: "Firmware ESP32", pct: 28 }, { name: "Transcription IA", pct: 24 }, { name: "Dashboard", pct: 22 }, { name: "Démo jury", pct: 16 }, { name: "Qualité de l'air", pct: 10 },
];
