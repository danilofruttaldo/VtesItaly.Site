/** Converts "Filippo Mengoli" → "Filippo M." — keeps single names as-is. */
export function anonymizeName(fullName: string): string {
  const parts = fullName.trim().split(/\s+/);
  if (parts.length <= 1) return fullName;
  const first = parts[0];
  const last = parts[parts.length - 1];
  if (!last) return fullName;
  const lastInitial = last[0].toUpperCase() + '.';
  return `${first} ${lastInitial}`;
}
