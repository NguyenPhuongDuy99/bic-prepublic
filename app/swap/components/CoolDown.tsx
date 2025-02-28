import Countdown from "react-countdown";

import { CountDownItemDisplay } from "./CountDown";
interface Props {
  date: Date | number | string;
  className?: string;
  onComplete?: () => void;
}

export default function CoolDown({ date, className, onComplete }: Props) {
  console.log("date", date);
  return(
    <Countdown
      date={date}
      renderer={(props) => {
        const totalSeconds = Math.ceil(props.total / 1000);

        return (
          <CountDownItemDisplay
            time={totalSeconds.toString()}
            className={className}
            label="sec"
          />
        );
      }}
      onComplete={onComplete}
    />
  );
}
