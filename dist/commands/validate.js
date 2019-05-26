"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _validate = _interopRequireDefault(require("../libs/validate"));

const validateFn =
/*#__PURE__*/
function () {
  var _ref = (0, _asyncToGenerator2.default)(function* (inputFile) {
    try {
      yield (0, _validate.default)(inputFile);
      console.log(inputFile + ': validation successful');
    } catch (e) {
      console.error(inputFile + ': validation failed');
      console.error(e);
      process.exit(1);
    }
  });

  return function validateFn(_x) {
    return _ref.apply(this, arguments);
  };
}();

module.exports = validateFn;
var _default = validateFn;
exports.default = _default;