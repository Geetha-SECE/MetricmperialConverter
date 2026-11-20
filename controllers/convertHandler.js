const convertHandler = (input) => {
  if (!input || typeof input !== 'string') {
    return { initNum: 'invalid number', initUnit: 'invalid unit' };
  }

  const match = input.match(/[a-zA-Z]/);
  let numPart, unitPart;
  if (match) {
    numPart = input.slice(0, match.index);
    unitPart = input.slice(match.index);
  } else {
    numPart = input;
    unitPart = '';
  }

  const initNum = getNum(numPart);
  const initUnit = getUnit(unitPart);

  return { initNum, initUnit };
};

const getNum = (input) => {
  if (!input || input === '') {
    return 1;
  }

  if (input.includes('/')) {
    const parts = input.split('/');
    if (parts.length !== 2) {
      return 'invalid number';
    }
    const [numerator, denominator] = parts;
    if (numerator === '' || denominator === '') {
      return 'invalid number';
    }
    const num = Number(numerator);
    const den = Number(denominator);
    if (isNaN(num) || isNaN(den) || den === 0) {
      return 'invalid number';
    }
    // Check for extra dots in numerator or denominator
    if (numerator.split('.').length > 2 || denominator.split('.').length > 2) {
      return 'invalid number';
    }
    return num / den;
  }

  // Check for multiple dots or other invalid patterns
  if (input.split('.').length > 2) {
    return 'invalid number';
  }

  const num = Number(input);
  if (isNaN(num)) {
    return 'invalid number';
  }

  return num;
};

const getUnit = (input) => {
  if (!input || typeof input !== 'string') {
    return 'invalid unit';
  }

  const lower = input.toLowerCase();

  switch (lower) {
    case 'gal':
      return 'gal';
    case 'l':
      return 'L';
    case 'mi':
      return 'mi';
    case 'km':
      return 'km';
    case 'lbs':
      return 'lbs';
    case 'kg':
      return 'kg';
    default:
      return 'invalid unit';
  }
};

const getReturnUnit = (initUnit) => {
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

const spellOutUnit = (unit) => {
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

const convert = (initNum, initUnit) => {
  const conversionFactors = {
    'gal': 3.78541,
    'L': 1 / 3.78541,
    'mi': 1.60934,
    'km': 1 / 1.60934,
    'lbs': 0.453592,
    'kg': 1 / 0.453592
  };

  const factor = conversionFactors[initUnit];
  if (factor === undefined) {
    return NaN;
  }

  const result = initNum * factor;
  return Number(result.toFixed(5));
};

const getString = (initNum, initUnit, returnNum, returnUnit) => {
  return `${initNum} ${spellOutUnit(initUnit)} converts to ${returnNum} ${spellOutUnit(returnUnit)}`;
};

module.exports = {
  convertHandler,
  getNum,
  getUnit,
  getReturnUnit,
  spellOutUnit,
  convert,
  getString
};