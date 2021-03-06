'use strict';

const webdriverHelper = require('./webdriverHelper');
const traverse = require('traverse');
const utils = require('./utils');

let suiteSetup = true;

class TestGenerator {
  *testGenerator(request) {
    yield webdriverHelper.setRequestProperties(request);
    if (suiteSetup) {
      yield webdriverHelper.suiteSetup();
      yield webdriverHelper.setDriver();
      suiteSetup = false;
    }

    if (request.req.annotation === 'setup') {
      yield this.processSetup(request);
    }

    if (request.req.annotation === 'tearDown') {
      yield this.processTearDown(request);
    }

    if (request.req.annotation === 'test') {
      if (request.config.hasOwnProperty('testCaseNumber')) {
        if (request.req.id === parseInt(request.config.testCaseNumber, 10)) {
          yield this.processTest(request);
        }
      } else {
        yield this.processTest(request);
      }
    }
  }

  *processSetup(request) {
    yield webdriverHelper.startScenario();
    yield webdriverHelper.startBeforeTest();
    yield this.processTimeout(request);
    yield webdriverHelper.get();
    yield this.processSendKeys(request);
    yield this.processClicks(request);

    yield webdriverHelper.endBeforeTest();
  }

  *processTest(request) {
    yield webdriverHelper.startTest();
    yield this.processTimeout(request);

    yield this.processSendKeys(request);
    yield this.processClicks(request);
    yield this.processGet(request);
    yield this.processValidations(request);

    yield webdriverHelper.endTest();
  }

  *processTearDown(request) {
    yield webdriverHelper.startAfterTest();
    yield this.processClicks(request);

    yield webdriverHelper.quit();
    yield webdriverHelper.endAfterTest();
    yield webdriverHelper.endScenario();
  }

  *processTimeout(request) {
    if (request.req.hasOwnProperty('timeout')) {
      yield webdriverHelper.timeout(request.req.timeout);
    }
  }

  *processSendKeys(request) {
    if (request.req.hasOwnProperty('driverActions')) {
      if (request.req.driverActions.hasOwnProperty('sendKeys')) {
        let sendKeys = request.req.driverActions.sendKeys;
        for (let key in sendKeys) {
          if (sendKeys.hasOwnProperty(key)) {
            let element = yield this.getWebElement(key, request);
            yield webdriverHelper.sendKeys(element, sendKeys[key]);
          }
        }
      }
    }
  }

  *processGet(request) {
    if (request.req.hasOwnProperty('driverActions')) {
      if (request.req.driverActions.hasOwnProperty('get')) {
        let gets = request.req.driverActions.get;
        for (let key in gets) {
          if (gets.hasOwnProperty(key)) {
            if (key === 'getTitle') {
              yield webdriverHelper.getTitle(gets[key]);
            } else if (key === 'getCurrentUrl') {
              yield webdriverHelper.getCurrentUrl(gets[key]);
            }
          }
        }
      }
    }
  }

  *processClicks(request) {
    if (request.req.hasOwnProperty('driverActions')) {
      if (request.req.driverActions.hasOwnProperty('click')) {
        let clicks = request.req.driverActions.click;
        for (let key in clicks) {
          if (clicks.hasOwnProperty(key)) {
            let element = yield this.getWebElement(clicks[key], request);
            yield webdriverHelper.click(element);
          }
        }
      }
    }
  }

  *processValidations(request) {
    if (request.req.hasOwnProperty('validate')) {
      if (request.req.validate.hasOwnProperty('contains')) {
        let contains = request.req.validate.contains;
        for (let key in contains) {
          if (contains.hasOwnProperty(key)) {
            yield webdriverHelper.contains(key, contains[key]);
          }
        }
      }

      if (request.req.validate.hasOwnProperty('equals')) {
        let equals = request.req.validate.equals;
        for (let key in equals) {
          if (equals.hasOwnProperty(key)) {
            yield webdriverHelper.equals(key, equals[key]);
          }
        }
      }
    }
  }

  getWebElement(customVariable, request) {
    let elementFileName;
    if (customVariable.indexOf('.') > -1) {
      let array = customVariable.split('.');
      elementFileName = array[0].trim();
      customVariable = array[1].trim();
    } else {
      elementFileName = request.config.feature;
    }

    console.log('elements/' + elementFileName + '.yaml');

    return new Promise(function getWebElement(resolve) {
      let elements = utils.loadYAMLOrParse(
        request.config.basePath, 'elements/' + elementFileName + '.yaml')[0];

      let pathsArray = traverse(elements).paths();
      let present = false;

      pathsArray.forEach(function (path) {
        if (path.indexOf(customVariable) > -1) {
          let value = traverse(elements).get(path);
          path.splice(-1, 1);
          let parentPath = path.join('.');
          resolve(`driver.findElement(` + parentPath + `('${value}'))`);
          present = true;
        }
      });

      if (!present) {
        let err = `By type locator '${customVariable}' is not found in ${elementFileName}.yaml`;
        console.log(new Error(err));
        process.exit(1);
      }
    });
  }
}

module.exports = TestGenerator;

