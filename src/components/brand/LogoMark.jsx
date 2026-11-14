import { useId } from "react";
import { LOGO_ASPECT, LOGO_VIEWBOX, logoGradients, logoShapes } from "@/components/brand/logoShapes";

/**
 * The Web Smith Studio mark, drawn as inline SVG so it stays crisp at any size.
 * `size` is the height in pixels. The white slash follows the theme (--logo-slash)
 * so the mark keeps its contrast on both light and dark backgrounds.
 */
export function LogoMark({ size = 32, title, className, decorative = true }) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const width = Math.round(size * LOGO_ASPECT * 100) / 100;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={LOGO_VIEWBOX}
      width={width}
      height={size}
      className={className}
      role={decorative ? undefined : "img"}
      aria-hidden={decorative ? true : undefined}
      aria-label={decorative ? undefined : title}
      focusable="false"
    >
      <defs>
        {logoGradients.map((gradient) => {
          const id = `${uid}-${gradient.id}`;
          const stops = gradient.stops.map(([offset, color]) => <stop key={offset} offset={offset} stopColor={color} />);

          return gradient.type === "linear" ? (
            <linearGradient
              key={id}
              id={id}
              gradientUnits="userSpaceOnUse"
              x1={gradient.x1}
              y1={gradient.y1}
              x2={gradient.x2}
              y2={gradient.y2}
            >
              {stops}
            </linearGradient>
          ) : (
            <radialGradient key={id} id={id} gradientUnits="userSpaceOnUse" cx={gradient.cx} cy={gradient.cy} r={gradient.r}>
              {stops}
            </radialGradient>
          );
        })}
      </defs>

      {logoShapes.map((shape) =>
        shape.fill.startsWith("#") ? (
          <polygon key={shape.points} points={shape.points} style={{ fill: "var(--logo-slash, #ffffff)" }} />
        ) : (
          <polygon key={shape.points} points={shape.points} fill={`url(#${uid}-${shape.fill})`} />
        ),
      )}
    </svg>
  );
}
