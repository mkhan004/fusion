'use strict';

const fs = require('fs');

let collections = [];

class WebdriverHelper {
  constructor(request) {
    console.log(request);
    this.currentRequest = request;
    this.collections();
    this.plugins = this.loadPlugins();
    console.log(collections)
    this.plugins['setCurrentRequest'].apply(null, [this.currentRequest]);

    for (let key in collections) {
      if (collections.hasOwnProperty(key)) {
        if (this.plugins[collections[key]]) {
          this.plugins[collections[key]].apply(null, null);
        }
      }
    }
    collections = [];
  }

  collections() {
    if (this.currentRequest.req.annotation === 'setup') {
      collections.push('setDriver');
    }
    // if (this.currentRequest.req.hasOwnProperty('path')) {
    //   collections.push('navigate');
    // }
    if (this.currentRequest.req.hasOwnProperty('driverActions')) {
      if (this.currentRequest.req.driverActions.hasOwnProperty('navigate')) {
        collections.push('navigate');
      }
      if (this.currentRequest.req.driverActions.hasOwnProperty('sendKeys')) {
        collections.push('processSendKeys');
      }
      if (this.currentRequest.req.driverActions.hasOwnProperty('click')) {
        collections.push('processClicks');
      }
      if (this.currentRequest.req.driverActions.hasOwnProperty('get')) {
        collections.push('get');
      }
    }
    if (this.currentRequest.req.annotation === 'tearDown') {
      collections.push('tearDown');
    }
    if (this.currentRequest.req.hasOwnProperty('validate')) {
      collections.push('validations');
    }
    return collections;
  }

  loadPlugins() {
    try {
      let path = __dirname + `/webdriverHandler.js`;
      let plugins = fs.statSync(path);
      if (plugins && plugins.isFile()) {
        plugins = require(path);
      }
      return plugins;
    } catch (err) {
      console.error(err);
    }
  }
}

module.exports = WebdriverHelper;
