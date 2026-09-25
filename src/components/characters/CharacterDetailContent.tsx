import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import MovieIcon from '@mui/icons-material/MovieOutlined';
import PublicIcon from '@mui/icons-material/PublicOutlined';
import type { CatalogFilm, CharacterDetail } from '@/lib/characters';
import { uniquePlanetCount } from '@/lib/characters';
import { compact, displayValue, episodeLabel, genderLabel, isKnown, releaseYear } from '@/lib/utils';
import { EmptyState } from '@/components/feedback/EmptyState';

export type { CharacterDetail };

interface CharacterDetailContentProps {
  character: CharacterDetail;
  films: ReadonlyArray<CatalogFilm>;
}

export function CharacterDetailContent({ character, films }: CharacterDetailContentProps) {
  const facts: Array<{ label: string; value: string; known: boolean }> = [
    { label: 'Año de nacimiento', value: displayValue(character.birthYear), known: isKnown(character.birthYear) },
    { label: 'Género', value: genderLabel(character.gender), known: isKnown(character.gender) },
    { label: 'Altura', value: displayValue(character.height, ' cm'), known: isKnown(character.height) },
    { label: 'Peso', value: displayValue(character.mass, ' kg'), known: isKnown(character.mass) },
    { label: 'Color de ojos', value: displayValue(character.eyeColor), known: isKnown(character.eyeColor) },
    { label: 'Color de cabello', value: displayValue(character.hairColor), known: isKnown(character.hairColor) },
    { label: 'Color de piel', value: displayValue(character.skinColor), known: isKnown(character.skinColor) },
    { label: 'Planeta natal', value: displayValue(character.homeworld?.name), known: isKnown(character.homeworld?.name) },
    { label: 'Especie', value: displayValue(character.species?.name), known: isKnown(character.species?.name) },
  ];
  const knownFacts = facts.filter((fact) => fact.known);
  const planetCount = uniquePlanetCount(films);

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: 'wrap' }}>
        <Chip icon={<MovieIcon aria-hidden />} label={`${films.length} película${films.length === 1 ? '' : 's'}`} color="primary" variant="outlined" />
        <Chip icon={<PublicIcon aria-hidden />} label={`${planetCount} planeta${planetCount === 1 ? '' : 's'} visitado${planetCount === 1 ? '' : 's'}`} color="secondary" variant="outlined" />
      </Stack>

      {knownFacts.length > 0 ? (
        <Box
          component="dl"
          sx={{
            m: 0,
            display: 'grid',
            gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)' },
            gap: 2,
          }}
        >
          {knownFacts.map((fact) => (
            <Box key={fact.label}>
              <Typography component="dt" variant="caption" color="text.secondary">
                {fact.label}
              </Typography>
              <Typography component="dd" sx={{ m: 0, fontWeight: 600 }}>
                {fact.value}
              </Typography>
            </Box>
          ))}
        </Box>
      ) : (
        <Alert severity="info" variant="outlined">
          El API no tiene datos biográficos de este personaje en este momento (año de nacimiento, género, planeta
          natal…). Sus películas y planetas sí están disponibles.
        </Alert>
      )}

      <Divider />

      <Box component="section" aria-labelledby="films-heading">
        <Typography id="films-heading" variant="h6" component="h3" gutterBottom>
          Películas ({films.length})
        </Typography>

        {films.length === 0 ? (
          <EmptyState title="Sin películas registradas" description="Este personaje no aparece en ninguna película del API." />
        ) : (
          <Stack component="ul" spacing={2} sx={{ listStyle: 'none', p: 0, m: 0 }}>
            {films.map((film) => {
              const planets = compact(film.planetConnection?.planets);
              const meta = [episodeLabel(film.episodeID), releaseYear(film.releaseDate)]
                .filter(Boolean)
                .join(' · ');

              return (
                <Paper component="li" key={film.id} variant="outlined" sx={{ p: 2 }}>
                  <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mb: 0.5 }}>
                    <MovieIcon aria-hidden fontSize="small" color="primary" />
                    <Typography variant="subtitle1" component="h4" sx={{ fontWeight: 700 }}>
                      {film.title ?? 'Película sin título'}
                    </Typography>
                  </Stack>
                  {meta && (
                    <Typography variant="caption" color="text.secondary">
                      {meta}
                    </Typography>
                  )}
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    <Box component="span" sx={{ color: 'text.secondary' }}>
                      Director:{' '}
                    </Box>
                    <strong>{displayValue(film.director)}</strong>
                  </Typography>

                  <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mt: 1.5, mb: 1 }}>
                    <PublicIcon aria-hidden fontSize="small" color="secondary" />
                    <Typography variant="body2" color="text.secondary">
                      Planetas ({planets.length})
                    </Typography>
                  </Stack>
                  {planets.length > 0 ? (
                    <Stack
                      direction="row"
                      spacing={1}
                      useFlexGap
                      sx={{ flexWrap: 'wrap' }}
                      aria-label={`Planetas de ${film.title ?? 'la película'}`}
                    >
                      {planets.map((planet) => (
                        <Chip key={planet.id} label={planet.name ?? 'Desconocido'} size="small" color="secondary" variant="outlined" />
                      ))}
                    </Stack>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      Sin planetas registrados.
                    </Typography>
                  )}
                </Paper>
              );
            })}
          </Stack>
        )}
      </Box>
    </Stack>
  );
}
