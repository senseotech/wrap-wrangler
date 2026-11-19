import assert from 'node:assert/strict';
import test from 'node:test';
import { validateDimensions } from './measurements.js';

function withWidth(width) {
  return validateDimensions({ width, depth: '10', height: '2' }, 'inches');
}

test('accepts whole numbers and both decimal separators', () => {
  assert.equal(withWidth('10').measurements.width, 10);
  for (const width of ['1.5', '1,5', ' 1,5 ']) {
    const result = withWidth(width);
    assert.equal(result.measurements.width, 1.5);
    assert.equal(result.calculations.derivation.paperSide, withWidth('1.5').calculations.derivation.paperSide);
  }
  assert.equal(withWidth(',5').measurements.width, 0.5);
});

test('rejects invalid values in every dimension without keeping a result', () => {
  const valid = { width: '10', depth: '10', height: '2' };
  for (const field of Object.keys(valid)) {
    for (const value of ['-5', '0', '0,0', '1.2.3', '1,2.3', '1,2,3', '6 cm', '5 6', '5\n6', '1e3', 'Infinity', 'NaN']) {
      const result = validateDimensions({ ...valid, [field]: value }, 'inches');
      assert.ok(result.errors[field], `${field}: ${JSON.stringify(value)}`);
      assert.equal(result.calculations, null);
    }
  }
});

test('leaves empty and unfinished decimals pending without calculating', () => {
  for (const edit of ['', ' ', '.', ',', '1.', '1,', '0.']) {
    const result = withWidth(edit);
    assert.equal(result.errors.width, undefined);
    assert.deepEqual(result.incomplete, ['width']);
    assert.equal(result.calculations, null);
  }
});

test('rejects out-of-range input and overflow in result calculations', () => {
  const tooLargeToParse = withWidth('9'.repeat(309));
  assert.ok(tooLargeToParse.errors.width);
  assert.equal(tooLargeToParse.calculations, null);
  for (const result of [
    withWidth('9'.repeat(155)),
    validateDimensions({ width: '1', depth: '1', height: '9'.repeat(308) }, 'cm'),
    validateDimensions({ width: '1', depth: '1', height: '5' + '0'.repeat(307) }, 'inches')
  ]) {
    assert.equal(result.overflow, true);
    assert.equal(result.calculations, null);
  }
});

for (const unit of ['inches', 'cm']) {
  test(`rounds up to the nearest tenth in ${unit} and converts the raw lengths`, () => {
    const { calculations } = validateDimensions({ width: '10', depth: '10', height: '2' }, unit);
    const expected = unit === 'inches'
      ? { paperSide: 32.6, paperDiagonal: 46.1 }
      : { paperSide: 5.1, paperDiagonal: 7.2 };
    assert.equal(calculations.paperSide, 12.9);
    assert.equal(calculations.paperDiagonal, 18.2);
    assert.deepEqual(calculations.alternate, expected);
    assert.equal(calculations.derivation.paperDiagonal, Math.sqrt(200) + 4);
    assert.equal(calculations.derivation.paperSide, (Math.sqrt(200) + 4) / Math.SQRT2);
  });

  test(`keeps exact tenths and rounds just-over boundaries in ${unit}`, () => {
    const calculate = height => validateDimensions({ width: '3', depth: '4', height }, unit).calculations;

    assert.equal(calculate('2').paperDiagonal, 9);
    assert.equal(calculate('2.000000000000001').paperDiagonal, 9.1);
    assert.equal(calculate('1.1062445840513924').paperSide, 5.1);
    assert.equal(calculate('1.1062445841513924').paperSide, 5.2);

    const [exact, justOver, alternateDiagonal] = unit === 'inches'
      ? ['2.5', '2.500000000000001', 25.4]
      : ['10.2', '10.200000000000003', 10];
    assert.equal(calculate(exact).alternate.paperDiagonal, alternateDiagonal);
    assert.equal(calculate(justOver).alternate.paperDiagonal, alternateDiagonal + 0.1);
  });
}

test('handles the smallest positive measurements and large finite recommendations', () => {
  const tiny = '0.' + '0'.repeat(323) + '5';
  const tinyResult = validateDimensions({ width: tiny, depth: tiny, height: tiny }, 'cm').calculations;
  assert.equal(tinyResult.paperSide, 0.1);
  assert.equal(tinyResult.alternate.paperSide, 0.1);

  const large = validateDimensions({ width: '1', depth: '1', height: '1' + '0'.repeat(307) }, 'inches').calculations;
  assert.ok(Number.isFinite(large.paperDiagonal));
  assert.ok(Number.isFinite(large.alternate.paperDiagonal));
});
