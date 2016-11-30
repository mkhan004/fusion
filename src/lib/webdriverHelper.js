'use strict';

const setupData = `
'use strict';\n
const should = require('should');
const test = require('selenium-webdriver/testing');
const webdriver = require('selenium-webdriver');
const By = webdriver.By;
const until = webdriver.until;

const expect = require('chai').expect;`;

let id;
let request;
let testFeature;
let finalTestSuite = '';
let browser;
let description;

exports.setRequestProperties = (currentRequest) => {
  return new Promise(function setRequestProperties(resolve, reject) {
    try {
      request = currentRequest;
      testFeature = request.config.feature;
      browser = request.config.browser;
      id = request.req.id;

      if (request.req.annotation === 'test') {
        description = request.req.description;
      }

      resolve(true);
    } catch (err) {
      reject(err);
    }
  });
};

exports.suiteSetup = () => {
  return new Promise(function suiteSetup(resolve) {
    finalTestSuite += setupData;
    resolve(finalTestSuite);
  });
};

exports.setDriver = () => {
  return new Promise(function setDriver(resolve) {
    let driverData = `
    \nlet driver = new webdriver.Builder()
    .forBrowser('${browser}')
    .usingServer('http://localhost:4444/wd/hub')
    .build();\n\n`;
    finalTestSuite += driverData;
    resolve(finalTestSuite);
  });
};

exports.startScenario = () => {
  return new Promise(function startScenario(resolve) {
    let data = `test.describe('${testFeature}', function () {\n`;
    finalTestSuite += data;
    resolve(finalTestSuite);
  });
};

exports.endScenario = () => {
  return new Promise(function endScenario(resolve) {
    let data = `});\n`;
    finalTestSuite += data;
    resolve(finalTestSuite);
  });
};

exports.startBeforeTest = () => {
  return new Promise(function startBeforeTest(resolve) {
    let data = `  test.before(function * () {\n`;
    finalTestSuite += data;
    resolve(finalTestSuite);
  });
};

exports.endBeforeTest = () => {
  return new Promise(function endBeforeTest(resolve) {
    let data = `  });\n`;
    finalTestSuite += data;
    resolve(finalTestSuite);
  });
};

exports.startAfterTest = () => {
  return new Promise(function startAfterTest(resolve) {
    let data = `\n  test.after(function * () {\n`;
    finalTestSuite += data;
    resolve(finalTestSuite);
  });
};

exports.endAfterTest = () => {
  return new Promise(function endAfterTest(resolve) {
    let data = `  });\n`;
    finalTestSuite += data;
    resolve(finalTestSuite);
  });
};

exports.startTest = () => {
  return new Promise(function startTest(resolve) {
    let data = `\n  test.it('${id}) ${description}', function * () {\n`;
    finalTestSuite += data;
    resolve(finalTestSuite);
  });
};

exports.endTest = () => {
  return new Promise(function endTest(resolve) {
    let data = `  });\n`;
    finalTestSuite += data;
    resolve(finalTestSuite);
  });
};

exports.getFinalTestSuite = () => {
  return new Promise(function getFinalTestSuite(resolve) {
    resolve(finalTestSuite);
  });
};

exports.sendKeys = (element, value) => {
  return new Promise(function sendKeys(resolve) {
    let data = `    yield ${element}.sendKeys('${value}');\n`;
    finalTestSuite += data;
    resolve(finalTestSuite);
  });
};

exports.click = (element) => {
  return new Promise(function click(resolve) {
    let data = `    yield ${element}.click();\n`;
    finalTestSuite += data;
    resolve(finalTestSuite);
  });
};

exports.get = () => {
  return new Promise(function get(resolve) {
    let baseUrl = request.config.url;
    let data = `    yield driver.get('${baseUrl}');\n`;
    finalTestSuite += data;
    resolve(finalTestSuite);
  });
};

exports.quit = () => {
  return new Promise(function quit(resolve) {
    let data = `    yield driver.quit();\n`;
    finalTestSuite += data;
    resolve(finalTestSuite);
  });
};

exports.timeout = (time) => {
  return new Promise(function timeout(resolve) {
    let data = `    this.timeout(${time});\n`;
    finalTestSuite += data;
    resolve(finalTestSuite);
  });
};

exports.getTitle = (key) => {
  return new Promise(function getTitle(resolve) {
    let data = `    let ${key} = yield driver.getTitle();\n`;
    finalTestSuite += data;
    resolve(finalTestSuite);
  });
};

exports.getCurrentUrl = (key) => {
  return new Promise(function getCurrentUrl(resolve) {
    let data = `    let ${key} = yield driver.getCurrentUrl();\n`;
    finalTestSuite += data;
    resolve(finalTestSuite);
  });
};

exports.contains = (key, value) => {
  return new Promise(function contains(resolve) {
    let data = `    expect(${key}).to.contain('${value}');\n`;
    finalTestSuite += data;
    resolve(finalTestSuite);
  });
};

exports.equals = (key, value) => {
  return new Promise(function equals(resolve) {
    let data = `    expect(${key}).to.equal('${value}');\n`;
    finalTestSuite += data;
    resolve(finalTestSuite);
  });
};
