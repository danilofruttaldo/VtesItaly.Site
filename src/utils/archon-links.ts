/* Archon links: pure helpers behind scripts/check-archon-links.mjs.
 *
 * archon.vekn.net is a single-page app: /tournaments/<uid> answers 200 for any
 * uid, so a link checker cannot tell a dead event from a live one. The public
 * snapshot (NDJSON, one `{"type": …, "data": {"uid": …}}` per line) lists every
 * tournament and league that exists: a uid missing from it is a dead link.
 *
 * No Astro imports: the script runs this file directly under Node.
 */

export type ArchonKind = 'tournament' | 'league';

export interface ArchonRef {
  kind: ArchonKind;
  uid: string;
}

export interface ArchonSnapshot {
  tournament: Set<string>;
  league: Set<string>;
}

const LINK_RE =
  /https:\/\/archon\.vekn\.net\/(tournaments|leagues)\/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/gi;

/** Every Archon tournament/league uid linked in `text`, in order of appearance. */
export function extractArchonRefs(text: string): ArchonRef[] {
  return [...text.matchAll(LINK_RE)].map((m) => ({
    kind: m[1].toLowerCase() === 'leagues' ? 'league' : 'tournament',
    uid: m[2].toLowerCase(),
  }));
}

/**
 * Collects the tournament and league uids of a snapshot. Throws when the
 * closing `eof` record is missing or its count disagrees with the records
 * read: a truncated download would otherwise report live links as dead.
 */
export function parseArchonSnapshot(ndjson: string): ArchonSnapshot {
  const snapshot: ArchonSnapshot = { tournament: new Set(), league: new Set() };
  let records = 0;
  let eofCount: number | undefined;
  for (const line of ndjson.split('\n')) {
    if (!line.trim()) continue;
    const row = JSON.parse(line) as { type?: string; count?: number; data?: { uid?: unknown } };
    if (row.type === 'header') continue;
    if (row.type === 'eof') {
      eofCount = row.count;
      break;
    }
    records++;
    if ((row.type === 'tournament' || row.type === 'league') && typeof row.data?.uid === 'string') {
      snapshot[row.type].add(row.data.uid.toLowerCase());
    }
  }
  if (eofCount === undefined) throw new Error('Archon snapshot is truncated: no eof record');
  if (eofCount !== records) throw new Error(`Archon snapshot has ${records} records, eof says ${eofCount}`);
  return snapshot;
}

/** The refs whose uid is not in the snapshot, de-duplicated, with the files that link them. */
export function findDeadArchonRefs(
  refsByFile: Map<string, ArchonRef[]>,
  snapshot: ArchonSnapshot,
): (ArchonRef & { files: string[] })[] {
  const dead = new Map<string, ArchonRef & { files: string[] }>();
  for (const [file, refs] of refsByFile) {
    for (const ref of refs) {
      if (snapshot[ref.kind].has(ref.uid)) continue;
      const key = `${ref.kind}/${ref.uid}`;
      const entry = dead.get(key) ?? { ...ref, files: [] };
      if (!entry.files.includes(file)) entry.files.push(file);
      dead.set(key, entry);
    }
  }
  return [...dead.values()];
}
