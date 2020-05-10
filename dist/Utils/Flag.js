"use strict";
/* tslint:disable no-bitwise*/
Object.defineProperty(exports, "__esModule", { value: true });
function convertBinaryToDecimal(binary) {
    return parseInt(binary, 2).toString(10);
}
exports.convertBinaryToDecimal = convertBinaryToDecimal;
function convertDecimalToBinary(decimal) {
    return (decimal >>> 0).toString(2);
}
exports.convertDecimalToBinary = convertDecimalToBinary;
function hasFlag(value, flag) {
    return (value & flag) === flag;
}
exports.hasFlag = hasFlag;
function setFlag(value, flag) {
    return value | flag;
}
exports.setFlag = setFlag;
function clearFlag(value, flag) {
    return value & ~flag;
}
exports.clearFlag = clearFlag;
/* tslint:enable */
