import { CSSProperties } from "react";
import FlaskGlyph from "@/components/brand/FlaskGlyph";

interface LitmusWordmarkProps {
  fontSize: number;
  flaskSize: number;
  flaskStrokeWidth: number;
  flaskBottom: number;
  flaskTranslateX?: string;
  flaskStyle?: CSSProperties;
  style?: CSSProperties;
  className?: string;
}

// The wordmark is "L" + a dotless i (u0131) + "tmus", with a small flask
// standing in for the i's tittle. See docs/design/CHANGELOG.md, #1.
export default function LitmusWordmark({
  fontSize,
  flaskSize,
  flaskStrokeWidth,
  flaskBottom,
  flaskTranslateX = "-50%",
  flaskStyle,
  style,
  className = "",
}: LitmusWordmarkProps) {
  return (
    <span
      className={`font-serif font-medium tracking-[-0.015em] text-ink inline-flex items-baseline ${className}`}
      style={{ fontSize, ...style }}
    >
      L
      <span className="relative inline-block">
        ı
        <span
          className="absolute left-1/2 flex items-end justify-center leading-none z-10"
          style={{
            bottom: flaskBottom,
            width: flaskSize,
            height: flaskSize,
            transform: `translateX(${flaskTranslateX})`,
            transformOrigin: "50% 100%",
            ...flaskStyle,
          }}
        >
          <FlaskGlyph size={flaskSize} strokeWidth={flaskStrokeWidth} />
        </span>
      </span>
      tmus
    </span>
  );
}
