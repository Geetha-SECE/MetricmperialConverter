'use strict';
// Temporary fCC-grader simulation. Boots the app on a test port, runs every
// check the freeCodeCamp grader performs, prints PASS/FAIL, then exits.
process.env.NODE_ENV = 'test';
const http = require('http');
const app = require('./server');

const PORT = 3100;
let pass = 0, fail = 0;
function ok(name, cond, extra) {
  if (cond) { pass++; console.log('PASS ' + name); }
  else { fail++; console.log('FAIL ' + name + (extra ? '  => ' + extra : '')); }
}

function req(path) {
  return new Promise((resolve) => {
    const r = http.request({ host: '127.0.0.1', port: PORT, path: path, method: 'GET' }, (res) => {
      let data = '';
      res.on('data', (c) => data += c);
      res.on('end', () => {
        let json = null;
        try { json = JSON.parse(data); } catch (e) {}
        resolve({ status: res.statusCode, headers: res.headers, text: data, json: json });
      });
    });
    r.on('error', () => resolve({ status: 0, headers: {}, text: '', json: null }));
    r.end();
  });
}

const server = app.listen(PORT, async () => {
  try {
    // Test 2: valid input
    let r = await req('/api/convert?input=10L');
    ok('T2 valid 10L status', r.status === 200, r.status);
    ok('T2 initNum', r.json && r.json.initNum === 10, JSON.stringify(r.json));
    ok('T2 initUnit', r.json && r.json.initUnit === 'L', r.json && r.json.initUnit);
    ok('T2 returnNum~2.64172', r.json && Math.abs(r.json.returnNum - 2.64172) < 0.00001, r.json && r.json.returnNum);
    ok('T2 returnUnit gal', r.json && r.json.returnUnit === 'gal', r.json && r.json.returnUnit);

    // Test 3: gal <-> L
    r = await req('/api/convert?input=1gal');
    ok('T3 1gal initUnit', r.json && r.json.initUnit === 'gal', r.json && r.json.initUnit);
    ok('T3 1gal returnUnit L', r.json && r.json.returnUnit === 'L', r.json && r.json.returnUnit);
    ok('T3 1gal returnNum~3.78541', r.json && Math.abs(r.json.returnNum - 3.78541) < 0.00001, r.json && r.json.returnNum);
    r = await req('/api/convert?input=1L');
    ok('T3 1L returnUnit gal', r.json && r.json.returnUnit === 'gal', r.json && r.json.returnUnit);
    ok('T3 1L returnNum~0.26417', r.json && Math.abs(r.json.returnNum - 0.26417) < 0.00001, r.json && r.json.returnNum);

    // Test 4: lbs <-> kg
    r = await req('/api/convert?input=1lbs');
    ok('T4 1lbs returnUnit kg', r.json && r.json.returnUnit === 'kg', r.json && r.json.returnUnit);
    ok('T4 1lbs returnNum~0.45359', r.json && Math.abs(r.json.returnNum - 0.45359) < 0.00001, r.json && r.json.returnNum);
    r = await req('/api/convert?input=1kg');
    ok('T4 1kg returnUnit lbs', r.json && r.json.returnUnit === 'lbs', r.json && r.json.returnUnit);
    ok('T4 1kg returnNum~2.20462', r.json && Math.abs(r.json.returnNum - 2.20462) < 0.00001, r.json && r.json.returnNum);

    // Test 5: mi <-> km
    r = await req('/api/convert?input=1mi');
    ok('T5 1mi returnUnit km', r.json && r.json.returnUnit === 'km', r.json && r.json.returnUnit);
    ok('T5 1mi returnNum~1.60934', r.json && Math.abs(r.json.returnNum - 1.60934) < 0.00001, r.json && r.json.returnNum);
    r = await req('/api/convert?input=1km');
    ok('T5 1km returnUnit mi', r.json && r.json.returnUnit === 'mi', r.json && r.json.returnUnit);
    ok('T5 1km returnNum~0.62137', r.json && Math.abs(r.json.returnNum - 0.62137) < 0.00001, r.json && r.json.returnNum);

    // Test 6: case handling
    r = await req('/api/convert?input=1GAL');
    ok('T6 1GAL initUnit gal', r.json && r.json.initUnit === 'gal', r.json && r.json.initUnit);
    ok('T6 1GAL returnUnit L', r.json && r.json.returnUnit === 'L', r.json && r.json.returnUnit);
    r = await req('/api/convert?input=1L');
    ok('T6 1L initUnit L', r.json && r.json.initUnit === 'L', r.json && r.json.initUnit);
    r = await req('/api/convert?input=1MI');
    ok('T6 1MI initUnit mi', r.json && r.json.initUnit === 'mi', r.json && r.json.initUnit);

    // Test 7: invalid unit
    r = await req('/api/convert?input=32g');
    ok('T7 invalid unit text', r.text === 'invalid unit', JSON.stringify(r.text));

    // Test 8: invalid number
    r = await req('/api/convert?input=3/7.2/4kg');
    ok('T8 invalid number text', r.text === 'invalid number', JSON.stringify(r.text));

    // Test 9: both invalid
    r = await req('/api/convert?input=3/7.2/4kilomegagram');
    ok('T9 invalid number and unit text', r.text === 'invalid number and unit', JSON.stringify(r.text));

    // Test 10: fractions/decimals/default
    r = await req('/api/convert?input=1/2km');
    ok('T10 1/2 initNum 0.5', r.json && r.json.initNum === 0.5, r.json && r.json.initNum);
    r = await req('/api/convert?input=5.4/3.2km');
    ok('T10 5.4/3.2 initNum~1.6875', r.json && Math.abs(r.json.initNum - 1.6875) < 0.00001, r.json && r.json.initNum);
    r = await req('/api/convert?input=kg');
    ok('T10 kg initNum 1', r.json && r.json.initNum === 1, r.json && r.json.initNum);

    // Test 11: return structure + string
    r = await req('/api/convert?input=10L');
    ok('T11 has all keys', r.json && ['initNum','initUnit','returnNum','returnUnit','string'].every(k => k in r.json), JSON.stringify(r.json));
    ok('T11 string format', r.json && r.json.string === '10 liters converts to 2.64172 gallons', r.json && r.json.string);
    ok('T11 returnNum rounded 5', r.json && r.json.returnNum === Number(r.json.returnNum.toFixed(5)), r.json && r.json.returnNum);

    // Test 12/13: get-tests
    r = await req('/_api/get-tests?type=unit');
    const unit = Array.isArray(r.json) ? r.json : (r.json && r.json.length === undefined ? [] : []);
    ok('T12 unit tests >=16', Array.isArray(r.json) && r.json.length >= 16, 'len=' + (Array.isArray(r.json) ? r.json.length : 'n/a'));
    ok('T12 unit all passed', Array.isArray(r.json) && r.json.every(t => t.state === 'passed'), Array.isArray(r.json) ? r.json.filter(t=>t.state!=='passed').length + ' not passed' : 'n/a');
    r = await req('/_api/get-tests?type=functional');
    ok('T13 functional tests >=5', Array.isArray(r.json) && r.json.length >= 5, 'len=' + (Array.isArray(r.json) ? r.json.length : 'n/a'));
    ok('T13 functional all passed', Array.isArray(r.json) && r.json.every(t => t.state === 'passed'), Array.isArray(r.json) ? r.json.filter(t=>t.state!=='passed').length + ' not passed' : 'n/a');

    // Security headers
    r = await req('/');
    ok('SEC noSniff', r.headers['x-content-type-options'] === 'nosniff', r.headers['x-content-type-options']);
    ok('SEC xss', !!r.headers['x-xss-protection'], r.headers['x-xss-protection']);

    console.log('\n==== RESULT: ' + pass + ' passed, ' + fail + ' failed ====');
  } catch (e) {
    console.log('SCRIPT ERROR: ' + e.stack);
  } finally {
    server.close(() => process.exit(fail === 0 ? 0 : 1));
  }
});