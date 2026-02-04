import { useEffect, useRef, useState } from "react";

const TIMER_END_TIME_KEY = "test_deadline_timestamp";

export function useTestTimer(
  durationMinutes: number,
  enabled: boolean,
  onExpire: () => void
) {
  // Initialize state to total seconds initially
  const [secondsLeft, setSecondsLeft] = useState<number>(durationMinutes * 60);
  const onExpireRef = useRef(onExpire);

  // Keep the expire callback fresh
  useEffect(() => {
    onExpireRef.current = onExpire;
  }, [onExpire]);

  useEffect(() => {
    if (durationMinutes <= 0) return;

    // 1. Get or Set the fixed Deadline
    let deadline = localStorage.getItem(TIMER_END_TIME_KEY);

    if (!deadline) {
      const newDeadline = Date.now() + durationMinutes * 60 * 1000;
      localStorage.setItem(TIMER_END_TIME_KEY, String(newDeadline));
      deadline = String(newDeadline);
    }

    // Helper to calculate how many seconds are left until the deadline
    const getRemainingSeconds = () => {
      const diff = parseInt(deadline!) - Date.now();
      return Math.max(0, Math.floor(diff / 1000));
    };

    // Immediate sync on mount
    setSecondsLeft(getRemainingSeconds());

    if (!enabled) return;

    // 2. Start the interval
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



   