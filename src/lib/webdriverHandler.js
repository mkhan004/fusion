'use strict';

const webdriver = require('selenium-webdriver');
const By = webdriver.By;
// const until = webdriver.until;

let driver;
let request = '';

module.exports.setCurrentRequest = (currentRequest) => {
  request = currentRequest;
};

module.exports.setDriver = () => {
  if (request.req.annotation === 'setup') {
    driver = new webdriver.Builder().forBrowser(request.config.browser).build();
    this.navigate(request.fullUrl);
  }
};

module.exports.navigate = (path) => {
  driver.get(path);
};

module.exports.getDriver = () => {
  return driver;
};

module.exports.processSendKeys = () => {
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
  webElement.sendKeys(data);
};

module.exports.click = (customVariable) => {
  let webElement = this.getWebElement(customVariable);
  webElement.click();
};

module.exports.getWebElement = (customVariable) => {
  let webElements = {
    email: driver.findElement(By.name('Email')),
    password: driver.findElement(By.name('Password')),
    submitButton: driver.findElement(By.name('submit'))
  };
  return webElements[customVariable];
};

module.exports.velidations = () => {
  if (this.validations) {
    console.log(this.validations);
  }
};

