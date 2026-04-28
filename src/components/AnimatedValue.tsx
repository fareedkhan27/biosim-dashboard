import { useEffect, useRef, useState } from "react";

interface AnimatedValueProps {
  value: string | number;
  className?: string;
  flashColor?: string;
}

export function AnimatedValue({
  value,
  className = "",
  flashColor = "#34d399",
}: AnimatedValueProps) {
  const [flash, setFlash] = useState(false);
  const prevRef = useRef(value);

  useEffect(() => {
    if (prevRef.current !== value) {
      setFlash(true);
      const timer = setTimeout(() => setFlash(false), 1500);
      prevRef.current = value;
      return () => clearTimeout(timer);
    }
  }, [value]);

  return (
    <span
      className={`transition-colors duration-300 inline-block ${className}`}
      style={
        flash
          ? {
              animation: `flash-update 1.5s ease-out`,
              color: flashColor,
            }
          : undefined
      }
    >
      {value}
    </span>
  );
}
