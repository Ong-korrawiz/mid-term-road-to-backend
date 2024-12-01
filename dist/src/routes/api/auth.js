"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
const auth_1 = require("../../controllers/auth");
const _2fa_1 = require("../../controllers/2fa");
router.get('/username', auth_1.getUser);
router.post('/register', auth_1.addUser);
router.get('/login', auth_1.checkUser);
router.get('/login/2fa', _2fa_1.verifyOTP);
router.get('/test/role', auth_1.verifyToken, (req, res) => {
    res.status(200).json({ message: 'User content' });
    if (req.user) {
        console.log(req.user.role);
    }
});
router.get('/test/editor', auth_1.verifyToken, (req, res) => {
    var _a;
    if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) === "editor") {
        return res.status(200).json({ message: 'Editor content' });
    }
    console.log("Editor role required!");
    return res.status(403).json({ message: 'Editor role is required' });
});
exports.default = router;
