import React from 'react';
import WrapDiagram from './WrapDiagram';
import ReactDOMServer from 'react-dom/server';

export default function ProtocolCard({ calculations, unit }) {
  const unitLabel = unit === 'inches' ? 'in' : 'cm';

  const handlePrint = () => {
    // Render the diagram to an SVG string
    const diagramSvg = `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" width="80" height="80" style="opacity:0.4">
      <polygon points="60,4 116,60 60,116 4,60" fill="none" stroke="#555" stroke-width="0.8" stroke-dasharray="3 2"/>
      <rect x="38" y="42" width="44" height="36" fill="none" stroke="#333" stroke-width="1.2"/>
      <line x1="4" y1="60" x2="116" y2="60" stroke="#888" stroke-width="0.5" stroke-dasharray="2 3"/>
      <line x1="60" y1="4" x2="60" y2="116" stroke="#888" stroke-width="0.5" stroke-dasharray="2 3"/>
      <line x1="60" y1="4" x2="38" y2="42" stroke="#888" stroke-width="0.7"/>
      <line x1="116" y1="60" x2="82" y2="42" stroke="#888" stroke-width="0.7"/>
      <line x1="60" y1="116" x2="82" y2="78" stroke="#888" stroke-width="0.7"/>
      <line x1="4" y1="60" x2="38" y2="78" stroke="#888" stroke-width="0.7"/>
      <circle cx="60" cy="4" r="1.5" fill="#888"/>
      <circle cx="116" cy="60" r="1.5" fill="#888"/>
      <circle cx="60" cy="116" r="1.5" fill="#888"/>
      <circle cx="4" cy="60" r="1.5" fill="#888"/>
    </svg>`;

    const printWindow = window.open('', '_blank', 'width=600,height=400');
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <title>Field Record · Wrap Wrangler</title>
          <link href="https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Crimson+Pro:ital,wght@1,300&display=swap" rel="stylesheet">
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body {
              background: white;
              font-family: 'Space Mono', monospace;
              padding: 48px;
            }
            .card {
              border: 1px solid #ccc;
              border-radius: 4px;
              padding: 32px;
              max-width: 400px;
            }
            .card-body {
              display: flex;
              align-items: flex-start;
              justify-content: space-between;
              gap: 16px;
              margin-bottom: 20px;
            }
            .label {
              font-size: 9px;
              letter-spacing: 0.18em;
              text-transform: uppercase;
              color: #999;
              display: block;
              margin-bottom: 14px;
            }
            .row {
              display: flex;
              align-items: baseline;
              gap: 8px;
              margin-bottom: 6px;
            }
            .field-label {
              font-size: 10px;
              color: #999;
              width: 120px;
              flex-shrink: 0;
            }
            .value {
              font-size: 15px;
              font-weight: 700;
              color: #1a1a18;
            }
            .unit {
              font-size: 10px;
              color: #999;
            }
            .formula {
              font-size: 9px;
              color: #ccc;
              margin-top: 14px;
              display: block;
            }
            .divider {
              border: none;
              border-top: 1px solid #eee;
              margin: 16px 0;
            }
            .footer {
              font-size: 9px;
              color: #ccc;
              letter-spacing: 0.08em;
            }
            .rediscovered {
              font-family: 'Crimson Pro', Georgia, serif;
              font-style: italic;
              font-weight: 300;
              font-size: 11px;
              color: #ccc;
              float: right;
            }
          </style>
        </head>
        <body>
          <div class="card">
            <div class="card-body">
              <div>
                <span class="label">Field Record</span>
                <div class="row">
                  <span class="field-label">Square Side</span>
                  <span class="value">${calculations?.paperSide}</span>
                  <span class="unit">${unitLabel}</span>
                </div>
                <div class="row">
                  <span class="field-label">Paper Diagonal</span>
                  <span class="value">${calculations?.paperDiagonal}</span>
                  <span class="unit">${unitLabel}</span>
                </div>
                <span class="formula">(\u221a(w\u00b2+d\u00b2) + 2h) \u00f7 \u221a2</span>
              </div>
              ${diagramSvg}
            </div>
            <hr class="divider">
            <span class="footer">Lost Province Labs \u00b7 Protocol WRP\u201101</span>
            <span class="rediscovered">Rediscovered, not invented.</span>
          </div>
          <script>
            // Wait for fonts then print
            document.fonts.ready.then(() => {
              window.print();
              window.addEventListener('afterprint', () => window.close());
            });
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="border rounded p-5 mt-2" style={{borderColor: 'var(--border)'}}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <p className="text-[10px] tracking-[0.2em] uppercase mb-3 select-none"
            style={{color: 'var(--text-muted)'}}>
            Field Record
          </p>
          <div className="font-mono text-sm space-y-1 mb-4">
            <div className="flex items-baseline gap-2">
              <span className="text-xs select-none w-36" style={{color: 'var(--text-muted)'}}>Square Side</span>
              <span className="tabular-nums font-medium" style={{color: 'var(--amber-bright)'}}>{calculations?.paperSide}</span>
              <span className="text-xs" style={{color: 'var(--text-muted)'}}>{unitLabel}</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-xs select-none w-36" style={{color: 'var(--text-muted)'}}>Paper Diagonal</span>
              <span className="tabular-nums" style={{color: 'var(--amber-bright)'}}>{calculations?.paperDiagonal}</span>
              <span className="text-xs" style={{color: 'var(--text-muted)'}}>{unitLabel}</span>
            </div>
          </div>
          <p className="font-mono text-[10px] select-none" style={{color: 'var(--text-dim)'}}>
            (√(w²+d²) + 2h) ÷ √2
          </p>
        </div>
        <WrapDiagram className="w-16 h-16 shrink-0" />
      </div>

      <div className="mt-4 pt-4 flex items-center justify-between"
        style={{borderTop: '1px solid var(--border)'}}>
        <p className="text-[9px] font-mono select-none" style={{color: 'var(--text-dim)'}}>
          Lost Province Labs · Protocol WRP‑01
        </p>
        <button
          onClick={handlePrint}
          className="text-xs tracking-[0.15em] uppercase transition-colors select-none"
          style={{color: 'var(--amber-dim)'}}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--amber)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--amber-dim)'}
        >
          Print
        </button>
      </div>
    </div>
  );
}
