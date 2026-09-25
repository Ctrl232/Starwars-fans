export function compact<T>(items: ReadonlyArray<T | null | undefined> | null | undefined): T[] {
  return (items ?? []).filter((item): item is T => item != null);
}

export function isKnown(value: string | number | null | undefined): boolean {
  if (value === null || value === undefined || value === '') return false;
  return !['unknown', 'n/a', 'none'].includes(String(value).toLowerCase());
}

export function displayValue(value: string | number | null | undefined, suffix = ''): string {
  if (value === null || value === undefined || value === '') return 'Desconocido';
  const text = String(value);
  if (['unknown', 'n/a', 'none'].includes(text.toLowerCase())) return 'Desconocido';
  return `${text}${suffix}`;
}

const GENDER_LABELS: Record<string, string> = {
  male: 'Masculino',
  female: 'Femenino',
  hermaphrodite: 'Hermafrodita',
  'n/a': 'No aplica',
  none: 'No aplica',
  unknown: 'Desconocido',
};

export function genderLabel(gender: string | null | undefined): string {
  if (!gender) return 'Desconocido';
  return GENDER_LABELS[gender.toLowerCase()] ?? gender;
}

export function initials(name: string | null | undefined): string {
  if (!name) return '?';
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}

const ROMAN = ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX'];

export function episodeLabel(episode: number | null | undefined): string | null {
  if (!episode) return null;
  return `Episodio ${ROMAN[episode] ?? episode}`;
}

export function releaseYear(date: string | null | undefined): string | null {
  if (!date) return null;
  const year = new Date(date).getUTCFullYear();
  return Number.isNaN(year) ? null : String(year);
}
