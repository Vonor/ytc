"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _validate = _interopRequireDefault(require("../libs/validate"));

var _path = _interopRequireDefault(require("path"));

var _util = require("util");

var _fs = _interopRequireDefault(require("fs"));

var _handlebars = _interopRequireDefault(require("handlebars"));

const fileRead = (0, _util.promisify)(_fs.default.readFile);

_handlebars.default.registerHelper({
  'toLowerCase': function (str) {
    return str.toLowerCase();
  },
  'toUpperCase': function (str) {
    return str.toUpperCase();
  },
  'parse': function (str) {
    return JSON.parse(str);
  },
  'stringify': function (str) {
    return JSON.stringify(str, null, 2);
  },
  'assignjson': function (varname, value, options) {
    options.data.root[varname] = JSON.parse(value);
  }
});

const convert =
/*#__PURE__*/
function () {
  var _ref = (0, _asyncToGenerator2.default)(function* (inputFile) {
    try {
      const inputData = yield (0, _validate.default)(inputFile);
      const templateData = yield fileRead(_path.default.resolve(process.cwd(), 'templates', inputData.Schema + '.template.hbs'), 'utf8');
      const template = yield _handlebars.default.compile(templateData);
      inputData.env = process.env;
      const result = yield template(inputData);
      console.log(result);
    } catch (error) {
      console.log(error);
      process.exit(1);
    }
  });

  return function convert(_x) {
    return _ref.apply(this, arguments);
  };
}();

module.exports = convert;
var _default = convert;
exports.default = _default;