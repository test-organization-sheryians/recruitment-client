import { useEffect, useRef, useState } from "react";

const TIMER_END_TIME_KEY = "test_deadline_timestamp";

export function useTestTimer(
  durationMinutes: number,
  enabled: boolean,
  onExpire: () => void
) {
  // Fix 1: Initialize to 0 or total seconds
  const [secondsLeft, setSecondsLeft] = useState<number>(0); 
  const onExpireRef = useRef(onExpire);

  useEffect(() => {
    onExpireRef.current = onExpire;
  }, [onExpire]);

  useEffect(() => {
    // Wait until we have a valid duration
    if (durationMinutes <= 0) return;

    let deadline = localStorage.getItem(TIMER_END_TIME_KEY);

    if (!deadline) {
      const newDeadline = Date.now() + durationMinutes * 60 * 1000;
      localStorage.setItem(TIMER_END_TIME_KEY, String(newDeadline));
      deadline = String(newDeadline);
    }

    const getRemainingSeconds = () => {
      const diff = parseInt(deadline!) - Date.now();
      return Math.max(0, Math.floor(diff / 1000));
    };

    // Fix 2: Sync state immediately when durationMinutes becomes available
    const initialRemaining = getRemainingSeconds();
    setSecondsLeft(initialRemaining);

    // If time is already up on load, trigger expiry
    if (initialRemaining <= 0) {
      localStorage.removeItem(TIMER_END_TIME_KEY);
      onExpireRef.current();
      return;
    }

    if (!enabled) return;

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
  }, [durationMinutes, enabled]); // durationMinutes here ensures it re-triggers when duration loads

  return secondsLeft;
}