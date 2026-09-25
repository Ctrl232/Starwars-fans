import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import type { CharacterSummaryFragment } from '@/gql/graphql';
import { displayValue, genderLabel } from '@/lib/utils';
import { CharacterAvatar } from './CharacterAvatar';

export interface CharacterCardProps {
  character: CharacterSummaryFragment;
  onSelect: (id: string) => void;
  onPrefetch?: (id: string) => void;
}

export function CharacterCard({ character, onSelect, onPrefetch }: CharacterCardProps) {
  const name = character.name ?? 'Personaje sin nombre';
  const titleId = `character-${character.id}-name`;

  return (
    <Card component="article" aria-labelledby={titleId} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Stack direction="row" spacing={2} sx={{ alignItems: 'center', mb: 2 }}>
          <CharacterAvatar name={character.name} />
          <Typography id={titleId} variant="h6" component="h2" sx={{ lineHeight: 1.2 }}>
            {name}
          </Typography>
        </Stack>
        <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: 'wrap' }}>
          <Chip size="small" label={genderLabel(character.gender)} variant="outlined" />
          <Chip size="small" label={`Nacimiento: ${displayValue(character.birthYear)}`} variant="outlined" />
          {character.species?.name && (
            <Chip size="small" label={character.species.name} color="secondary" variant="outlined" />
          )}
        </Stack>
      </CardContent>
      <CardActions sx={{ px: 2, pb: 2 }}>
        <Button
          variant="contained"
          fullWidth
          endIcon={<ArrowForwardIcon aria-hidden />}
          onClick={() => onSelect(character.id)}
          onMouseEnter={() => onPrefetch?.(character.id)}
          onFocus={() => onPrefetch?.(character.id)}
          aria-label={`Ver detalle de ${name}`}
        >
          Ver detalle
        </Button>
      </CardActions>
    </Card>
  );
}
