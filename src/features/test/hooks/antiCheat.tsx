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

  const initializedRef = useRef(false);

  useEffect(() => {
    if (!attemptId || isDisqualified || initializedRef.current) return;
  initializedRef.current = true;
  
     const handleVisibilityChange = () => {
      if (!document.hidden) return;

      const nextCount = ++countRef.current;
      setSwitchCount(nextCount);
      reportViolationMutation.mutate({ attemptId });

      if (nextCount === 1)
        alert("⚠️ WARNING: You switched tabs");
      else if (nextCount === 2)
        alert("⚠️ FINAL WARNING: One more switch will terminate the test");
      else if (nextCount >= 3) {
        setIsDisqualified(true);
        onDisqualify(); 
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
   return () => {
      initializedRef.current = false;
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [attemptId, isDisqualified, onDisqualify, reportViolationMutation]);

  return { switchCount, isDisqualified };
}