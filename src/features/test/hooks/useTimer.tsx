import { useEffect, useRef, useState } from "react";

const TIMER_END_TIME_KEY = "test_deadline_timestamp";

export function useTestTimer(
  durationMinutes: number,
  enabled: boolean,
  onExpire: () => void
) {
  const [secondsLeft, setSecondsLeft] = useState<number>(0);
  const onExpireRef = useRef(onExpire);

  useEffect(() => {
    onExpireRef.current = onExpire;
  }, [onExpire]);

  useEffect(() => {
    //Timer must not run unless enabled & duration exists
    if (!enabled || durationMinutes <= 0) return;

    const deadlineRaw = localStorage.getItem(TIMER_END_TIME_KEY);

    //If no deadline exists, DO NOTHING (test not started properly)
    if (!deadlineRaw) return;

    const deadline = Number(deadlineRaw);

    const getRemainingSeconds = () => {
      const diff = deadline - Date.now();
      return Math.max(0, Math.floor(diff / 1000));
    };

    // ✅ Sync immediately
    const initialRemaining = getRemainingSeconds();
    setSecondsLeft(initialRemaining);

    if (initialRemaining <= 0) {
      localStorage.removeItem(TIMER_END_TIME_KEY);
      onExpireRef.current();
      return;
    }

    const intervalId = setInterval(() => {
      const remaining = getRemainingSeconds();
      setSecondsLeft(remaining);

      if (remaining <= 0) {
        clearInterval(intervalId);
        localStorage.removeItem(TIMER_END_TIME_KEY);
        onExpireRef.current();
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [durationMinutes, enabled]);

  return secondsLeft;
}
