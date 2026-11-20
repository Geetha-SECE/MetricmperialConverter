const express = require('express');
const router = express.Router();
const convertHandler = require('../controllers/convertHandler').convertHandler;

router.get('/convert', (req, res) => {
  const { input } = req.query;
  const { initNum, initUnit } = convertHandler(input);

  if (initNum === 'invalid number' && initUnit === 'invalid unit') {
    return res.status(200).send('invalid number and unit');
  }
  if (initNum === 'invalid number') {
    return res.status(200).send('invalid number');
  }
  if (initUnit === 'invalid unit') {
    return res.status(200).send('invalid unit');
  }

  const returnUnit = require('../controllers/convertHandler').getReturnUnit(initUnit);
  const returnNum = require('../controllers/convertHandler').convert(initNum, initUnit);
  const string = require('../controllers/convertHandler').getString(initNum, initUnit, returnNum, returnUnit);

  res.status(200).json({
    initNum,
    initUnit,
    returnNum,
    returnUnit,
    string
  });
});

module.exports = router;