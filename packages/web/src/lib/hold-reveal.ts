import { useEffect, useState, type KeyboardEvent, type MouseEvent, type PointerEvent } from 'react';

// Press-and-hold reveal: show while the primary pointer / Space / Enter is
// held, hide on release. Shared by Reader paragraphs and LocalizedTextView.
export function useHoldReveal(resetKey: unknown) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [resetKey]);

  const show = () => setOpen(true);
  const hide = () => setOpen(false);

  return {
    open,
    onPointerDown: (e: PointerEvent<HTMLButtonElement>) => {
      if (e.button !== 0) return;
      // Optional: jsdom (and some older engines) don't implement capture.
      // Capture keeps pointerup on this element even if the pointer leaves it.
      e.currentTarget.setPointerCapture?.(e.pointerId);
      show();
    },
    onPointerUp: hide,
    onPointerCancel: hide,
    onLostPointerCapture: hide,
    onKeyDown: (e: KeyboardEvent<HTMLButtonElement>) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        if (!e.repeat) show();
      } else if (e.key === 'Escape') {
        hide();
      }
    },
    onKeyUp: (e: KeyboardEvent<HTMLButtonElement>) => {
      if (e.key === ' ' || e.key === 'Enter') hide();
    },
    onBlur: hide,
    // Long-press on touch otherwise opens the browser context menu.
    onContextMenu: (e: MouseEvent<HTMLButtonElement>) => e.preventDefault(),
  };
}
