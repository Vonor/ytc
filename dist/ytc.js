#!/usr/bin/env node
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _commander = _interopRequireDefault(require("commander"));

var _package = _interopRequireDefault(require("../package.json"));

var _convert = _interopRequireDefault(require("./commands/convert"));

const version = _package.default.version; // const runTests = (file) => {
//   console.log('Run tests for file ' + file)
// }

const runConvert =
/*#__PURE__*/
function () {
  var _ref = (0, _asyncToGenerator2.default)(function* (file) {
    yield (0, _convert.default)(file);
  });

  return function runConvert(_x) {
    return _ref.apply(this, arguments);
  };
}(); // const runValidate = (file) => {
//   validate(file)
// }


_commander.default.version('ytc ' + version).allowUnknownOption(false);

_commander.default.command('convert <file>').alias('c').description('Convert <file>').action(
/*#__PURE__*/
function () {
  var _ref2 = (0, _asyncToGenerator2.default)(function* (file) {
    return yield runConvert(file);
  });

  return function (_x2) {
    return _ref2.apply(this, arguments);
  };
}()); // ytc
//   .command('test <file>')
//   .alias('t')
//   .description('Run tests against <file>')
//   .action((file) => runTests(file));
// ytc
//   .command('validate <file>')
//   .alias('v')
//   .description('Validate <file>')
//   .action((file) => runValidate(file));


_commander.default.on('command:*', function () {
  console.error('Invalid command: %s\n', _commander.default.args.join(' '));

  _commander.default.help();

  process.exit(1);
}); // end with parse to parse through the input


_commander.default.parse(process.argv); // Check whether we provided a command or not


if (process.argv.length == 2) {
  _commander.default.help();

  process.exit();
}