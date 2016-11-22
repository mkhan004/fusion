'use strict';

const webdriver = require('selenium-webdriver');
const By = webdriver.By;
const utils = require('./utils');

let driver;
let request = '';
let elementFile = '';

module.exports.setCurrentRequest = (currentRequest) => {
  return new Promise((resolve, reject) => {
    request = currentRequest;
    resolve(request);
  });
};

module.exports.setDriver = () => {
  return new Promise((resolve, reject) => {
  if (request.req.annotation === 'setup') {
    elementFile = request.req.feature;
    driver = new webdriver
      .Builder()
      .forBrowser(request.config.browser)
      .usingServer('http://localhost:4444/wd/hub')
      .build();
  }
    resolve(driver);
  });
};

module.exports.navigate = () => {
  return new Promise((resolve, reject) => {
    driver.get(request.fullUrl);
    resolve(driver);
  });
};

module.exports.getDriver = () => {
  return new Promise((resolve, reject) => {
    resolve(driver);
  });
};

module.exports.processSendKeys = () => {
  return new Promise((resolve, reject) => {
    if (request.req.hasOwnProperty('driverActions')) {
      if (request.req.driverActions.hasOwnProperty('sendKeys')) {
        let sendKeys = request.req.driverActions.sendKeys;
        for (let key in sendKeys) {
          if (sendKeys.hasOwnProperty(key)) {
            this.sendKeys(key, sendKeys[key]);
          }
        }
      }
    }
  });
};

module.exports.processClicks = () => {
  if (request.req.hasOwnProperty('driverActions')) {
    if (request.req.driverActions.hasOwnProperty('click')) {
      let clicks = request.req.driverActions.click;
      for (let key in clicks) {
        if (clicks.hasOwnProperty(key)) {
          this.click(clicks[key]);
        }
      }
    }
  }
};

module.exports.sendKeys = (customVariable, data) => {
  let webElement = this.getWebElement(customVariable);
  webElement.clear();
  webElement.sendKeys(data);
};

module.exports.click = (customVariable) => {
  let webElement = this.getWebElement(customVariable);
  webElement.click();
};

module.exports.getWebElement = (customVariable) => {
  let elements = utils.loadYAMLOrParse(
    request.config.basePath, 'elements/' + elementFile + '.yaml')[0];
  if (elements.By.name[customVariable]) {
    return driver.findElement(By.name(elements.By.name[customVariable]));
  } else {
    let err = `By type locator '${customVariable}' is not found in ${elementFile}.yaml`;
    console.log(new Error(err));
    process.exit(1);
  }
};

module.exports.tearDown = () => {
  driver.quit();
};

