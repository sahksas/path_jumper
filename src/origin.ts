export function extractOrigin(url: string | undefined | null): string | null {
  if (!url) return null;
  let origin: string;
  try {
    origin = new URL(url).origin;
  } catch {
    return null;
  }
  if (!origin || origin === "null") return null;
  return origin;
}
