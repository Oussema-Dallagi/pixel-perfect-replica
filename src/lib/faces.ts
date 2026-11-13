// Browser-only face recognition helpers. Import dynamically from effects/handlers.
export type Person = { id: string; name: string; descriptors: number[][]; photo: string };
const KEY = "smartmeet.people";
const MODELS = "https://cdn.jsdelivr.net/npm/@vladmandic/face-api@1.7.15/model/";

let api: typeof import("@vladmandic/face-api") | null = null;
export async function loadFaceApi() {
  if (api) return api;
  const f = await import("@vladmandic/face-api");
  await Promise.all([
    f.nets.tinyFaceDetector.loadFromUri(MODELS),
    f.nets.faceLandmark68Net.loadFromUri(MODELS),
    f.nets.faceRecognitionNet.loadFromUri(MODELS),
  ]);
  api = f;
  return f;
}

export function loadPeople(): Person[] {
  try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch { return []; }
}
export function savePeople(p: Person[]) { localStorage.setItem(KEY, JSON.stringify(p)); }

export async function describe(input: HTMLVideoElement | HTMLImageElement | HTMLCanvasElement) {
  const f = await loadFaceApi();
  const r = await f.detectSingleFace(input, new f.TinyFaceDetectorOptions({ inputSize: 416 })).withFaceLandmarks().withFaceDescriptor();
  return r ? Array.from(r.descriptor) : null;
}

/** Mouth opening ratio from 68-point landmarks (inner lips / face height). */
export function mouthOpen(p: { x: number; y: number }[]) {
  const pts = p as Required<typeof p>; const y = (i: number) => pts[i]?.y ?? 0;
  const gap = (Math.abs(y(66) - y(62)) + Math.abs(y(67) - y(61)) + Math.abs(y(65) - y(63))) / 3;
  const h = Math.abs(y(8) - y(27)) || 1;
  return gap / h;
}

export function snapshot(src: HTMLVideoElement | HTMLImageElement, size = 160) {
  const c = document.createElement("canvas"); c.width = size; c.height = size;
  const w = src instanceof HTMLVideoElement ? src.videoWidth : src.naturalWidth;
  const h = src instanceof HTMLVideoElement ? src.videoHeight : src.naturalHeight;
  const s = Math.min(w, h);
  c.getContext("2d")!.drawImage(src, (w - s) / 2, (h - s) / 2, s, s, 0, 0, size, size);
  return c.toDataURL("image/jpeg", 0.8);
}
