import { describe, it, expect } from 'vitest';
import {
  EVENT_COLORS,
  GCAL_SUBSCRIBE_GOOGLE,
  GCAL_ICAL_URL,
  GCAL_SUBSCRIBE_APPLE,
  eventColorKey,
  googleTemplateUrl,
  rangeStart,
  type GcalSource,
} from '../../src/utils/gcal-event';

const PREFIXES = { startsPrefix: 'Inizia', endsPrefix: 'Fine' };
const OPTS = { siteUrl: 'https://vtesitaly.com', ...PREFIXES };

function params(url: string): URLSearchParams {
  expect(url.startsWith('https://calendar.google.com/calendar/render?')).toBe(true);
  return new URL(url).searchParams;
}

const start: GcalSource = { date: '2026-11-01', endDate: '2026-11-09', time: '', title: 'Inizia: Week', url: '/w/' };
const end: GcalSource = { date: '2026-11-09', endDate: '2026-11-09', time: '', title: 'Fine: Week', url: '/w/' };

describe('rangeStart', () => {
  it('maps the end cell of a multi-day event to its start cell', () => {
    expect(rangeStart(end, [start, end], PREFIXES)).toBe(start);
  });

  it('pairs the end cell with the start of the same event when a post has two', () => {
    const main: GcalSource = { ...start, date: '2026-11-07', title: 'Inizia: Main' };
    const side: GcalSource = { ...start, date: '2026-11-08', title: 'Inizia: Side' };
    const sideEnd: GcalSource = { ...end, title: 'Fine: Side' };
    expect(rangeStart(sideEnd, [main, side, sideEnd], PREFIXES)).toBe(side);
  });

  it('returns the event itself otherwise', () => {
    expect(rangeStart(start, [start, end], PREFIXES)).toBe(start);
    const single: GcalSource = { date: '2026-11-01', title: 'X' };
    expect(rangeStart(single, [single], PREFIXES)).toBe(single);
    // An end cell whose start is not in the list.
    expect(rangeStart(end, [end], PREFIXES)).toBe(end);
  });
});

describe('googleTemplateUrl', () => {
  it('keeps the start time, with the default duration and the Rome timezone', () => {
    const ev: GcalSource = {
      date: '2026-11-01',
      time: '10:30',
      title: 'Shadow Shift',
      url: '/comunita/shadow-shift/',
      venue: 'Game',
      location: 'Via Baracca 168/R, Firenze',
      format: 'Standard',
      archonUrl: 'https://archon.vekn.net/t/1',
      platform: 'Archon',
    };
    const p = params(googleTemplateUrl(ev, [ev], OPTS));
    expect(p.get('action')).toBe('TEMPLATE');
    expect(p.get('text')).toBe('Shadow Shift');
    expect(p.get('dates')).toBe('20261101T103000/20261101T163000');
    expect(p.get('ctz')).toBe('Europe/Rome');
    expect(p.get('location')).toBe('Game, Via Baracca 168/R, Firenze');
    expect(p.get('details')).toBe(
      'Standard\nArchon: https://archon.vekn.net/t/1\nhttps://vtesitaly.com/comunita/shadow-shift/',
    );
  });

  it('adds an event without a start time as all-day', () => {
    const ev: GcalSource = { date: '2026-11-01', time: 'TBD', title: 'X' };
    const p = params(googleTemplateUrl(ev, [ev], OPTS));
    expect(p.get('dates')).toBe('20261101/20261102');
    expect(p.has('details')).toBe(false);
    expect(p.has('location')).toBe(false);
  });

  it('adds the whole multi-day event, without the prefix, from either cell', () => {
    for (const cell of [start, end]) {
      const p = params(googleTemplateUrl(cell, [start, end], OPTS));
      expect(p.get('text')).toBe('Week');
      expect(p.get('dates')).toBe('20261101/20261110');
    }
  });
});

describe('subscribe links', () => {
  it('point to the public vtesitaly calendar', () => {
    expect(GCAL_SUBSCRIBE_GOOGLE).toBe('https://calendar.google.com/calendar/u/0?cid=dnRlc2l0YWx5QGdtYWlsLmNvbQ');
    expect(GCAL_ICAL_URL).toBe('https://calendar.google.com/calendar/ical/vtesitaly%40gmail.com/public/basic.ics');
    expect(GCAL_SUBSCRIBE_APPLE).toBe(
      'webcal://calendar.google.com/calendar/ical/vtesitaly%40gmail.com/public/basic.ics',
    );
  });
});

describe('eventColorKey', () => {
  it('picks the colour of each kind of event', () => {
    expect(eventColorKey({ category: 'grand-prix' })).toBe('grand-prix');
    expect(eventColorKey({ category: 'tour' })).toBe('tour');
    expect(eventColorKey({ category: 'nazionale' })).toBe('nazionale');
    expect(eventColorKey({ category: 'comunita', tags: ['firenze', 'torneo'] })).toBe('tournament');
    expect(eventColorKey({ category: 'comunita', tags: ['prerelease'] })).toBe('other');
    expect(eventColorKey({ category: 'altro' })).toBe('other');
    expect(EVENT_COLORS.tournament).toEqual({ hex: '#4A90D9', colorId: '7' });
  });
});
