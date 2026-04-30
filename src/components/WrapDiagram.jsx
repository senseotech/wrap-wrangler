import React from 'react';

export default function WrapDiagram({ className = '' }) {
  return (
    <svg
      viewBox="0 0 120 120"
      xmlns="http://www.w3.org/2000/svg"
      className={`w-full max-w-[180px] mx-auto opacity-60 dark:opacity-50 ${className}`}
      aria-hidden="true"
    >
      {/* Outer square rotated 45° (diamond) */}
      <polygon
        points="60,4 116,60 60,116 4,60"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.8"
        strokeDasharray="3 2"
        className="text-stone-500 dark:text-stone-400"
      />
      {/* Inner box (the parcel) */}
      <rect
        x="38" y="42" width="44" height="36"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
        className="text-stone-600 dark:text-stone-400"
      />
      {/* Diagonal line across the parcel */}
      <line
        x1="4" y1="60" x2="116" y2="60"
        stroke="currentColor"
        strokeWidth="0.5"
        strokeDasharray="2 3"
        className="text-stone-400 dark:text-stone-500"
      />
      <line
        x1="60" y1="4" x2="60" y2="116"
        stroke="currentColor"
        strokeWidth="0.5"
        strokeDasharray="2 3"
        className="text-stone-400 dark:text-stone-500"
      />
      {/* Corner fold lines */}
      <line x1="60" y1="4" x2="38" y2="42" stroke="currentColor" strokeWidth="0.7" className="text-stone-400" />
      <line x1="116" y1="60" x2="82" y2="42" stroke="currentColor" strokeWidth="0.7" className="text-stone-400" />
      <line x1="60" y1="116" x2="82" y2="78" stroke="currentColor" strokeWidth="0.7" className="text-stone-400" />
      <line x1="4" y1="60" x2="38" y2="78" stroke="currentColor" strokeWidth="0.7" className="text-stone-400" />
      {/* Corner diamonds */}
      {[[60,4],[116,60],[60,116],[4,60]].map(([cx,cy], i) => (
        <circle key={i} cx={cx} cy={cy} r="1.5" fill="currentColor" className="text-stone-400 dark:text-stone-500" />
      ))}
    </svg>
  );
}