import { describe, it, expect } from 'vitest';
import type { CalendarEvent } from '../../src/utils/calendar';
import { GCAL_SOURCE, gcalId, parseTime, planSync, toGcalEvents, type GcalEvent } from '../../src/utils/gcal';

const OPTS = { siteUrl: 'https://vtesitaly.com', startsPrefix: 'Inizia' };

function mkEvent(over: Partial<CalendarEvent> = {}): CalendarEvent {
  return {
    id: 'comunita/post/2026-11-01',
    date: '2026-11-01',
    time: '10:30',
    title: 'Shadow Shift',
    postTitle: 'Shadow Shift',
    category: 'comunita',
    url: '/comunita/post/',
    ...over,
  };
}

describe('gcalId', () => {
  it('is stable and uses only base32hex characters', () => {
    expect(gcalId('a/b/2026-01-01')).toBe(gcalId('a/b/2026-01-01'));
    expect(gcalId('a/b/2026-01-01')).not.toBe(gcalId('a/b/2026-01-02'));
    expect(gcalId('x')).toMatch(/^[0-9a-v]{32}$/);
  });
});

describe('parseTime', () => {
  it('reads a start time, padding the hour', () => {
    expect(parseTime('09:30')).toEqual({ start: '09:30', end: undefined });
    expect(parseTime('9:00')).toEqual({ start: '09:00', end: undefined });
  });

  it('reads a range', () => {
    expect(parseTime('9:00 – 19:00')).toEqual({ start: '09:00', end: '19:00' });
    expect(parseTime('14:00-18:30')).toEqual({ start: '14:00', end: '18:30' });
  });

  it('returns null for empty, TBD and free text', () => {
    expect(parseTime('')).toBeNull();
    expect(parseTime('TBD')).toBeNull();
    expect(parseTime('pomeriggio')).toBeNull();
  });
});

describe('toGcalEvents', () => {
  it('maps a timed event with the default duration and Rome wall-clock time', () => {
    const [e] = toGcalEvents([mkEvent()], OPTS);
    expect(e.start).toEqual({ dateTime: '2026-11-01T10:30:00', timeZone: 'Europe/Rome' });
    expect(e.end).toEqual({ dateTime: '2026-11-01T16:30:00', timeZone: 'Europe/Rome' });
    expect(e.summary).toBe('Shadow Shift');
    expect(e.source).toEqual({ title: 'VTES Italy', url: 'https://vtesitaly.com/comunita/post/' });
    expect(e.extendedProperties.private.source).toBe(GCAL_SOURCE);
  });

  it('rolls the default end over midnight', () => {
    const [e] = toGcalEvents([mkEvent({ time: '21:00' })], OPTS);
    expect(e.end).toEqual({ dateTime: '2026-11-02T03:00:00', timeZone: 'Europe/Rome' });
  });

  it('uses the end of a time range', () => {
    const [e] = toGcalEvents([mkEvent({ time: '9:00 – 19:00' })], OPTS);
    expect(e.end).toEqual({ dateTime: '2026-11-01T19:00:00', timeZone: 'Europe/Rome' });
  });

  it('makes days without a start time all-day, with the exclusive end date', () => {
    const [tbd] = toGcalEvents([mkEvent({ time: 'TBD' })], OPTS);
    expect(tbd.start).toEqual({ date: '2026-11-01' });
    expect(tbd.end).toEqual({ date: '2026-11-02' });
  });

  it('merges the start and end cells of a multi-day event into one all-day event', () => {
    const out = toGcalEvents(
      [
        mkEvent({ title: 'Inizia: Week of Sabbat', time: '', endDate: '2026-11-09' }),
        mkEvent({ id: 'comunita/post/2026-11-09', date: '2026-11-09', endDate: '2026-11-09', title: 'Fine: Week' }),
      ],
      OPTS,
    );
    expect(out).toHaveLength(1);
    expect(out[0].summary).toBe('Week of Sabbat');
    expect(out[0].start).toEqual({ date: '2026-11-01' });
    expect(out[0].end).toEqual({ date: '2026-11-10' });
  });

  it('gives distinct ids to events sharing a site id', () => {
    const out = toGcalEvents([mkEvent({ title: 'Asinelli' }), mkEvent({ title: 'Garisenda' })], OPTS);
    expect(out[0].id).toBe(gcalId('comunita/post/2026-11-01'));
    expect(out[1].id).toBe(gcalId('comunita/post/2026-11-01#2'));
  });

  it('writes format, platform link and page link in the description', () => {
    const [e] = toGcalEvents(
      [mkEvent({ format: 'Standard', archonUrl: 'https://archon.vekn.net/t/1', platform: 'Archon' })],
      OPTS,
    );
    expect(e.description).toBe('Standard\nArchon: https://archon.vekn.net/t/1\nhttps://vtesitaly.com/comunita/post/');
  });

  it('prefers the description over the format, and leaves out links that are missing', () => {
    const [e] = toGcalEvents([mkEvent({ url: '', format: 'Standard', description: 'Evento sealed' })], OPTS);
    expect(e.description).toBe('Evento sealed');
    expect(e.source).toBeUndefined();
    const [bare] = toGcalEvents([mkEvent({ url: '' })], OPTS);
    expect(bare.description).toBeUndefined();
  });

  it('labels the link Archon when the platform is missing', () => {
    const [e] = toGcalEvents([mkEvent({ url: '', archonUrl: 'https://archon.vekn.net/t/1' })], OPTS);
    expect(e.description).toBe('Archon: https://archon.vekn.net/t/1');
  });

  it('joins venue and address unless the address already names the venue', () => {
    const loc = (venue?: string, location?: string) => toGcalEvents([mkEvent({ venue, location })], OPTS)[0].location;
    expect(loc('Game', 'Via Baracca 168/R, Firenze')).toBe('Game, Via Baracca 168/R, Firenze');
    expect(loc('Italia', 'Italia')).toBe('Italia');
    expect(loc('Firenze', undefined)).toBe('Firenze');
    expect(loc(undefined, 'Via Roma 1')).toBe('Via Roma 1');
    expect(loc(undefined, undefined)).toBeUndefined();
  });

  it('changes the hash only when the content changes', () => {
    const h = (ev: CalendarEvent) => toGcalEvents([ev], OPTS)[0].extendedProperties.private.hash;
    expect(h(mkEvent())).toBe(h(mkEvent()));
    expect(h(mkEvent())).not.toBe(h(mkEvent({ time: '11:00' })));
  });
});

describe('planSync', () => {
  const ev = (id: string, hash: string): GcalEvent => ({
    id,
    summary: id,
    start: { date: '2026-01-01' },
    end: { date: '2026-01-02' },
    extendedProperties: { private: { source: GCAL_SOURCE, hash } },
  });

  it('inserts new events, updates changed ones, removes those gone from the site', () => {
    const plan = planSync(
      [ev('new', 'h1'), ev('same', 'h2'), ev('changed', 'h3')],
      [
        { id: 'same', extendedProperties: { private: { hash: 'h2' } } },
        { id: 'changed', extendedProperties: { private: { hash: 'old' } } },
        { id: 'gone' },
      ],
    );
    expect(plan.insert.map((e) => e.id)).toEqual(['new']);
    expect(plan.update.map((e) => e.id)).toEqual(['changed']);
    expect(plan.remove).toEqual(['gone']);
  });

  it('updates an event without a stored hash', () => {
    expect(planSync([ev('a', 'h')], [{ id: 'a' }]).update).toHaveLength(1);
  });
});
