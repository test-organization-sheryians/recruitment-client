import { useEffect, useRef, useCallback } from "react";

interface InfiniteScrollProps {
  onLoadMore: () => void;
  enabled?: boolean;
  rootMargin?: string;
}

export default function useInfiniteScroll({
  onLoadMore,
  enabled = true,
  rootMargin = "150px",
}: InfiniteScrollProps) {
  const loaderRef = useRef<HTMLDivElement | null>(null);

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const target = entries[0];
      if (target.isIntersecting && enabled) {
        onLoadMore();
      }
    },
    [enabled, onLoadMore]
  );

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin,
      threshold: 0,
    });

    if (loaderRef.current) observer.observe(loaderRef.current);

    return () => {
      if (loaderRef.current) observer.unobserve(loaderRef.current);
    };
  }, [handleObserver, rootMargin]);

  return loaderRef;
}
