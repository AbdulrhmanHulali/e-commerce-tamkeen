import { useState, useEffect } from "react";

export default function useCountdown(targetDate) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const timerInterval = setInterval(() => {
      const now = new Date();
      const difference = targetDate - now;

      if (difference <= 0) {
        clearInterval(timerInterval);
        return;
      }

      const SECOND = 1000;
      const MINUTE = SECOND * 60;
      const HOUR = MINUTE * 60;
      const DAY = HOUR * 24;

      const d = Math.floor(difference / DAY);

      const h = Math.floor((difference % DAY) / HOUR);

      const m = Math.floor((difference % HOUR) / MINUTE);

      const s = Math.floor((difference % MINUTE) / SECOND);

      setTimeLeft({ days: d, hours: h, minutes: m, seconds: s });
    }, 1000);

    return () => clearInterval(timerInterval);
  }, [targetDate]);

  return timeLeft;
}
