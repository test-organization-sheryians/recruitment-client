import { useEffect, useState } from "react";

export function useStartingTimer(seconds = 5) {
  const [timeLeft, setTimeLeft] = useState(seconds);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (timeLeft === 0) {
      setStarted(true);
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft((t) => t - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft]);

  return {
    timeLeft,
    started,
  };
}
