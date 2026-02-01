import { useEffect, useCallback, useState } from "react";

interface PersistPayload<TQ, TA> {
  step: number;
  questions: TQ[];
  answers: TA[];
  visited: number[];
  saved: number[];
  review: number[];
}

export function useTestPersistence<TQ, TA>(
  storageKey: string,
  initialState: PersistPayload<TQ, TA>
) {
  const [restored, setRestored] = useState(false);
  const [state, setState] = useState(initialState);

  /* ---------- RESTORE ---------- */
  useEffect(() => {
    const stored = localStorage.getItem(storageKey);
    if (!stored) {
      setRestored(true);
      return;
    }

    try {
      const parsed = JSON.parse(stored);
      setState({
        ...initialState,
        ...parsed,
        visited: parsed.visited ?? [],
        saved: parsed.saved ?? [],
        review: parsed.review ?? [],
      });
    } catch {
      console.warn("Failed to restore test state");
    } finally {
      setRestored(true);
    }
  }, [storageKey]);

  /* ---------- PERSIST ---------- */
  const persist = useCallback(
    (next: Partial<PersistPayload<TQ, TA>>) => {
      if (!restored) return;

      setState((prev) => {
        const merged = { ...prev, ...next };
        localStorage.setItem(storageKey, JSON.stringify(merged));
        return merged;
      });
    },
    [restored, storageKey]
  );

  /* ---------- SAFETY SAVE ---------- */
  useEffect(() => {
    if (!restored) return;
    const handler = () =>
      localStorage.setItem(storageKey, JSON.stringify(state));

    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [state, restored, storageKey]);

  return {
    restored,   // 🔥 gate ALL logic with this
    state,      // single source of truth
    persist,    // controlled writes only
    setState,   // for controlled internal updates
  };
}
