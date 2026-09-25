import type { Metadata } from 'next';
import { CharacterExplorer } from '@/components/characters/CharacterExplorer';
import { getCharacterDetail, getFilmsCatalog } from '@/lib/graphql/server-fetch';
import { catalogFilms, getCharacterFilms } from '@/lib/characters';
import { characterPath } from '@/hooks/characterPath';
import { isKnown } from '@/lib/utils';

interface CharacterPageProps {
  params: Promise<{ id: string }>;
}

function decodeId(raw: string) {
  try {
    return decodeURIComponent(raw);
  } catch {
    return raw;
  }
}

export async function generateMetadata({ params }: CharacterPageProps): Promise<Metadata> {
  const id = decodeId((await params).id);
  const [result, catalog] = await Promise.all([getCharacterDetail(id), getFilmsCatalog()]);
  const person = result?.person;

  if (!person?.name) {
    return { title: 'Personaje no encontrado', robots: { index: false } };
  }

  const films = getCharacterFilms(id, person, catalogFilms(catalog))
    .map((film) => film.title)
    .filter(Boolean);
  const description = [
    `${person.name}, personaje de Star Wars.`,
    isKnown(person.homeworld?.name) ? `Planeta natal: ${person.homeworld?.name}.` : '',
    films.length
      ? `Aparece en ${films.length} película${films.length === 1 ? '' : 's'}: ${films.join(', ')}.`
      : '',
  ]
    .filter(Boolean)
    .join(' ');

  return {
    title: person.name,
    description,
    alternates: { canonical: characterPath(id) },
    openGraph: { title: `${person.name} · Star Wars Fans`, description, type: 'profile' },
    twitter: { card: 'summary', title: person.name, description },
  };
}

export default async function CharacterPage({ params }: CharacterPageProps) {
  const id = decodeId((await params).id);
  const [data, films] = await Promise.all([getCharacterDetail(id), getFilmsCatalog()]);

  return <CharacterExplorer initialCharacter={data ? { id, data } : null} initialFilms={films} />;
}
