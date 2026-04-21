import { describe, it, expect } from 'vitest';
import { anonymizeName } from '../../src/utils/anonymize';

describe('anonymizeName', () => {
  it('returns the input unchanged for single names', () => {
    expect(anonymizeName('Madonna')).toBe('Madonna');
  });

  it('initialises the surname for two-word names', () => {
    expect(anonymizeName('Filippo Mengoli')).toBe('Filippo M.');
    expect(anonymizeName('Anna Rossi')).toBe('Anna R.');
  });

  it('initialises the surname for three-or-more-word names without a particle', () => {
    expect(anonymizeName('Maria Anna Bianchi')).toBe('Maria B.');
  });

  it('uses the particle initial when the second-to-last word is an Italian particle', () => {
    expect(anonymizeName('Diego Di Nicolantonio')).toBe('Diego D.');
    expect(anonymizeName('Marco Della Rocca')).toBe('Marco D.');
    expect(anonymizeName('Luca De Santis')).toBe('Luca D.');
    expect(anonymizeName('Giulio Dei Conti')).toBe('Giulio D.');
  });

  it('is case-insensitive on the particle match', () => {
    expect(anonymizeName('Marco DELLA Rocca')).toBe('Marco D.');
  });

  it('trims leading/trailing whitespace', () => {
    expect(anonymizeName('  Anna Rossi  ')).toBe('Anna R.');
  });

  it('collapses multiple internal spaces', () => {
    expect(anonymizeName('Anna   Rossi')).toBe('Anna R.');
  });
});
