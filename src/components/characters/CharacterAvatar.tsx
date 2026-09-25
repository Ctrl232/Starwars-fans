import Avatar, { type AvatarProps } from '@mui/material/Avatar';
import { initials } from '@/lib/utils';

interface CharacterAvatarProps extends Omit<AvatarProps, 'children'> {
  name: string | null | undefined;
  size?: number;
}

export function CharacterAvatar({ name, size = 48, sx, ...props }: CharacterAvatarProps) {
  return (
    <Avatar
      aria-hidden
      {...props}
      sx={{
        width: size,
        height: size,
        fontSize: size * 0.4,
        fontWeight: 800,
        bgcolor: 'rgba(255, 232, 31, 0.12)',
        color: 'primary.main',
        border: 1,
        borderColor: 'rgba(255, 232, 31, 0.35)',
        ...sx,
      }}
    >
      {initials(name)}
    </Avatar>
  );
}
