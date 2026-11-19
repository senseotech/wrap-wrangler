function parseDimension(input) {
  const text = input.trim();

  // A separator without fractional digits is still being edited.
  if (!text || /^\d*[.,]$/.test(text)) return {};
  if (/^-/.test(text)) return { error: 'Enter a value greater than zero.' };
  if (!/^(?:\d+|\d*[.,]\d+)$/.test(text)) {
    return { error: 'Enter a number with one decimal dot or comma.' };
  }

  const value = Number(text.replace(',', '.'));
  if (!Number.isFinite(value)) return { error: 'This measurement is too large.' };
  if (value === 0) return { error: 'Enter a value greater than zero.' };

  return { value };
}

function roundCuttingLength(length) {
  // Scale only the fraction so large finite lengths cannot overflow here.
  const whole = Math.floor(length);
  const tenths = Math.floor((length - whole) * 10);
  const boundary = whole + tenths / 10;

  // Compare in the original unit to distinguish exact and just-over tenths.
  if (boundary >= length && boundary > 0) return boundary;
  return whole + (tenths + 1) / 10;
}

export function validateDimensions({ width, depth, height }, unit) {
  const w = parseDimension(width);
  const d = parseDimension(depth);
  const h = parseDimension(height);
  const errors = { width: w.error, depth: d.error, height: h.error };
  const parsed = { width: w, depth: d, height: h };
  const incomplete = Object.keys(parsed).filter(field => parsed[field].value === undefined && !errors[field]);

  if (incomplete.length || Object.values(errors).some(Boolean)) {
    return { errors, incomplete, calculations: null };
  }

  const baseDiagonal = Math.sqrt(w.value * w.value + d.value * d.value);
  const heightAllowance = 2 * h.value;
  const paperDiagonal = baseDiagonal + heightAllowance;
  const paperSide = paperDiagonal / Math.sqrt(2);

  const toAlternateUnit = unit === 'inches' ? value => value * 2.54 : value => value / 2.54;
  const alternateDiagonal = toAlternateUnit(paperDiagonal);

  if (!Number.isFinite(paperDiagonal) || !Number.isFinite(alternateDiagonal)) {
    return { errors, incomplete, overflow: true, calculations: null };
  }

  return {
    errors,
    incomplete,
    measurements: { width: w.value, depth: d.value, height: h.value },
    calculations: {
      paperSide: roundCuttingLength(paperSide),
      paperDiagonal: roundCuttingLength(paperDiagonal),
      alternate: {
        paperSide: roundCuttingLength(toAlternateUnit(paperSide)),
        paperDiagonal: roundCuttingLength(alternateDiagonal)
      },
      derivation: { baseDiagonal, heightAllowance, paperDiagonal, paperSide }
    }
  };
}
