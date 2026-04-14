import useCountdown from "../Hooks/useCountdown";
import "../styles/countdowntimer.css";

function TimerUnit({ value, label }) {
  let formattedValue = value;

  if (value < 10) {
    formattedValue = "0" + value;
  }

  return (
    <div className="timer-unit d-flex flex-column align-items-center justify-content-center text-white rounded">
      <span className="timer-value">{formattedValue}</span>
      <span className="timer-label">{label}</span>
    </div>
  );
}

export default function CountdownTimer({ targetDate }) {
  const { days, hours, minutes, seconds } = useCountdown(targetDate);

  return (
    <div className="d-flex gap-2" dir="ltr">
      <TimerUnit value={days} label="Days" />
      <TimerUnit value={hours} label="Hour" />
      <TimerUnit value={minutes} label="Min" />
      <TimerUnit value={seconds} label="Sec" />
    </div>
  );
}