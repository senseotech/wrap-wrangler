import React from 'react';
import WrapDiagram from './WrapDiagram';

/**
 * Generates the print-window SVG string using the same geometry as WrapDiagram.
 * If WrapDiagram's layout logic changes, keep this in sync.
 */
function buildPrintDiagramSvg(dimensions) {
  const w = parseFloat(dimensions?.width) || 0;
  const d = parseFloat(dimensions?.depth) || 0;
  const hasValidDims = w > 0 && d > 0;

  const CENTER = 60;
  const MAX_HALF = 54;

  let boxW, boxH, diamondHalf;

  if (hasValidDims) {
    const aspect = d / w;
    const maxBoxHalf = MAX_HALF * 0.52;
    if (w >= d) {
      boxW = maxBoxHalf * 2;
      boxH = boxW * aspect;
    } else {
      boxH = maxBoxHalf * 2;
      boxW = boxH / aspect;
    }
    const boxDiagHalf = Math.sqrt((boxW / 2) ** 2 + (boxH / 2) ** 2);
    diamondHalf = Math.min(boxDiagHalf + MAX_HALF * 0.38, MAX_HALF);
  } else {
    boxW = 44;
    boxH = 36;
    diamondHalf = MAX_HALF;
  }

  const halfW = boxW / 2;
  const halfH = boxH / 2;
  const boxLeft   = CENTER - halfW;
  const boxRight  = CENTER + halfW;
  const boxTop    = CENTER - halfH;
  const boxBottom = CENTER + halfH;

  const dN = [CENTER,               CENTER - diamondHalf];
  const dE = [CENTER + diamondHalf, CENTER              ];
  const dS = [CENTER,               CENTER + diamondHalf];
  const dW = [CENTER - diamondHalf, CENTER              ];

  const pt = (p) => `${p[0]},${p[1]}`;
  const ln = (x1, y1, x2, y2, sw = '0.7') =>
    `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#888" stroke-width="${sw}"/>`;

  return `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" width="80" height="80" style="opacity:0.4">
    <polygon points="${pt(dN)} ${pt(dE)} ${pt(dS)} ${pt(dW)}" fill="none" stroke="#555" stroke-width="0.8" stroke-dasharray="3 2"/>
    <rect x="${boxLeft}" y="${boxTop}" width="${boxW}" height="${boxH}" fill="none" stroke="#333" stroke-width="1.2"/>
    ${ln(dW[0], dW[1], dE[0], dE[1], '0.5')}
    ${ln(dN[0], dN[1], dS[0], dS[1], '0.5')}
    ${ln(dN[0], dN[1], boxLeft,  boxTop)}
    ${ln(dN[0], dN[1], boxRight, boxTop)}
    ${ln(dE[0], dE[1], boxRight, boxTop)}
    ${ln(dE[0], dE[1], boxRight, boxBottom)}
    ${ln(dS[0], dS[1], boxRight, boxBottom)}
    ${ln(dS[0], dS[1], boxLeft,  boxBottom)}
    ${ln(dW[0], dW[1], boxLeft,  boxBottom)}
    ${ln(dW[0], dW[1], boxLeft,  boxTop)}
    <circle cx="${dN[0]}" cy="${dN[1]}" r="1.5" fill="#888"/>
    <circle cx="${dE[0]}" cy="${dE[1]}" r="1.5" fill="#888"/>
    <circle cx="${dS[0]}" cy="${dS[1]}" r="1.5" fill="#888"/>
    <circle cx="${dW[0]}" cy="${dW[1]}" r="1.5" fill="#888"/>
  </svg>`;
}

export default function ProtocolCard({ calculations, unit, dimensions }) {
  const unitLabel = unit === 'inches' ? 'in' : 'cm';

  const handlePrint = () => {
    const diagramSvg = buildPrintDiagramSvg(dimensions);

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
                <span class="formula">(√(w²+d²) + 2h) ÷ √2</span>
              </div>
              ${diagramSvg}
            </div>
            <hr class="divider">
            <span class="footer">Lost Province Labs · Protocol WRP‑01</span>
            <span class="rediscovered">Rediscovered, not invented.</span>
          </div>
          <script>
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
        <WrapDiagram dimensions={dimensions} calculations={calculations} className="w-16 h-16 shrink-0" />
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
