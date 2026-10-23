import { describe, it, expect } from 'vitest';
import { sendsGpc, sendsPrivacySignal } from '../../src/utils/privacy-signal';

const nav = (extra: object) => extra as Navigator;

describe('privacy signals', () => {
  it('reads GPC only when it is exactly true', () => {
    expect(sendsGpc(nav({ globalPrivacyControl: true }))).toBe(true);
    expect(sendsGpc(nav({ globalPrivacyControl: false }))).toBe(false);
    expect(sendsGpc(nav({}))).toBe(false);
  });

  it('treats Do Not Track "1" or GPC as a signal', () => {
    expect(sendsPrivacySignal(nav({ doNotTrack: '1' }))).toBe(true);
    expect(sendsPrivacySignal(nav({ doNotTrack: '0' }))).toBe(false);
    expect(sendsPrivacySignal(nav({ doNotTrack: null, globalPrivacyControl: true }))).toBe(true);
  });
});
