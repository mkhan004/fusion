#!/usr/bin/env node
'use strict';

const program = require('commander');
const utils = require('./src/lib/utils');
const FusionGenerator = require('./src/lib/fusionGenerator');
const fs = require('fs');
const co = require('co');

program
  .version('1.0.0')
  .arguments('folder <folderPath> env <testEnv> browser <browserName>')
  .option('-f, --folder <folderPath>', 'test suite folder path')
  .option('-e, --env <testEnv>', 'target test environment')
  .option('-b, --browser <browserName>', 'browser name')
  .parse(process.argv);

let folder = program.folder || '.';
let testEnv = program.env;
let browser = program.browser;

if (!folder || !testEnv || !browser) {
  program.outputHelp();
  process.exit(1);
}

let configFile = `/config/${testEnv}.yaml`;
let config = utils.loadYAMLOrParse(folder, configFile);

config.basePath = folder;
config.browser = browser;

let testPath = __dirname + '/test';

config.basePath = folder;

let requestFolders = config.requestFolders || ['requests'];

for (let reqFolder of requestFolders) {
  let path = `${folder}/${reqFolder}`;
  let files = fs.readdirSync(path);
  for (let fileName of files) {
    config.feature = fileName.replace('.yaml', '');
    let requests = utils.loadYAMLOrParse(path, fileName);
    let fusionGeneratorInstance = new FusionGenerator(config, requests, path + '/' + fileName);
    co(function *start() {
      testPath += `/${config.feature}.js`;
      yield fusionGeneratorInstance.fusion(testPath);
    });
  }
}

// Display uncaught Exception.
process.on('uncaughtException', (err) => {
  console.error((new Date()).toUTCString() + ' uncaughtException:', err.message);
  console.error(err.stack);
  process.exit(1);
});

