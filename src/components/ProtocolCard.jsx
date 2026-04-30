import React from 'react';
import WrapDiagram from './WrapDiagram';

export default function ProtocolCard({ calculations, unit, dimensions }) {
  const unitLabel = unit === 'inches' ? 'in' : 'cm';

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      {/* Print styles — LPLWW-15: proper @media print implementation */}
      <style>{`
        @media print {
          /* Hide everything */
          body * { visibility: hidden !important; }

          /* Show only the card */
          .protocol-card-printable,
          .protocol-card-printable * {
            visibility: visible !important;
          }

          /* Position card to fill the page */
          .protocol-card-printable {
            position: fixed !important;
            inset: 0 !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            background: white !important;
            padding: 48px !important;
          }

          /* Override dark mode for print */
          .protocol-card-printable .print-card-inner {
            background: white !important;
            border: 1px solid #ccc !important;
            border-radius: 4px !important;
            padding: 32px !important;
            width: 320px !important;
            color: #1a1a18 !important;
          }

          /* Hide the print button itself */
          .protocol-card-print-btn {
            display: none !important;
          }

          /* Ensure amber values print in dark ink */
          .protocol-card-printable .print-value {
            color: #1a1a18 !important;
            font-weight: 600 !important;
          }

          .protocol-card-printable .print-label {
            color: #666 !important;
          }

          .protocol-card-printable .print-formula {
            color: #999 !important;
          }

          .protocol-card-printable .print-footer {
            color: #bbb !important;
          }
        }
      `}</style>

      <div className="protocol-card-printable border rounded p-5 mt-2"
        style={{borderColor: 'var(--border)'}}>
        <div className="print-card-inner">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <p className="text-[10px] tracking-[0.2em] uppercase mb-3 select-none print-label"
                style={{color: 'var(--text-muted)'}}>
                Field Record
              </p>
              <div className="font-mono text-sm space-y-1 mb-4">
                <div className="flex items-baseline gap-2">
                  <span className="text-xs select-none w-36 print-label"
                    style={{color: 'var(--text-muted)'}}>Square Side</span>
                  <span className="tabular-nums font-medium print-value"
                    style={{color: 'var(--amber-bright)'}}>{calculations?.paperSide}</span>
                  <span className="text-xs print-label"
                    style={{color: 'var(--text-muted)'}}>{unitLabel}</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-xs select-none w-36 print-label"
                    style={{color: 'var(--text-muted)'}}>Paper Diagonal</span>
                  <span className="tabular-nums print-value"
                    style={{color: 'var(--amber-bright)'}}>{calculations?.paperDiagonal}</span>
                  <span className="text-xs print-label"
                    style={{color: 'var(--text-muted)'}}>{unitLabel}</span>
                </div>
              </div>
              <p className="font-mono text-[10px] select-none print-formula"
                style={{color: 'var(--text-dim)'}}>
                (√(w²+d²) + 2h) ÷ √2
              </p>
            </div>
            <WrapDiagram className="w-16 h-16 shrink-0" />
          </div>

          <div className="mt-4 pt-4 flex items-center justify-between"
            style={{borderTop: '1px solid var(--border)'}}>
            <p className="text-[9px] font-mono select-none print-footer"
              style={{color: 'var(--text-dim)'}}>
              Lost Province Labs · Protocol WRP‑01
            </p>
            <button
              onClick={handlePrint}
              className="protocol-card-print-btn text-xs tracking-[0.15em] uppercase transition-colors select-none"
              style={{color: 'var(--amber-dim)'}}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--amber)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--amber-dim)'}
            >
              Print
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
