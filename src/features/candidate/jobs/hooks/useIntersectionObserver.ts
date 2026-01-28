// hooks/useIntersectionObserver.ts
"use client";

import { useCallback, useRef } from "react";

interface Props {
  onIntersect: () => void;
  enabled?: boolean;
  rootMargin?: string;
}

export function useIntersectionObserver({
  onIntersect,
  enabled = true,
  rootMargin = "200px",
}: Props) {
  const observer = useRef<IntersectionObserver | null>(null);

  const ref = useCallback(
    (node: HTMLDivElement | null) => {
      if (!enabled) return;

      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            onIntersect();
          }
        },
        { rootMargin }
      );

      if (node) observer.current.observe(node);
    },
    [onIntersect, enabled, rootMargin]
  );

  return ref;
}
