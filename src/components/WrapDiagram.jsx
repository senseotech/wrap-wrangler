import React from 'react';

/**
 * WrapDiagram — proportional SVG diagram of the diagonal wrap technique.
 *
 * When dimensions are provided, the inner box (parcel) and outer diamond
 * (paper square) scale to reflect the actual width:depth ratio of the box.
 * When no valid dimensions exist, falls back to a neutral static state.
 *
 * Geometry:
 *   - The outer diamond represents the paper square rotated 45°
 *   - The inner rect represents the box top-down at width:depth aspect ratio
 *   - Fold lines connect each diamond corner to the nearest two box corners
 */
export default function WrapDiagram({ dimensions, calculations, className = '' }) {
  const w = parseFloat(dimensions?.width) || 0;
  const d = parseFloat(dimensions?.depth) || 0;
  const hasValidDims = w > 0 && d > 0;

  // ViewBox is 120×120, center at (60, 60). 6px padding on each edge.
  const CENTER = 60;
  const MAX_HALF = 54; // max distance from center to diamond point

  let boxW, boxH, diamondHalf;

  if (hasValidDims) {
    // Normalize so the longer dimension drives the box scale.
    // Box can use up to 52% of the available half-diagonal.
    const aspect = d / w;
    const maxBoxHalf = MAX_HALF * 0.52;

    if (w >= d) {
      boxW = maxBoxHalf * 2;
      boxH = boxW * aspect;
    } else {
      boxH = maxBoxHalf * 2;
      boxW = boxH / aspect;
    }

    // Diamond half = box half-diagonal + a fixed margin for the fold flaps
    const boxDiagHalf = Math.sqrt((boxW / 2) ** 2 + (boxH / 2) ** 2);
    diamondHalf = Math.min(boxDiagHalf + MAX_HALF * 0.38, MAX_HALF);
  } else {
    // Static neutral state — original proportions
    boxW = 44;
    boxH = 36;
    diamondHalf = MAX_HALF;
  }

  const halfW = boxW / 2;
  const halfH = boxH / 2;

  // Box corners
  const boxLeft   = CENTER - halfW;
  const boxRight  = CENTER + halfW;
  const boxTop    = CENTER - halfH;
  const boxBottom = CENTER + halfH;

  // Diamond points (N, E, S, W)
  const dN = [CENTER,               CENTER - diamondHalf];
  const dE = [CENTER + diamondHalf, CENTER              ];
  const dS = [CENTER,               CENTER + diamondHalf];
  const dW = [CENTER - diamondHalf, CENTER              ];

  return (
    <svg
      viewBox="0 0 120 120"
      xmlns="http://www.w3.org/2000/svg"
      className={`w-full max-w-[180px] mx-auto opacity-60 dark:opacity-50 ${className}`}
      aria-hidden="true"
    >
      {/* Outer diamond (paper square rotated 45°) */}
      <polygon
        points={`${dN[0]},${dN[1]} ${dE[0]},${dE[1]} ${dS[0]},${dS[1]} ${dW[0]},${dW[1]}`}
        fill="none"
        stroke="currentColor"
        strokeWidth="0.8"
        strokeDasharray="3 2"
        className="text-stone-500 dark:text-stone-400"
      />

      {/* Inner box (the parcel, top-down) */}
      <rect
        x={boxLeft}
        y={boxTop}
        width={boxW}
        height={boxH}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
        className="text-stone-600 dark:text-stone-400"
      />

      {/* Centre crosshair guide lines */}
      <line
        x1={dW[0]} y1={dW[1]} x2={dE[0]} y2={dE[1]}
        stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 3"
        className="text-stone-400 dark:text-stone-500"
      />
      <line
        x1={dN[0]} y1={dN[1]} x2={dS[0]} y2={dS[1]}
        stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 3"
        className="text-stone-400 dark:text-stone-500"
      />

      {/* Fold lines — each diamond corner to its two nearest box corners */}
      <line x1={dN[0]} y1={dN[1]} x2={boxLeft}  y2={boxTop}    stroke="currentColor" strokeWidth="0.7" className="text-stone-400" />
      <line x1={dN[0]} y1={dN[1]} x2={boxRight} y2={boxTop}    stroke="currentColor" strokeWidth="0.7" className="text-stone-400" />
      <line x1={dE[0]} y1={dE[1]} x2={boxRight} y2={boxTop}    stroke="currentColor" strokeWidth="0.7" className="text-stone-400" />
      <line x1={dE[0]} y1={dE[1]} x2={boxRight} y2={boxBottom} stroke="currentColor" strokeWidth="0.7" className="text-stone-400" />
      <line x1={dS[0]} y1={dS[1]} x2={boxRight} y2={boxBottom} stroke="currentColor" strokeWidth="0.7" className="text-stone-400" />
      <line x1={dS[0]} y1={dS[1]} x2={boxLeft}  y2={boxBottom} stroke="currentColor" strokeWidth="0.7" className="text-stone-400" />
      <line x1={dW[0]} y1={dW[1]} x2={boxLeft}  y2={boxBottom} stroke="currentColor" strokeWidth="0.7" className="text-stone-400" />
      <line x1={dW[0]} y1={dW[1]} x2={boxLeft}  y2={boxTop}    stroke="currentColor" strokeWidth="0.7" className="text-stone-400" />

      {/* Diamond corner dots */}
      {[dN, dE, dS, dW].map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r="1.5" fill="currentColor" className="text-stone-400 dark:text-stone-500" />
      ))}
    </svg>
  );
}
