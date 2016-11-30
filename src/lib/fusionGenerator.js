'use strict';
const _ = require('lodash');
const FusionHelper = require('./fusionHelper');
const webdriverHelper = require('./webdriverHelper');
const TestGenerator = require('./testGenerator');
const utils = require('./utils');
const fs = require('fs');
const path = require('path');

let testGeneratorInstance = new TestGenerator();

module.exports = class FusionGenerator
{
  constructor(config, requests, fileName) {
    this.url = config.url;
    this.name = config.project;
    this.config = config;
    this.reactors = [];
    this.loadPlugins();
    this.requests = requests;
    for (let req of this.requests) {
      let fusionHelperInstance = new FusionHelper(req, this.savedResponses, config, this.plugins, fileName);
      this.reactors.push(fusionHelperInstance);
    }
  }

  loadPlugins() {
    try {
      let plugins = fs.statSync(`${this.config.basePath}/plugins/plugins.js`);
      if (plugins && plugins.isFile()) {
        if (path.isAbsolute(this.config.basePath)) {
          this.plugins = require(`${this.config.basePath}/plugins/plugins.js`);
        } else {
          this.plugins = require(`${process.cwd()}/${this.config.basePath}/plugins/plugins.js`);
        }
      }
    } catch (err) {
      console.error(err);
    }
  }

  *fusion(testPath) {
    for (let reactor of this.reactors) {
      console.log(JSON.stringify(reactor, null, 2));
      yield testGeneratorInstance.testGenerator(reactor);
    }

    let data = yield webdriverHelper.getFinalTestSuite();
    console.log(data);
    yield utils.writeMochaTest(testPath, data, true);
    data = '';
  }
};
