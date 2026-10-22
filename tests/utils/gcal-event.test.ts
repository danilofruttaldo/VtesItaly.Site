import { describe, it, expect } from 'vitest';
import {
  GCAL_SUBSCRIBE_GOOGLE,
  GCAL_SUBSCRIBE_ICAL,
  googleTemplateUrl,
  rangeStart,
  type GcalSource,
} from '../../src/utils/gcal-event';

const OPTS = { siteUrl: 'https://vtesitaly.com', startsPrefix: 'Inizia' };

function params(url: string): URLSearchParams {
  expect(url.startsWith('https://calendar.google.com/calendar/render?')).toBe(true);
  return new URL(url).searchParams;
}

const start: GcalSource = { date: '2026-11-01', endDate: '2026-11-09', time: '', title: 'Inizia: Week', url: '/w/' };
const end: GcalSource = { date: '2026-11-09', endDate: '2026-11-09', time: '', title: 'Fine: Week', url: '/w/' };

describe('rangeStart', () => {
  it('maps the end cell of a multi-day event to its start cell', () => {
    expect(rangeStart(end, [start, end])).toBe(start);
  });

  it('returns the event itself otherwise', () => {
    expect(rangeStart(start, [start, end])).toBe(start);
    const single: GcalSource = { date: '2026-11-01', title: 'X' };
    expect(rangeStart(single, [single])).toBe(single);
    // An end cell whose start is not in the list.
    expect(rangeStart(end, [end])).toBe(end);
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
    expect(GCAL_SUBSCRIBE_ICAL).toBe(
      'webcal://calendar.google.com/calendar/ical/vtesitaly%40gmail.com/public/basic.ics',
    );
  });
});
