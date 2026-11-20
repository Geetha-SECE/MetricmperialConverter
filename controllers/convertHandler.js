'use strict';

function ConvertHandler() {

  this.getNum = function (input) {
    if (!input) return 1;

    // The number is everything before the first letter.
    let match = input.match(/[a-zA-Z]/);
    let numPart = match ? input.slice(0, match.index) : input;
    if (numPart === '') return 1;

    // Fractional input, e.g. "1/2" or "5.4/3.2"
    if (numPart.indexOf('/') !== -1) {
      let parts = numPart.split('/');
      if (parts.length !== 2) return 'invalid number';
      let numerator = parts[0];
      let denominator = parts[1];
      if (numerator === '' || denominator === '') return 'invalid number';
      // Reject things like "1.2.3"
      if (numerator.split('.').length > 2 || denominator.split('.').length > 2) {
        return 'invalid number';
      }
      let num = Number(numerator);
      let den = Number(denominator);
      if (isNaN(num) || isNaN(den) || den === 0) return 'invalid number';
      return num / den;
    }

    // Decimal or whole number
    if (numPart.split('.').length > 2) return 'invalid number';
    let num = Number(numPart);
    if (isNaN(num)) return 'invalid number';
    return num;
  };

  this.getUnit = function (input) {
    if (!input || typeof input !== 'string') return 'invalid unit';

    let match = input.match(/[a-zA-Z]/);
    let unitPart = match ? input.slice(match.index) : '';
    let lower = unitPart.toLowerCase();

    switch (lower) {
      case 'gal': return 'gal';
      case 'l': return 'L';
      case 'mi': return 'mi';
      case 'km': return 'km';
      case 'lbs': return 'lbs';
      case 'kg': return 'kg';
      default: return 'invalid unit';
    }
  };

  this.getReturnUnit = function (initUnit) {
    const unitMap = {
      'gal': 'L',
      'L': 'gal',
      'mi': 'km',
      'km': 'mi',
      'lbs': 'kg',
      'kg': 'lbs'
    };
    return unitMap[initUnit];
  };

  this.spellOutUnit = function (unit) {
    const unitMap = {
      'gal': 'gallons',
      'L': 'liters',
      'mi': 'miles',
      'km': 'kilometers',
      'lbs': 'pounds',
      'kg': 'kilograms'
    };
    return unitMap[unit];
  };

  this.convert = function (initNum, initUnit) {
    const galToL = 3.78541;
    const lbsToKg = 0.453592;
    const miToKm = 1.60934;
    let result;
    switch (initUnit) {
      case 'gal': result = initNum * galToL; break;
      case 'L': result = initNum / galToL; break;
      case 'lbs': result = initNum * lbsToKg; break;
      case 'kg': result = initNum / lbsToKg; break;
      case 'mi': result = initNum * miToKm; break;
      case 'km': result = initNum / miToKm; break;
      default: return 'invalid unit';
    }
    // Round to 5 decimals as required by the user stories.
    return Number(result.toFixed(5));
  };

  this.getString = function (initNum, initUnit, returnNum, returnUnit) {
    return initNum + ' ' + this.spellOutUnit(initUnit) +
      ' converts to ' + returnNum + ' ' + this.spellOutUnit(returnUnit);
  };

}

module.exports = ConvertHandler;