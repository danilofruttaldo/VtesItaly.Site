import { describe, it, expect } from 'vitest';
import {
  extractArchonRefs,
  findDeadArchonRefs,
  parseArchonSnapshot,
  type ArchonRef,
} from '../../src/utils/archon-links';

const T1 = '019f1a1a-7483-703d-8c50-f30c5c869f0b';
const T2 = '01a0d733-c3df-761c-9dad-a8c763ebc92a';
const L1 = '3f737054-c577-4839-9d68-acec91064673';

const snapshotText = (rows: object[], eof = rows.length) =>
  [{ type: 'header', version: 2 }, ...rows, { type: 'eof', count: eof }].map((r) => JSON.stringify(r)).join('\n') +
  '\n';

describe('archon-links: extractArchonRefs', () => {
  it('finds tournament and league uids, lower-cased, ignoring other Archon pages', () => {
    const text = `[iscriviti](https://archon.vekn.net/tournaments/${T1.toUpperCase()})
      archonUrl: 'https://archon.vekn.net/leagues/${L1}'
      https://archon.vekn.net/help/organizer-guide https://archon.vekn.net/tournaments/not-a-uid`;
    expect(extractArchonRefs(text)).toEqual([
      { kind: 'tournament', uid: T1 },
      { kind: 'league', uid: L1 },
    ]);
  });

  it('returns nothing for text without Archon links', () => {
    expect(extractArchonRefs('https://vekn.net/event-calendar')).toEqual([]);
  });
});

describe('archon-links: parseArchonSnapshot', () => {
  it('collects tournament and league uids and skips other record types', () => {
    const snap = parseArchonSnapshot(
      snapshotText([
        { type: 'tournament', data: { uid: T1 } },
        { type: 'league', data: { uid: L1.toUpperCase() } },
        { type: 'user', data: { uid: T2 } },
        { type: 'promo', data: {} },
      ]),
    );
    expect([...snap.tournament]).toEqual([T1]);
    expect([...snap.league]).toEqual([L1]);
  });

  it('throws on a snapshot without the eof record', () => {
    const text = [{ type: 'header' }, { type: 'tournament', data: { uid: T1 } }]
      .map((r) => JSON.stringify(r))
      .join('\n');
    expect(() => parseArchonSnapshot(text)).toThrow(/truncated/);
  });

  it('throws when the eof count disagrees with the records read', () => {
    expect(() => parseArchonSnapshot(snapshotText([{ type: 'tournament', data: { uid: T1 } }], 2))).toThrow(
      /1 records, eof says 2/,
    );
  });
});

describe('archon-links: findDeadArchonRefs', () => {
  const snapshot = { tournament: new Set([T1]), league: new Set([L1]) };

  it('returns nothing when every uid is in the snapshot', () => {
    const refs = new Map<string, ArchonRef[]>([['a.md', [{ kind: 'tournament', uid: T1 }]]]);
    expect(findDeadArchonRefs(refs, snapshot)).toEqual([]);
  });

  it('reports missing uids once, with every file that links them', () => {
    const refs = new Map<string, ArchonRef[]>([
      [
        'a.md',
        [
          { kind: 'tournament', uid: T2 },
          { kind: 'tournament', uid: T2 },
        ],
      ],
      ['b.md', [{ kind: 'tournament', uid: T2 }]],
      // A league uid looked up among tournaments would be a false negative.
      ['c.md', [{ kind: 'league', uid: T1 }]],
    ]);
    expect(findDeadArchonRefs(refs, snapshot)).toEqual([
      { kind: 'tournament', uid: T2, files: ['a.md', 'b.md'] },
      { kind: 'league', uid: T1, files: ['c.md'] },
    ]);
  });
});
