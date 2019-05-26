#!/usr/bin/env node

import ytc from 'commander';
import pkg from '../package.json';
import convert from './commands/convert';
import validateFn from './commands/validate';
const version = pkg.version;



// const runTests = (file) => {
//   console.log('Run tests for file ' + file)
// }
const runConvert = async (file) => {
  await convert(file)
}

const runValidate = (file) => {
  validateFn(file)
}

ytc
  .version('ytc ' + version)
  .allowUnknownOption(false);

ytc
  .command('convert <file>')
  .alias('c')
  .description('Convert <file>')
  .action( async (file) => await runConvert(file));

// ytc
//   .command('test <file>')
//   .alias('t')
//   .description('Run tests against <file>')
//   .action((file) => runTests(file));

ytc
  .command('validate <file>')
  .alias('v')
  .description('Validate <file>')
  .action((file) => runValidate(file));

ytc
  .on('command:*', function () {
    console.error('Invalid command: %s\n', ytc.args.join(' '));
    ytc.help();
    process.exit(1);
});

// end with parse to parse through the input
ytc.parse(process.argv);
// Check whether we provided a command or not
if (process.argv.length == 2) {
  ytc.help();
  process.exit();
}

