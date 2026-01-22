import { useEffect, useRef, useState } from "react";

export function useTestTimer(
  durationMinutes: number,
  enabled: boolean,
  onExpire: () => void
) {
  const secondsRef = useRef(durationMinutes * 60);
  const onExpireRef = useRef(onExpire);
  const [, forceRender] = useState(0);

  useEffect(() => {
    onExpireRef.current = onExpire;
  }, [onExpire]);

    useEffect(() => {
    if (durationMinutes > 0) {
      secondsRef.current = durationMinutes * 60;
    }
  }, [durationMinutes]);


  useEffect(() => {
    if (!enabled || secondsRef.current <= 0) return;

    const id = setInterval(() => {
      secondsRef.current -= 1;
      forceRender((n) => n + 1);

      if (secondsRef.current <= 0) {
        clearInterval(id);
        onExpireRef.current();
      }
    }, 1000);

    return () => clearInterval(id);
  }, [enabled, durationMinutes]);

  return secondsRef.current;
}
