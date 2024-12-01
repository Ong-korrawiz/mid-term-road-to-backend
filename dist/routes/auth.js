"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = __importDefault(require("../db"));
const dotenv_1 = __importDefault(require("dotenv"));
const bcrypt = __importStar(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const _2fa_1 = __importDefault(require("./2fa"));
dotenv_1.default.config();
const router = (0, express_1.Router)();
;
const getUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    db_1.default.query('SELECT id, username, email FROM users;', (err, result) => {
        if (err) {
            res.status(500).json({ message: 'Error occurred while retrieving usernames.', error: err });
        }
        else {
            if (result.length === 0) {
                res.status(404).json({ message: 'User not found.' });
            }
            else {
                res.status(200).json({ message: 'User retrieved successfully.', data: result });
            }
        }
    });
});
const addUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password, email } = req.body;
    bcrypt.hash(password, Number(process.env.SALT), (err, hash) => {
        if (err) {
            console.log('Fail hashing the password');
        }
        console.log('Hashed password', hash);
        const sql = 'INSERT INTO users (username, password, role, email) VALUES (?, ?, ?, ?);';
        db_1.default.query(sql, [username, hash, process.env.DEFAULT_ROLE, email], (err, result) => {
            if (err) {
                if (err["code"] === "ER_DUP_ENTRY") {
                    console.log(err["message"]);
                }
                else {
                    res.status(500).json({ message: 'Error occurred while registering username.', error: err });
                }
                ;
            }
            else {
                res.status(200).json({ message: 'User registered successfully.', data: result });
            }
        });
    });
});
const checkUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    bcrypt.hash(password, Number(process.env.SALT), (err, hash) => {
        if (err) {
            console.log('Fail hashing the password');
        }
        db_1.default.query('SELECT * FROM users WHERE username=?', [username, hash], (err, result) => __awaiter(void 0, void 0, void 0, function* () {
            const user = result[0];
            const isPasswordValid = yield bcrypt.compare(password, user.password);
            console.log(isPasswordValid);
            if (err) {
                res.status(500).json({ message: 'Incorrect username or password', error: err });
                return;
            }
            if (result.length < 1 || !isPasswordValid) {
                res.status(401).json({ message: 'Incorrect username or password' });
                return;
            }
            const qrCode = (0, _2fa_1.default)();
            console.log("QR code: ", qrCode);
            const token = jsonwebtoken_1.default.sign({
                id: user.id,
                username: user.username,
                role: user.role,
            }, String(process.env.SECRET_KEY), { expiresIn: '1h' });
            console.log('Token', token);
            console.log('correct password', hash, result[0]['password']);
            res.status(200).json({ message: 'Login sucessful!' });
        }));
    });
});
const verifyToken = (req, res, next) => {
    console.log("CALLED!");
    const token = req.headers['authorization'];
    // console.log(req)
    console.log(token);
    if (!token) {
        return res.status(403).json({ message: 'Token is required' });
    }
    jsonwebtoken_1.default.verify(token, String(process.env.SECRET_KEY), (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Invalid token' });
        }
        req.user = decoded;
        next();
    });
};
router.get('/username', getUser);
router.post('/register', addUser);
router.get('/login', checkUser);
router.get('/test/role', verifyToken, (req, res) => {
    res.status(200).json({ message: 'User content' });
    if (req.user) {
        console.log(req.user.role);
    }
});
router.get('/test/editor', verifyToken, (req, res) => {
    var _a;
    if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) === "editor") {
        return res.status(200).json({ message: 'Editor content' });
    }
    console.log("Editor role required!");
    return res.status(403).json({ message: 'Editor role is required' });
});
exports.default = router;
