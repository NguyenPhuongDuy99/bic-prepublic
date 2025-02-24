import { cn } from "@/lib/utils";
import Countdown, { formatTimeDelta } from "react-countdown";

interface Props {
  date: Date | number | string;
  classNames?: {
    countdown?: string;
    container?: string;
  };
  onComplete?: () => void;
}

export const CountDownItemDisplay = ({
  time,
  className = "w-[50px] px-3 py-1",
  label,
}: {
  className?: string;
  time: string;
  label?: string;
}) => (
  <div
    className={cn(
      "rounded-lg flex flex-col items-center justify-center  border border-gray-10",
      className,
    )}
  >
    <div className="text-base font-medium text-neutral-60">{time}</div>
    {label && (
      <div className="text-xs font-normal text-neutral-30">{label}</div>
    )}
  </div>
);
export default function CustomCountdown({
  date,
  classNames,
  onComplete,
}: Props) {
  return (
    <Countdown
      date={date}
      renderer={(props) => {
        const value = formatTimeDelta(props, {
          zeroPadTime: 2,
        });
        return (
          <div
            className={cn("flex items-center gap-2 ", classNames?.container)}
          >
            <CountDownItemDisplay
              time={value.days}
              className={classNames?.countdown}
              label="day"
            />
            <CountDownItemDisplay
              time={value.hours}
              className={classNames?.countdown}
              label="hour"
            />

            <CountDownItemDisplay
              time={value.minutes}
              className={classNames?.countdown}
              label="min"
            />

            <CountDownItemDisplay
              time={value.seconds}
              className={classNames?.countdown}
              label="sec"
            />
          </div>
        );
      }}
      onComplete={onComplete}
    />
  );
}
