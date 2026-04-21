import { describe, it, expect } from 'vitest';
import { composeFormat } from '../../src/utils/calendar';

describe('composeFormat', () => {
  it('returns TBD when format is missing', () => {
    expect(composeFormat(undefined, false, 3, 'it')).toBe('TBD');
    expect(composeFormat('', false, 3, 'it')).toBe('TBD');
  });

  it('returns the literal "TBD" without decorations when format === "TBD"', () => {
    expect(composeFormat('TBD', true, 4, 'it')).toBe('TBD');
  });

  it('marks unknown formats as Speciale (IT) / Special (EN)', () => {
    expect(composeFormat('SuperWeird', false, 3, 'it')).toBe('Speciale');
    expect(composeFormat('SuperWeird', false, 3, 'en')).toBe('Special');
  });

  it('appends the proxies clause in IT', () => {
    expect(composeFormat('Standard', true, undefined, 'it')).toBe('Standard, Proxy Ammesse');
    expect(composeFormat('Standard', false, undefined, 'it')).toBe('Standard, No Proxy');
  });

  it('appends the proxies clause in EN', () => {
    expect(composeFormat('V5', true, undefined, 'en')).toBe('V5, Proxies Allowed');
    expect(composeFormat('V5', false, undefined, 'en')).toBe('V5, No Proxies');
  });

  it('omits the proxies clause when undefined', () => {
    expect(composeFormat('Standard', undefined, undefined, 'it')).toBe('Standard');
  });

  it('appends rounds + final in IT (singular)', () => {
    expect(composeFormat('Standard', undefined, 1, 'it')).toBe('Standard — 1 Round + Finale');
  });

  it('appends rounds + final in IT (3 rounds, IT keeps "Round" invariant)', () => {
    expect(composeFormat('Standard', undefined, 3, 'it')).toBe('Standard — 3 Round + Finale');
  });

  it('pluralises rounds in EN', () => {
    expect(composeFormat('V5', undefined, 1, 'en')).toBe('V5 — 1 Round + Final');
    expect(composeFormat('V5', undefined, 3, 'en')).toBe('V5 — 3 Rounds + Final');
  });

  it('combines proxies + rounds correctly', () => {
    expect(composeFormat('Standard', true, 4, 'it')).toBe('Standard, Proxy Ammesse — 4 Round + Finale');
    expect(composeFormat('V5', false, 4, 'en')).toBe('V5, No Proxies — 4 Rounds + Final');
  });
});
