import { useState, useEffect, useRef, useCallback } from "react";
import useAITest from "@/features/AITest/hooks/useAITest";

const MAX_VIOLATIONS = 3;
const COOLDOWN_MS = 800; // Time to wait between violations (prevents double triggers)

export function useAntiCheat(
  attemptId: string | null,
  onDisqualify: () => void
) {
  // 1. Setup Dependencies
  const { reportViolationMutation } = useAITest();
  const STORAGE_KEY = `cheat-count:${attemptId}`;
  
  const lastViolationTime = useRef<number>(0);

  const [switchCount, setSwitchCount] = useState<number>(() => {
    if (typeof window === "undefined" || !attemptId) return 0;
    
    const saved = sessionStorage.getItem(STORAGE_KEY);
    return saved ? parseInt(saved, 10) : 0;
  });

  const [isDisqualified, setIsDisqualified] = useState(false);

  const handleViolation = useCallback(() => {
    if (isDisqualified || !attemptId) return;

    const now = Date.now();
    if (now - lastViolationTime.current < COOLDOWN_MS) return;
    lastViolationTime.current = now;

    setSwitchCount((prevCount) => {
      const nextCount = prevCount + 1;

      sessionStorage.setItem(STORAGE_KEY, String(nextCount));
      reportViolationMutation.mutate({ attemptId });

      if (nextCount === 1) {
        alert("⚠️ WARNING: You switched focus. Please stay on this page.");
      } else if (nextCount === 2) {
        alert("⚠️ FINAL WARNING: One more switch will terminate the test.");
      } else if (nextCount >= MAX_VIOLATIONS) {
        setIsDisqualified(true);
        onDisqualify();
      }

      return nextCount;
    });
  }, [attemptId, isDisqualified, onDisqualify, reportViolationMutation, STORAGE_KEY]);

  useEffect(() => {
    if (switchCount >= MAX_VIOLATIONS && !isDisqualified) {
      setIsDisqualified(true);
      onDisqualify();
    }
  }, [switchCount, isDisqualified, onDisqualify]);

  useEffect(() => {
    if (!attemptId || isDisqualified) return;

    const handleVisibilityChange = () => {
      if (document.hidden) handleViolation();
    };

    const handleBlur = () => {
      if (document.activeElement?.tagName === "IFRAME") return; // Optional: Ignore iframe clicks
      handleViolation();
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleBlur);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleBlur);
    };
  }, [attemptId, isDisqualified, handleViolation]);

  return { switchCount, isDisqualified };
}