import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <TextField
      fullWidth
      label="Buscar personaje por nombre"
      placeholder="Ej: Luke, Leia, Vader…"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      autoComplete="off"
      slotProps={{
        htmlInput: { enterKeyHint: 'search', 'aria-controls': 'characters-results' },
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon aria-hidden />
            </InputAdornment>
          ),
          endAdornment: value ? (
            <InputAdornment position="end">
              <IconButton aria-label="Limpiar búsqueda" onClick={() => onChange('')} edge="end">
                <ClearIcon />
              </IconButton>
            </InputAdornment>
          ) : undefined,
        },
      }}
    />
  );
}
