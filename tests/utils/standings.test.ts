import { describe, it, expect } from 'vitest';
import type { Standing } from '../../src/utils/standings';
import { getCardMeta } from '../../src/utils/standings';

const fakeStandings: Standing[] = [
  { rank: 1, name: 'Federico Pin', gw: 3, vp: 9, fvp: 1.5, tp: 180 },
  { rank: 2, name: 'Anna Rossi', gw: 2, vp: 6, fvp: null, tp: 120 },
  { rank: 3, name: 'Mario Bianchi', gw: 2, vp: 5, fvp: null, tp: 110 },
];

const allStandings = {
  '/src/data/standings/gp/standings-gp-2025.json': { default: fakeStandings },
};

describe('getCardMeta', () => {
  it('returns the anonymised winner + player count when standings are available', () => {
    const meta = getCardMeta(
      {
        data: {
          events: [{ date: new Date('2025-06-15') }],
          standingsUrl: '/data/standings/gp/standings-gp-2025.json',
        },
      },
      allStandings,
      'it',
    );
    expect(meta.players).toBe(3);
    expect(meta.winner).toBe('Federico P.');
    expect(meta.eventDate).toMatch(/2025/);
  });

  it('returns empty winner + zero players when standingsUrl is missing', () => {
    const meta = getCardMeta({ data: { events: [{ date: new Date('2025-06-15') }] } }, allStandings, 'it');
    expect(meta.winner).toBe('');
    expect(meta.players).toBe(0);
  });

  it('returns empty winner when standingsUrl points to a missing file', () => {
    const meta = getCardMeta(
      {
        data: {
          events: [{ date: new Date('2025-06-15') }],
          standingsUrl: '/data/standings/gp/does-not-exist.json',
        },
      },
      allStandings,
      'it',
    );
    expect(meta.winner).toBe('');
    expect(meta.players).toBe(0);
  });

  it('falls back to empty eventDate string when no events array exists', () => {
    const meta = getCardMeta({ data: {} }, allStandings, 'it');
    expect(meta.eventDate).toBe('');
  });

  it('formats the event date in EN locale when requested', () => {
    const meta = getCardMeta(
      {
        data: {
          events: [{ date: new Date(Date.UTC(2025, 5, 15)) }],
          standingsUrl: '/data/standings/gp/standings-gp-2025.json',
        },
      },
      allStandings,
      'en',
    );
    // EN locale → month name "June"
    expect(meta.eventDate.toLowerCase()).toContain('june');
  });
});
