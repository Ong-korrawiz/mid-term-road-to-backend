"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const speakeasy_1 = __importDefault(require("speakeasy"));
const qrcode_1 = __importDefault(require("qrcode"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
var secret = speakeasy_1.default.generateSecret({
    name: "MyApp"
});
function getQRCode() {
    qrcode_1.default.toDataURL(secret.otpauth_url, function (err, data_url) {
        console.log(data_url);
        return data_url;
    });
}
exports.default = getQRCode;
