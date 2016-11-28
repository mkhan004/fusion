#!/usr/bin/env node
'use strict';

require('shelljs/global');
const program = require('commander');

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

exec(`generator -f ${folder} -e ${testEnv} -b ${browser}`, {silent:true});
exec(`npm test`, {silent:false}).stdout;
