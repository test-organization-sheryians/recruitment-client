import { useState, useEffect, useRef } from "react";
import useAITest from "@/features/AITest/hooks/useAITest";

export function useAntiCheat(
  attemptId: string | null,
  onDisqualify: () => void
) {
  const [switchCount, setSwitchCount] = useState(0);
  const [isDisqualified, setIsDisqualified] = useState(false);

  const countRef = useRef(0);
  const { reportViolationMutation } = useAITest();
   const lastViolationRef = useRef(0);
  const initializedRef = useRef(false);

  useEffect(() => {
    if (!attemptId || isDisqualified || initializedRef.current) return;
    initializedRef.current = true;

    const registerViolation = () => {

      const now = Date.now();
      if (now - lastViolationRef.current < 800) return; // ⛔ prevent double fire
      lastViolationRef.current = now;

      const nextCount = ++countRef.current;
      setSwitchCount(nextCount);
      reportViolationMutation.mutate({ attemptId });

      if (nextCount === 1)
        alert("⚠️ WARNING: You switched focus");
      else if (nextCount === 2)
        alert("⚠️ FINAL WARNING: One more switch will terminate the test");
      else if (nextCount >= 3) {
        setIsDisqualified(true);
        onDisqualify();
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden) registerViolation();
    };

    const handleBlur = () => {
      // 🔥 Detect split-screen / window focus loss
      registerViolation();
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleBlur);

    return () => {
      initializedRef.current = false;
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleBlur);
    };
  }, [attemptId, isDisqualified, onDisqualify, reportViolationMutation]);

  return { switchCount, isDisqualified };
}