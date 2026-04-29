import React from 'react';

export default function ExpertMode({ dimensions, calculations, unit }) {
  const w = parseFloat(dimensions.width) || 0;
  const d = parseFloat(dimensions.depth) || 0;
  const h = parseFloat(dimensions.height) || 0;
  const unitLabel = unit === 'inches' ? 'in' : 'cm';
  const altLabel = unit === 'inches' ? 'cm' : 'in';
  const factor = unit === 'inches' ? 2.54 : (1 / 2.54);

  if (!calculations) return null;

  const baseDiag = Math.sqrt(w * w + d * d);
  const rawDiag = baseDiag + 2 * h;
  const rawSide = rawDiag / Math.sqrt(2);
  const altSide = Math.round(rawSide * factor * 10) / 10;
  const altDiag = Math.round(rawDiag * factor * 10) / 10;

  const rows = [
    { label: '√(w² + d²)', value: `${Math.round(baseDiag * 100) / 100} ${unitLabel}`, note: 'base diagonal' },
    { label: '+ 2h', value: `+ ${Math.round(2 * h * 100) / 100} ${unitLabel}`, note: 'height allowance' },
    { label: 'paper_diagonal', value: `${calculations.paperDiagonal} ${unitLabel}`, note: 'raw diagonal' },
    { label: '÷ √2', value: `÷ 1.4142…`, note: '' },
    { label: 'paper_side', value: `${calculations.paperSide} ${unitLabel}`, note: 'final result' },
  ];

  return (
    <div className="mt-4 border-t border-stone-100 dark:border-stone-800 pt-4 space-y-3">
      <p className="text-[10px] tracking-[0.2em] uppercase text-stone-400 dark:text-stone-500 select-none mb-3">
        Derivation
      </p>
      <div className="font-mono text-xs space-y-1.5">
        {rows.map((row, i) => (
          <div key={i} className="flex items-baseline gap-3">
            <span className="text-stone-400 dark:text-stone-500 w-32 shrink-0 select-none">{row.label}</span>
            <span className="text-stone-700 dark:text-stone-300 tabular-nums">{row.value}</span>
            {row.note && <span className="text-stone-300 dark:text-stone-600 text-[10px] select-none">← {row.note}</span>}
          </div>
        ))}
      </div>

      <div className="pt-3 border-t border-stone-100 dark:border-stone-800">
        <p className="text-[10px] tracking-[0.2em] uppercase text-stone-400 dark:text-stone-500 select-none mb-2">
          Converted ({altLabel})
        </p>
        <div className="font-mono text-xs space-y-1">
          <div className="flex items-baseline gap-3">
            <span className="text-stone-400 dark:text-stone-500 w-32 shrink-0 select-none">Required Side</span>
            <span className="text-stone-700 dark:text-stone-300 tabular-nums">{altSide} {altLabel}</span>
          </div>
          <div className="flex items-baseline gap-3">
            <span className="text-stone-400 dark:text-stone-500 w-32 shrink-0 select-none">Paper Diagonal</span>
            <span className="text-stone-700 dark:text-stone-300 tabular-nums">{altDiag} {altLabel}</span>
          </div>
        </div>
      </div>
    </div>
  );
}