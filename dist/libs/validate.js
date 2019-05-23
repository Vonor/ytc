"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _fs = _interopRequireDefault(require("fs"));

var _path = _interopRequireDefault(require("path"));

var _util = require("util");

var _jsYaml = _interopRequireDefault(require("js-yaml"));

var _mapTypes = _interopRequireDefault(require("mapTypes"));

var _isvalid = _interopRequireDefault(require("isvalid"));

const fileRead = (0, _util.promisify)(_fs.default.readFile);

const validate =
/*#__PURE__*/
function () {
  var _ref = (0, _asyncToGenerator2.default)(function* (inputFile) {
    try {
      const inputData = _jsYaml.default.safeLoad((yield fileRead(inputFile, 'utf8')));

      const schemaFile = yield fileRead(_path.default.resolve(process.cwd(), 'schemas', inputData.Schema + '.schema.yml'), 'utf8');

      const schemaData = _jsYaml.default.safeLoad(schemaFile);

      let schema = (0, _mapTypes.default)(schemaData, 'type');
      schema = (0, _mapTypes.default)(schema, 'match', {
        regex: true
      });
      const valid = yield (0, _isvalid.default)(inputData, schema);
      const result = JSON.parse(JSON.stringify(valid));
      return result;
    } catch (error) {
      console.log('error:', error);
      throw new Error(error);
    }
  });

  return function validate(_x) {
    return _ref.apply(this, arguments);
  };
}();

module.exports = validate;
var _default = validate;
exports.default = _default;