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
const fileWrite = (0, _util.promisify)(_fs.default.writeFile);
const mkdir = (0, _util.promisify)(_fs.default.mkdir);

_handlebars.default.registerHelper({
  'toLowerCase': str => {
    return str.toLowerCase();
  },
  'toUpperCase': str => {
    return str.toUpperCase();
  },
  'parse': str => {
    return JSON.parse(str);
  },
  'stringify': str => {
    return JSON.stringify(str, null, 2);
  },
  'assignjson': (varname, value, options) => {
    options.data.root[varname] = JSON.parse(value);
  },
  'is': (a, b, opts) => {
    if (a == b) {
      return opts.fn(void 0);
    } else {
      return opts.inverse(void 0);
    }
  },
  'isnot': (a, b, opts) => {
    if (a != b) {
      return opts.fn(void 0);
    } else {
      return opts.inverse(void 0);
    }
  },
  'length': a => {
    if (typeof a === 'object') return a.length;
    return '#';
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
      const outputextension = inputData.outputextension || '.conf';

      const outfile = _path.default.resolve(inputFile.replace('configs', 'output').replace(_path.default.extname(inputFile), outputextension));

      try {
        yield mkdir(_path.default.dirname(outfile), {
          recursive: true
        });
        yield fileWrite(outfile, result);
        console.log(`${outfile} written`);
      } catch (error) {
        throw error;
      }
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