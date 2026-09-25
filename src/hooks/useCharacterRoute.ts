'use client';
import { useCallback, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { characterPath } from './characterPath';

const CHARACTER_PATH = /^\/characters\/([^/]+)\/?$/;

export { characterPath };

function decode(segment: string) {
  try {
    return decodeURIComponent(segment);
  } catch {
    return segment;
  }
}

export function useCharacterRoute() {
  const pathname = usePathname();
  const openedFromList = useRef(false);

  const match = pathname?.match(CHARACTER_PATH);
  const selectedId = match ? decode(match[1]) : null;

  const open = useCallback((id: string) => {
    openedFromList.current = true;
    window.history.pushState(null, '', characterPath(id));
  }, []);

  const close = useCallback(() => {
    if (openedFromList.current) {
      openedFromList.current = false;
      window.history.back();
    } else {
      window.history.replaceState(null, '', '/');
    }
  }, []);

  return { selectedId, open, close };
}
