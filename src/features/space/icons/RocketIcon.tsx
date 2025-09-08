export default function RocketIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 64 64" {...props}>
      <path
        d="M32 4c8 8 12 20 12 28 0 4-1 8-2 12l6 8-10-5-4 9-4-9-10 5 6-8c-1-4-2-8-2-12 0-8 4-20 12-28z"
        fill="currentColor"
      />
      <circle cx="32" cy="25" r="5" fill="#fff" />
    </svg>
  );
}
