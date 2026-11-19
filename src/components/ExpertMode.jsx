import React from 'react';

function formatRaw(value, unit) {
  const display = Number(value.toPrecision(6));
  return `${display === value ? '' : '≈ '}${display} ${unit}`;
}

export default function ExpertMode({ calculations, unit }) {
  const unitLabel = unit === 'inches' ? 'in' : 'cm';
  const altLabel = unit === 'inches' ? 'cm' : 'in';
  const { derivation, alternate } = calculations;

  const rows = [
    { label: '√(w² + d²)', value: formatRaw(derivation.baseDiagonal, unitLabel), note: 'base diagonal' },
    { label: '+ 2h', value: formatRaw(derivation.heightAllowance, unitLabel), note: 'height allowance' },
    { label: 'paper_diagonal', value: formatRaw(derivation.paperDiagonal, unitLabel), note: 'raw diagonal' },
    { label: '÷ √2', value: '÷ 1.4142…', note: '' },
    { label: 'paper_side', value: formatRaw(derivation.paperSide, unitLabel), note: 'raw side' },
  ];

  return (
    <div className="mt-4 border-t border-stone-100 dark:border-stone-800 pt-4 space-y-3">
        <p className="text-[10px] tracking-[0.2em] uppercase select-none mb-3" style={{color: 'var(--text-muted)'}}>
        Derivation · raw values
        </p>
      <div className="font-mono text-xs space-y-1.5">
        {rows.map((row, i) => (
          <div key={i} className="flex items-baseline gap-3">
      <span className="text-stone-400 dark:text-stone-500 w-24 shrink-0 select-none">{row.label}</span>
            <span className="tabular-nums" style={{color: 'var(--amber-bright)'}}>{row.value}</span>
            {row.note && <span className="text-stone-300 dark:text-stone-600 text-[10px] select-none">← {row.note}</span>}
          </div>
        ))}
      </div>

      <div className="pt-3 border-t border-stone-100 dark:border-stone-800">
        <p className="text-[10px] tracking-[0.2em] uppercase select-none mb-2" style={{color: 'var(--text-muted)'}}>
          Cutting recommendation · {altLabel}
        </p>
        <div className="font-mono text-xs space-y-1">
          <div className="flex items-baseline gap-3">
            <span className="text-stone-400 dark:text-stone-500 w-32 shrink-0 select-none">Required Side</span>
            <span className="tabular-nums" style={{color: 'var(--amber-bright)'}}>{alternate.paperSide} {altLabel}</span>
          </div>
          <div className="flex items-baseline gap-3">
            <span className="text-stone-400 dark:text-stone-500 w-32 shrink-0 select-none">Paper Diagonal</span>
            <span className="tabular-nums" style={{color: 'var(--amber-bright)'}}>{alternate.paperDiagonal} {altLabel}</span>
          </div>
        </div>
      </div>
    </div>
  );
}