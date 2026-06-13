"use client";

import { useEffect } from "react";

function isProtectedMedia(target: EventTarget | null): boolean {
  if (!(target instanceof Element)) return false;
  return Boolean(target.closest("img, video, picture"));
}

export default function MediaProtection() {
  useEffect(() => {
    function blockContextMenu(event: MouseEvent) {
      if (isProtectedMedia(event.target)) {
        event.preventDefault();
      }
    }

    function blockDragStart(event: DragEvent) {
      if (isProtectedMedia(event.target)) {
        event.preventDefault();
      }
    }

    document.addEventListener("contextmenu", blockContextMenu);
    document.addEventListener("dragstart", blockDragStart);

    return () => {
      document.removeEventListener("contextmenu", blockContextMenu);
      document.removeEventListener("dragstart", blockDragStart);
    };
  }, []);

  return null;
}
