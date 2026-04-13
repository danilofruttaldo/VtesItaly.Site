const particles = new Set(['di', 'de', 'del', 'della', 'delle', 'dei', 'degli', 'da', 'lo', 'la', 'le', 'li']);

/** Converts "Filippo Mengoli" → "Filippo M." — keeps single names as-is.
 *  Handles Italian surname particles: "Diego Di Nicolantonio" → "Diego D." */
export function anonymizeName(fullName: string): string {
  const parts = fullName.trim().split(/\s+/);
  if (parts.length <= 1) return fullName;
  const first = parts[0];
  if (parts.length >= 3 && particles.has(parts[parts.length - 2].toLowerCase())) {
    return `${first} ${parts[parts.length - 2][0].toUpperCase()}.`;
  }
  const last = parts[parts.length - 1];
  if (!last) return fullName;
  return `${first} ${last[0].toUpperCase()}.`;
}
