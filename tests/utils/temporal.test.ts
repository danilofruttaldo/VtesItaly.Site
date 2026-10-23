import { describe, it, expect } from 'vitest';
import {
  compareIsoDays,
  copyrightYear,
  isExpired,
  isRevealDue,
  parseStageDays,
  statusClass,
} from '../../src/utils/temporal';

describe('temporal: statusClass', () => {
  it('marks past events finished and the rest active', () => {
    expect(statusClass('past')).toBe('post__status--finished');
    expect(statusClass('live')).toBe('post__status--active');
    expect(statusClass('upcoming')).toBe('post__status--active');
  });
});

describe('temporal: parseStageDays', () => {
  it('reads the stage days of the attribute', () => {
    expect(parseStageDays('[{"date":"2026-02-15","cancelled":false}]')).toEqual([
      { date: '2026-02-15', cancelled: false },
    ]);
  });

  it('treats a missing attribute as no stages', () => {
    expect(parseStageDays(null)).toEqual([]);
  });

  it('returns null on malformed JSON or a non-array', () => {
    expect(parseStageDays('[{')).toBeNull();
    expect(parseStageDays('{"date":"2026-02-15"}')).toBeNull();
  });
});

describe('temporal: isRevealDue', () => {
  it('reveals from the given day on', () => {
    expect(isRevealDue('2026-10-18', '2026-10-17')).toBe(false);
    expect(isRevealDue('2026-10-18', '2026-10-18')).toBe(true);
    expect(isRevealDue('2026-10-18', '2026-10-19')).toBe(true);
  });

  it('reveals at once without a day', () => {
    expect(isRevealDue(null, '2026-10-18')).toBe(true);
  });
});

describe('temporal: isExpired', () => {
  it('expires the day after the last event day', () => {
    expect(isExpired('2026-10-18', '2026-10-18')).toBe(false);
    expect(isExpired('2026-10-18', '2026-10-19')).toBe(true);
  });

  it('counts a missing day as already over', () => {
    expect(isExpired(null, '2026-10-18')).toBe(true);
  });
});

describe('temporal: compareIsoDays', () => {
  it('sorts days ascending', () => {
    expect(['2026-12-05', '2026-02-15', '2026-02-15', ''].sort(compareIsoDays)).toEqual([
      '',
      '2026-02-15',
      '2026-02-15',
      '2026-12-05',
    ]);
  });
});

describe('temporal: copyrightYear', () => {
  it('moves the end of the range to the given year', () => {
    expect(copyrightYear('© 2018–2025 VTES Italy', 2026)).toBe('© 2018–2026 VTES Italy');
  });

  it('leaves a notice without a range alone', () => {
    expect(copyrightYear('© VTES Italy', 2026)).toBe('© VTES Italy');
  });
});
