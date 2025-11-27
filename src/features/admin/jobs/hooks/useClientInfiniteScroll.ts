import { useEffect, useRef, useCallback } from "react";

export default function useClientInfiniteScroll({
  onLoadMore,
  enabled = true,
}: {
  onLoadMore: () => void;
  enabled?: boolean;
}) {
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
      threshold: 0,
    });

    if (loaderRef.current) observer.observe(loaderRef.current);

    return () => {
      if (loaderRef.current) observer.unobserve(loaderRef.current);
    };
  }, [handleObserver]);

  return loaderRef;
}
