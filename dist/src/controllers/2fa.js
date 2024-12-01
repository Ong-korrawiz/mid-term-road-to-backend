"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyOTP = exports.getQRCode = void 0;
const speakeasy_1 = __importDefault(require("speakeasy"));
const qrcode_1 = __importDefault(require("qrcode"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
var secret = speakeasy_1.default.generateSecret({
    name: "MyApp"
});
const getQRCode = () => {
    qrcode_1.default.toDataURL(secret.otpauth_url, function (err, data_url) {
        console.log(secret);
        console.log(data_url);
        return data_url;
    });
};
exports.getQRCode = getQRCode;
const verifyOTP = (req, res) => {
    const token = req.headers['otp_token'];
    console.log(secret['ascii'], token);
    var verified = speakeasy_1.default.totp.verify({
        secret: secret['ascii'],
        encoding: 'ascii',
        token: String(token)
    });
    return verified;
};
exports.verifyOTP = verifyOTP;
