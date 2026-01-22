import { useCallback, useEffect, useRef, useState } from "react";

const MIN = 25;
const MAX = 75;
const INIT = 50;

export function useSplitEditor() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(INIT);
  const [dragging, setDragging] = useState(false);

  const onDrag = useCallback((e: MouseEvent) => {
    if (!dragging || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const w = ((e.clientX - rect.left) / rect.width) * 100;
    setWidth(Math.max(MIN, Math.min(MAX, w)));
  }, [dragging]);

  useEffect(() => {
    const stopDrag = () => setDragging(false);
    window.addEventListener("mousemove", onDrag);
    window.addEventListener("mouseup", stopDrag);
    return () => {
      window.removeEventListener("mousemove", onDrag);
      window.removeEventListener("mouseup", stopDrag);
    };
  }, [onDrag]);

  return {
    containerRef,
    width,
    startDrag: () => setDragging(true),
  };
}
