export default function PlanetRingIcon({
  color = "currentColor",
}: {
  color?: string;
}) {
  return (
    <svg viewBox="0 0 120 120" className="h-full w-full">
      <circle
        cx="60"
        cy="60"
        r="28"
        fill="#fff"
        stroke={color}
        strokeWidth="6"
      />
      <ellipse
        cx="60"
        cy="60"
        rx="50"
        ry="20"
        fill="none"
        stroke={color}
        strokeWidth="6"
      />
    </svg>
  );
}
