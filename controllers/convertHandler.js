
class ConvertHandler {
  constructor() {
    this.units = {
      gal: { name: 'gallons', returnUnit: 'L', factor: 3.78541 },
      L: { name: 'liters', returnUnit: 'gal', factor: 1 / 3.78541 },
      mi: { name: 'miles', returnUnit: 'km', factor: 1.60934 },
      km: { name: 'kilometers', returnUnit: 'mi', factor: 1 / 1.60934 },
      lbs: { name: 'pounds', returnUnit: 'kg', factor: 0.453592 },
      kg: { name: 'kilograms', returnUnit: 'lbs', factor: 1 / 0.453592 }
    };
  }

  getNum(input) {
    const index = input.search(/[a-zA-Z]/);
    const numString = index === -1 ? input : input.slice(0, index);

    if (numString === '') return 1;

    const numberPattern =
      /^(?:\d+(?:\.\d*)?|\.\d+)(?:\/(?:\d+(?:\.\d*)?|\.\d+))?$/;

    if (!numberPattern.test(numString)) return 'invalid';

    if (numString.includes('/')) {
      const parts = numString.split('/');
      const numerator = Number(parts[0]);
      const denominator = Number(parts[1]);

      if (denominator === 0) return 'invalid';

      return numerator / denominator;
    }

    return Number(numString);
  }

  getUnit(input) {
    const index = input.search(/[a-zA-Z]/);

    if (index === -1) return 'invalid';

    const unit = input.slice(index).toLowerCase();

    if (unit === 'l') return 'L';

    return this.units[unit] ? unit : 'invalid';
  }

  getReturnUnit(initUnit) {
    const unit = initUnit.toLowerCase() === 'l'
      ? 'L'
      : initUnit.toLowerCase();

    return this.units[unit]
      ? this.units[unit].returnUnit
      : 'invalid';
  }

  spellOutUnit(unit) {
    const normalized = unit.toLowerCase() === 'l'
      ? 'L'
      : unit.toLowerCase();

    return this.units[normalized]
      ? this.units[normalized].name
      : '';
  }

  convert(initNum, initUnit) {
    const normalized = initUnit.toLowerCase() === 'l'
      ? 'L'
      : initUnit.toLowerCase();

    if (!this.units[normalized]) return 'invalid';

    const result = initNum * this.units[normalized].factor;

    return Number(result.toFixed(5));
  }

  getString(initNum, initUnit, returnNum, returnUnit) {
    return `${initNum} ${this.spellOutUnit(initUnit)} converts to ${returnNum} ${this.spellOutUnit(returnUnit)}`;
  }
}

module.exports = ConvertHandler;
