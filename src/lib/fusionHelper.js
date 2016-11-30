'use strict';
const querystring = require('querystring');

module.exports = class FusionHelper {
  constructor(req, responses, config, plugins, fileName) {
    this.req = req;
    this.responses = responses;
    this.config = config;
    this.plugins = plugins;
    this.afterPlugin = this.req.afterPlugin;
    this.beforePlugin = this.req.beforePlugin;
    this.fileName = fileName;
    this.bindUrl(config.url, req, req.query);
  }

  bindUrl(url, req, queryParams) {
    let params = '';
    if (typeof queryParams === 'object') {
      params = querystring.stringify(queryParams);
    } else {
      params = queryParams;
    }

    let query = params ? '?' + params : '';

    if (req.hasOwnProperty('driverActions')) {
      if (req.driverActions.hasOwnProperty('navigate')) {
        let subDir = req.driverActions.navigate;
        this.fullUrl = `${url}${subDir}${query}`;
      }
    }
  }
};
