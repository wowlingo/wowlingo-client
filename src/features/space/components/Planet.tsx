import { cn } from "@/shared/lib/cn";
import PlanetRingIcon from "../icons/PlanetRingIcon";
import type { PlanetStatus } from "../model/types";

interface PlanetProps {
  id: string;
  label: string;
  status: PlanetStatus; // "correct"|"wrong"|"dim"|"idle"
  style: React.CSSProperties; // top/left 퍼센트 스타일
  onClick: (id: string) => void;
  planetRef: (id: string, el: HTMLDivElement | null) => void;
}

export default function Planet({
  id,
  label,
  status,
  style,
  onClick,
  planetRef,
}: PlanetProps) {
  const color =
    status === "correct"
      ? "#2563eb"
      : status === "wrong"
        ? "#ef4444"
        : "#111827"; // blue-600 / red-500 / gray-900
  const glow =
    status === "correct"
      ? "ring-4 ring-blue-300"
      : status === "wrong"
        ? "ring-4 ring-red-300"
        : "";
  const dim = status === "dim" ? "opacity-40" : "";

  return (
    <div
      ref={(el) => planetRef(id, el)}
      style={style}
      className={cn(
        "absolute -translate-x-1/2 -translate-y-1/2 select-none",
        "h-28 w-28 rounded-full grid place-items-center",
        glow,
        dim,
      )}
      onClick={() => onClick(id)}
      role="button"
    >
      <div className="relative h-28 w-28">
        <PlanetRingIcon color={color} />
        <div className="pointer-events-none absolute inset-0 grid place-items-center">
          <span className="text-base font-semibold" style={{ color }}>
            {label}
          </span>
        </div>
      </div>
    </div>
  );
}
