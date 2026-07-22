import { useEffect, useState } from 'react';

// Hover (and optional focus) reveal: show while the pointer is over the
// element, hide on leave. Used where a click/hold already means something
// else (e.g. selecting a quest answer).
export function useHoverReveal(resetKey: unknown) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [resetKey]);

  return {
    open,
    onMouseEnter: () => setOpen(true),
    onMouseLeave: () => setOpen(false),
    onFocus: () => setOpen(true),
    onBlur: () => setOpen(false),
  };
}
