#!/usr/bin/env node

const program = require('commander');
const utils = require('./src/lib/utils');
const Tosser = require('./src/lib/tosser');
const fs = require('fs');

program
  .version('1.0.0')
  .arguments('folder <folderPath> env <testEnv> cycle <testCycle> rps <requestPerSecond>')
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

let docFile = `doc/setup.yaml`;
let doc = utils.loadYAMLOrParse(folder, docFile);

doc.basePath = folder;
utils.writeReadmeFile(doc);

let requestFolders = config.requestFolders || ['requests'];

for (let reqFolder of requestFolders) {
  let path = `${folder}/${reqFolder}`;
  let files = fs.readdirSync(path);
  for (let fileName of files) {
    let requests = utils.loadYAMLOrParse(path, fileName);
    let tosser = new Tosser(config, requests, path + '/' + fileName);
    tosser.tossAll();
  }
}

// Display uncaught Exception.
process.on('uncaughtException', (err) => {
  console.error((new Date()).toUTCString() + ' uncaughtException:', err.message);
  console.error(err.stack);
  process.exit(1);
});

