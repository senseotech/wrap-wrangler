import React from 'react';
import WrapDiagram from './WrapDiagram';

export default function ProtocolCard({ calculations, unit, dimensions }) {
  const unitLabel = unit === 'inches' ? 'in' : 'cm';

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      {/* Print styles injected inline */}
      <style>{`
        @media print {
          body * { visibility: hidden; }
          .protocol-card-printable, .protocol-card-printable * { visibility: visible; }
          .protocol-card-printable {
            position: fixed;
            top: 40px;
            left: 40px;
            right: 40px;
            background: white;
            padding: 40px;
          }
        }
      `}</style>

      {/* Screen version (also used for printing via visibility trick) */}
      <div className="protocol-card-printable border border-stone-200 dark:border-stone-700 rounded p-5 mt-2">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <p className="text-[10px] tracking-[0.2em] uppercase text-stone-400 dark:text-stone-500 mb-3 select-none">
              Protocol Card
            </p>
            <div className="font-mono text-sm space-y-1 mb-4">
              <div className="flex items-baseline gap-2">
                <span className="text-stone-400 dark:text-stone-500 text-xs select-none w-36">Square Side</span>
                <span className="text-stone-800 dark:text-stone-200 tabular-nums font-medium">{calculations?.paperSide}</span>
                <span className="text-stone-400 dark:text-stone-500 text-xs">{unitLabel}</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-stone-400 dark:text-stone-500 text-xs select-none w-36">Paper Diagonal</span>
                <span className="text-stone-800 dark:text-stone-200 tabular-nums">{calculations?.paperDiagonal}</span>
                <span className="text-stone-400 dark:text-stone-500 text-xs">{unitLabel}</span>
              </div>
            </div>
            <p className="font-mono text-[10px] text-stone-300 dark:text-stone-600 select-none">
              √(w²+d²) + 2h &nbsp;÷&nbsp; √2
            </p>
          </div>
          <WrapDiagram className="w-16 h-16 shrink-0" />
        </div>

        <div className="mt-4 pt-4 border-t border-stone-100 dark:border-stone-800 flex justify-end">
          <button
            onClick={handlePrint}
            className="text-xs tracking-[0.15em] uppercase text-stone-400 dark:text-stone-500 hover:text-stone-700 dark:hover:text-stone-300 transition-colors select-none"
          >
            Print Card
          </button>
        </div>
      </div>
    </>
  );
}