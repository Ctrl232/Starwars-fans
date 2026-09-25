import { describe, expect, it } from 'vitest';
import { compact, displayValue, episodeLabel, genderLabel, initials } from './utils';

describe('utils', () => {
  it('compact elimina null/undefined', () => {
    expect(compact([1, null, 2, undefined])).toEqual([1, 2]);
    expect(compact(null)).toEqual([]);
  });

  it('displayValue normaliza valores desconocidos', () => {
    expect(displayValue('unknown')).toBe('Desconocido');
    expect(displayValue(null)).toBe('Desconocido');
    expect(displayValue(172, ' cm')).toBe('172 cm');
  });

  it('formatea género, iniciales y episodio', () => {
    expect(genderLabel('female')).toBe('Femenino');
    expect(initials('Luke Skywalker')).toBe('LS');
    expect(episodeLabel(4)).toBe('Episodio IV');
  });
});
