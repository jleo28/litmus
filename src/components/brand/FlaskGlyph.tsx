interface FlaskGlyphProps {
  size: number;
  strokeWidth: number;
}

export default function FlaskGlyph({ size, strokeWidth }: FlaskGlyphProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="#1c1b19"
      strokeWidth={strokeWidth}
      strokeLinejoin="round"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path
        d="M7.4 14.6h9.2l2.6 4.8a1.7 1.7 0 0 1-1.5 2.5H6.3a1.7 1.7 0 0 1-1.5-2.5z"
        fill="rgba(28,27,25,.2)"
        stroke="none"
      />
      <path d="M10 2.6v6.6L4.8 19.4a1.7 1.7 0 0 0 1.5 2.5h11.4a1.7 1.7 0 0 0 1.5-2.5L14 9.2V2.6" />
      <path d="M9.2 2.6h5.6" />
    </svg>
  );
}
