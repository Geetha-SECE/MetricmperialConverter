
const express = require('express');
const ConvertHandler = require('../controllers/convertHandler');

const router = express.Router();
const convertHandler = new ConvertHandler();

router.get('/convert', (req, res) => {
  const input = typeof req.query.input === 'string'
    ? req.query.input
    : '';

  const initNum = convertHandler.getNum(input);
  const initUnit = convertHandler.getUnit(input);

  const numInvalid = initNum === 'invalid';
  const unitInvalid = initUnit === 'invalid';

  if (numInvalid && unitInvalid) {
    return res.status(200).send('invalid number and unit');
  }

  if (numInvalid) {
    return res.status(200).send('invalid number');
  }

  if (unitInvalid) {
    return res.status(200).send('invalid unit');
  }

  const returnNum = convertHandler.convert(initNum, initUnit);
  const returnUnit = convertHandler.getReturnUnit(initUnit);

  const string = convertHandler.getString(
    initNum,
    initUnit,
    returnNum,
    returnUnit
  );

  return res.status(200).json({
    initNum,
    initUnit,
    returnNum,
    returnUnit,
    string
  });
});

module.exports = router;
