const chai = require('chai');
const assert = chai.assert;
const ConvertHandler = require('../controllers/convertHandler.js');

let convertHandler;

suite('Unit Tests', () => {
  suiteSetup(() => {
    convertHandler = ConvertHandler;
  });

  test('convertHandler should correctly read a whole number input', (done) => {
    const result = convertHandler.convertHandler('32kg');
    assert.equal(result.initNum, 32);
    done();
  });

  test('convertHandler should correctly read a decimal number input', (done) => {
    const result = convertHandler.convertHandler('32.5kg');
    assert.equal(result.initNum, 32.5);
    done();
  });

  test('convertHandler should correctly read a fractional input', (done) => {
    const result = convertHandler.convertHandler('1/2kg');
    assert.equal(result.initNum, 0.5);
    done();
  });

  test('convertHandler should correctly read a fractional input with a decimal', (done) => {
    const result = convertHandler.convertHandler('5.4/3.2kg');
    assert.approximately(result.initNum, 1.6875, 0.00001);
    done();
  });

  test('convertHandler should correctly return an error on a double-fraction (i.e. 3/2/3)', (done) => {
    const result = convertHandler.convertHandler('3/2/3kg');
    assert.equal(result.initNum, 'invalid number');
    done();
  });

  test('convertHandler should correctly default to a numerical input of 1 when no numerical input is provided', (done) => {
    const result = convertHandler.convertHandler('kg');
    assert.equal(result.initNum, 1);
    done();
  });

  test('convertHandler should correctly read each valid input unit', (done) => {
    const units = ['gal', 'l', 'mi', 'km', 'lbs', 'kg'];
    units.forEach((unit) => {
      const result = convertHandler.convertHandler('1' + unit);
      assert.notEqual(result.initUnit, 'invalid unit');
    });
    done();
  });

  test('convertHandler should correctly return an error for an invalid input unit', (done) => {
    const result = convertHandler.convertHandler('1kilomegagram');
    assert.equal(result.initUnit, 'invalid unit');
    done();
  });

  test('convertHandler should return the correct return unit for each valid input unit', (done) => {
    const unitMap = {
      gal: 'L',
      L: 'gal',
      mi: 'km',
      km: 'mi',
      lbs: 'kg',
      kg: 'lbs'
    };
    Object.keys(unitMap).forEach((unit) => {
      assert.equal(convertHandler.getReturnUnit(unit), unitMap[unit]);
    });
    done();
  });

  test('convertHandler should correctly return the spelled-out string unit for each valid input unit', (done) => {
    const unitMap = {
      gal: 'gallons',
      L: 'liters',
      mi: 'miles',
      km: 'kilometers',
      lbs: 'pounds',
      kg: 'kilograms'
    };
    Object.keys(unitMap).forEach((unit) => {
      assert.equal(convertHandler.spellOutUnit(unit), unitMap[unit]);
    });
    done();
  });

  test('convertHandler should correctly convert gal to L', (done) => {
    const result = convertHandler.convert(1, 'gal');
    assert.approximately(result, 3.78541, 0.00001);
    done();
  });

  test('convertHandler should correctly convert L to gal', (done) => {
    const result = convertHandler.convert(1, 'L');
    assert.approximately(result, 0.26417, 0.00001);
    done();
  });

  test('convertHandler should correctly convert mi to km', (done) => {
    const result = convertHandler.convert(1, 'mi');
    assert.approximately(result, 1.60934, 0.00001);
    done();
  });

  test('convertHandler should correctly convert km to mi', (done) => {
    const result = convertHandler.convert(1, 'km');
    assert.approximately(result, 0.62137, 0.00001);
    done();
  });

  test('convertHandler should correctly convert lbs to kg', (done) => {
    const result = convertHandler.convert(1, 'lbs');
    assert.approximately(result, 0.45359, 0.00001);
    done();
  });

  test('convertHandler should correctly convert kg to lbs', (done) => {
    const result = convertHandler.convert(1, 'kg');
    assert.approximately(result, 2.20462, 0.00001);
    done();
  });
});